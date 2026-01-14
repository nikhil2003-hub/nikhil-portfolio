
import React, { useRef, useEffect } from 'react';

const AnimatedBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        
        // Settings
        let numParticles: number;
        const speed = 0.04;
        let particles: { x: number; y: number; z: number }[] = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            numParticles = Math.floor(canvas.width / 5);
            
            particles = [];
            for(let i = 0; i < numParticles; i++) {
                particles.push({
                    x: (Math.random() - 0.5) * canvas.width,
                    y: (Math.random() - 0.5) * canvas.height,
                    z: Math.random() * canvas.width
                });
            }
        };

        const draw = () => {
            if (!ctx) return;
            const isDarkMode = document.documentElement.classList.contains('dark');

            // Clear canvas to make background transparent, allowing section background to show
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);

            // Particle color
            ctx.fillStyle = isDarkMode ? 'rgba(200, 200, 255, 0.5)' : 'rgba(50, 50, 50, 0.5)';

            for(let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Update position (move towards camera)
                p.z -= speed;

                // Reset particle if it's too close (passed camera)
                if (p.z <= 0) {
                    p.x = (Math.random() - 0.5) * canvas.width;
                    p.y = (Math.random() - 0.5) * canvas.height;
                    p.z = canvas.width;
                }

                // 3D perspective projection
                const scale = canvas.width / p.z;
                const screenX = p.x * scale;
                const screenY = p.y * scale;
                const radius = Math.max(0, scale * 0.8); // size based on distance
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
            animationFrameId = requestAnimationFrame(draw);
        };

        resizeCanvas();
        draw();

        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Add a class for a gentle fade-in effect on the canvas
    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0 opacity-0 animate-fade-in-slow" />;
};

export default AnimatedBackground;
