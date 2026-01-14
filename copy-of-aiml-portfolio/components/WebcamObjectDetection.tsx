
import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

// Define the structure of a detected object
interface Detection {
    bbox: [number, number, number, number];
    class: string;
    score: number;
}

const WebcamObjectDetection: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'running' | 'error'>('idle');
    const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [threshold, setThreshold] = useState(0.5);
    const [showDetections, setShowDetections] = useState(true);
    const [isDynamicThreshold, setIsDynamicThreshold] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const latestDetectionsRef = useRef<Detection[]>([]);

    // Use refs to pass state to the animation loop without re-triggering the effect
    const thresholdRef = useRef(threshold);
    useEffect(() => {
        thresholdRef.current = threshold;
    }, [threshold]);

    const showDetectionsRef = useRef(showDetections);
    useEffect(() => {
        showDetectionsRef.current = showDetections;
    }, [showDetections]);


    // Centralized function to stop the camera and cleanup resources
    const stopDetection = useCallback(() => {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setStatus('idle');
        setModel(null);
    }, []);


    // Main function to start the camera and load the model
    const startDetection = async () => {
        stopDetection(); 
        setStatus('loading');
        setErrorMessage('');
        
        if (window.isSecureContext === false) {
            setErrorMessage('Camera access requires a secure connection (HTTPS).');
            setStatus('error');
            return;
        }

        if (!navigator.mediaDevices?.getUserMedia) {
            setErrorMessage('Webcam access is not supported by your browser.');
            setStatus('error');
            return;
        }
        
        let stream: MediaStream;
        try {
            // Try for environment (rear) camera first.
            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
            });
        } catch (e) {
            console.warn("Failed to get 'environment' camera, falling back to default.", e);
            try {
                // If environment camera fails, try to get any available camera.
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
            } catch (err) {
                // This is the final catch block if both attempts fail.
                console.error('Initialization failed on both attempts:', err);
                
                if (err instanceof DOMException) {
                    switch (err.name) {
                        case 'NotAllowedError':
                        case 'PermissionDeniedError':
                            setErrorMessage('Camera permission denied. Please allow camera access in your browser settings and try again.');
                            break;
                        case 'NotFoundError':
                        case 'OverconstrainedError':
                            setErrorMessage('No suitable camera found. Please ensure a camera is connected and enabled.');
                            break;
                        case 'NotReadableError':
                        case 'TrackStartError':
                            setErrorMessage('The camera is already in use by another application. Please close the other app and try again.');
                            break;
                        default:
                            setErrorMessage(`Could not access the camera: ${err.message}.`);
                            break;
                    }
                } else if (err instanceof Error && (err.message.includes('Could not find a backend') || err.message.includes('WebGL'))) {
                     setErrorMessage('Failed to load AI model. Your browser might not support the required features (like WebGL). Please try another browser.');
                } else {
                    setErrorMessage('An unexpected error occurred during initialization.');
                }
                setStatus('error');
                return; // Stop execution if camera access fails
            }
        }

        // We have a stream, now set it up and load the model
        try {
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Wait for the video to be ready to play
                await new Promise<void>((resolve, reject) => {
                    if (!videoRef.current) {
                        reject(new Error("Video element disappeared"));
                        return;
                    }
                    videoRef.current.onloadedmetadata = () => resolve();
                });
            } else {
                throw new Error("Video element is not available.");
            }

            const loadedModel = await cocoSsd.load();
            setModel(loadedModel);
            setStatus('running');
        } catch (setupError) {
            console.error("Error during setup after getting stream:", setupError);
            setErrorMessage('Failed to setup video stream or load AI model. Please try again.');
            setStatus('error');
            stopDetection(); // Cleanup
        }
    };

    // This effect handles the high-frequency detection and rendering loop
    useEffect(() => {
        if (status !== 'running' || !model) {
            return;
        }

        const predictLoop = async () => {
            if (videoRef.current && videoRef.current.readyState === 4) {
                const detections = await model.detect(videoRef.current);
                latestDetectionsRef.current = detections; // Share detections via ref for other effects

                const canvas = canvasRef.current;
                const video = videoRef.current;
                if (!canvas || !video) {
                    animationFrameId.current = requestAnimationFrame(predictLoop);
                    return;
                }

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    animationFrameId.current = requestAnimationFrame(predictLoop);
                    return;
                }
                
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                if (showDetectionsRef.current) { // Use ref to avoid re-triggering effect
                    detections.forEach(prediction => {
                        if (prediction.score >= thresholdRef.current) { // Use ref here as well
                            const [x, y, width, height] = prediction.bbox;
                            const text = `${prediction.class} (${Math.round(prediction.score * 100)}%)`;

                            ctx.strokeStyle = '#06b6d4';
                            ctx.lineWidth = 2;
                            ctx.fillStyle = '#06b6d4';
                            ctx.font = '16px Inter';

                            ctx.beginPath();
                            ctx.rect(x, y, width, height);
                            ctx.stroke();

                            const textWidth = ctx.measureText(text).width;
                            ctx.fillRect(x, y, textWidth + 10, 20);
                            
                            ctx.fillStyle = '#ffffff';
                            ctx.fillText(text, x + 5, y + 16);
                        }
                    });
                }
            }
            animationFrameId.current = requestAnimationFrame(predictLoop);
        };
        animationFrameId.current = requestAnimationFrame(predictLoop);
    }, [status, model]);

    // This effect handles the dynamic threshold adjustment logic
    useEffect(() => {
        if (status !== 'running' || !isDynamicThreshold) {
            return; // Only run when active and feature is enabled
        }

        const adjustmentInterval = setInterval(() => {
            const detections = latestDetectionsRef.current;
            if (!detections || detections.length === 0) return;

            // Consider only reasonably confident detections for calculating the average
            const confidentDetections = detections.filter(d => d.score > 0.4);

            if (confidentDetections.length > 0) {
                const avgScore = confidentDetections.reduce((sum, d) => sum + d.score, 0) / confidentDetections.length;

                // Adjust the threshold to steer the average score towards a target of 0.7
                const targetScore = 0.7;
                const error = avgScore - targetScore;
                const adjustment = error * 0.05; // Use a small gain factor for smooth adjustments

                // Update the threshold state using the functional form to avoid dependency
                setThreshold(prevThreshold => {
                    const newThreshold = prevThreshold + adjustment;
                    // Clamp the value to a sensible range [0.2, 0.9]
                    return Math.max(0.2, Math.min(0.9, newThreshold));
                });
            }
        }, 500); // Adjust the threshold every 500ms

        return () => clearInterval(adjustmentInterval);
    }, [status, isDynamicThreshold]);


    // This effect is dedicated to cleaning up when the component unmounts.
    useEffect(() => {
        return () => {
            stopDetection();
        };
    }, [stopDetection]);


    return (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-700">
            {status === 'idle' && (
                <div className="text-center">
                    <p className="mb-4 text-gray-700 dark:text-gray-300">Click the button below to start the live object detection demo using your device's camera.</p>
                    <button onClick={startDetection} className="bg-cyan-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-cyan-600 transition-colors duration-300">
                        Start Camera
                    </button>
                </div>
            )}
            
            {(status === 'loading' || status === 'running') && (
                <>
                 <div className="relative w-full aspect-video rounded-md overflow-hidden bg-black flex items-center justify-center">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-contain" />
                    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
                    {status === 'loading' && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                            <svg className="animate-spin h-8 w-8 text-white mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p>Initializing Camera & AI Model...</p>
                        </div>
                    )}
                 </div>
                 {status === 'running' && (
                    <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700 space-y-4">
                        <div className="flex flex-col sm:flex-row items-center sm:justify-between px-2">
                            <label htmlFor="threshold" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-0">
                                Confidence Threshold: <span className="font-bold">{Math.round(threshold * 100)}%</span>
                            </label>
                            <input
                                id="threshold"
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={threshold}
                                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                                className="w-full sm:w-1/2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                aria-label="Confidence threshold"
                            />
                        </div>
                         <div className="flex items-center justify-center sm:justify-start px-2">
                            <input
                                type="checkbox"
                                id="dynamicThreshold"
                                checked={isDynamicThreshold}
                                onChange={(e) => setIsDynamicThreshold(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label htmlFor="dynamicThreshold" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Enable Dynamic Threshold
                                <span className="text-xs text-gray-500 dark:text-gray-400 block">Automatically adjusts confidence for better accuracy.</span>
                            </label>
                        </div>
                         <div className="flex space-x-2">
                            <button 
                                onClick={() => setShowDetections(!showDetections)} 
                                className="w-full bg-gray-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 transition-colors duration-300"
                            >
                                {showDetections ? 'Hide Detections' : 'Show Detections'}
                            </button>
                             <button 
                                onClick={stopDetection} 
                                className="w-full bg-red-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-600 transition-colors duration-300"
                            >
                                Stop Camera
                            </button>
                        </div>
                    </div>
                )}
                </>
            )}

            {status === 'error' && (
                <div className="text-center p-4 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-md">
                    <h4 className="font-bold mb-2">Initialization Failed</h4>
                    <p className="text-sm">{errorMessage}</p>
                    <button 
                        onClick={startDetection} 
                        className="mt-4 bg-transparent text-red-600 dark:text-red-300 font-semibold py-2 px-6 rounded-full border border-red-500 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/70 transition-colors duration-300"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default WebcamObjectDetection;
