
import React, { useState, useRef } from 'react';
import Section from '../components/Section';
import { GoogleGenAI, Type } from '@google/genai';
import { useAuth } from '../context/AuthContext';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center space-x-2">
        <div className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
);

const LabCard: React.FC<{ title: string, description: string, children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-lg border border-gray-200 dark:border-white/10 rounded-lg p-6 flex flex-col h-full">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">{description}</p>
        {children}
    </div>
);

const TextSummarizerLab: React.FC = () => {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSummarize = async () => {
        if (!text.trim()) return;
        setIsLoading(true);
        setError('');
        setSummary('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const prompt = `Summarize the following text into a few key points. Keep it concise and easy to understand.\n\nText: "${text}"`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
            });
            
            setSummary(response.text);
        } catch (e) {
            console.error(e);
            setError('Failed to summarize. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LabCard
            title="AI Text Summarizer"
            description="Paste any text below and let the AI generate a concise summary. Great for understanding long articles or documents quickly."
        >
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here..."
                rows={8}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-4 transition-colors"
            />
            <button
                onClick={handleSummarize}
                disabled={isLoading || !text.trim()}
                className="w-full bg-cyan-500 text-white font-semibold py-2.5 px-6 rounded-full hover:bg-cyan-600 transition-colors duration-300 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Summarizing...' : 'Summarize Text'}
            </button>
            {isLoading && <div className="mt-4"><LoadingSpinner /></div>}
            {error && <p className="text-red-500 dark:text-red-400 text-sm mt-4 text-center">{error}</p>}
            {summary && (
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-700">
                    <h4 className="font-bold text-gray-800 dark:text-white mb-2">Summary:</h4>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{summary}</p>
                </div>
            )}
        </LabCard>
    );
};

const ImageCaptioningLab: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            setCaption('');
            setError('');
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const fileToGenerativePart = async (file: File) => {
        const base64EncodedDataPromise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
            reader.readAsDataURL(file);
        });
        return {
            inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
        };
    };

    const handleGenerateCaption = async () => {
        if (!imageFile) return;
        setIsLoading(true);
        setError('');
        setCaption('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const imagePart = await fileToGenerativePart(imageFile);
            const prompt = "Describe this image in a single, engaging sentence.";

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: { parts: [imagePart, { text: prompt }] },
            });

            setCaption(response.text);

        } catch (e) {
            console.error(e);
            setError('Failed to generate caption. The model may be busy, or the image format is not supported.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LabCard
            title="AI Image Captioning"
            description="Upload an image and let a multimodal AI generate a descriptive caption for it."
        >
            <div className="flex-grow flex flex-col items-center justify-center">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                />
                {previewUrl ? (
                    <div className="w-full text-center">
                        <img src={previewUrl} alt="Image preview" className="max-h-48 w-auto mx-auto rounded-md mb-4 border border-gray-300 dark:border-gray-600" />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline mb-4"
                        >
                            Change image
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-full min-h-[12rem] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span>Click to upload image</span>
                    </button>
                )}
            </div>
            <button
                onClick={handleGenerateCaption}
                disabled={isLoading || !imageFile}
                className="w-full mt-4 bg-cyan-500 text-white font-semibold py-2.5 px-6 rounded-full hover:bg-cyan-600 transition-colors duration-300 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Generating...' : 'Generate Caption'}
            </button>
            {isLoading && <div className="mt-4"><LoadingSpinner /></div>}
            {error && <p className="text-red-500 dark:text-red-400 text-sm mt-4 text-center">{error}</p>}
            {caption && (
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-700">
                    <h4 className="font-bold text-gray-800 dark:text-white mb-2">Generated Caption:</h4>
                    <p className="text-gray-700 dark:text-gray-300 italic">"{caption}"</p>
                </div>
            )}
        </LabCard>
    );
};

const CodeExplainerLab: React.FC = () => {
    const [code, setCode] = useState('');
    const [explanation, setExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleExplain = async () => {
        if (!code.trim()) return;
        setIsLoading(true);
        setError('');
        setExplanation('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const prompt = `
            Act as an expert code reviewer and educator.
            Explain the following code snippet in a clear, concise, and easy-to-understand way.
            Structure your response using markdown.
            - First, identify the programming language.
            - Provide a high-level summary of what the code does.
            - Then, give a detailed, line-by-line or block-by-block explanation.
            - Finally, mention any potential improvements or best practices if applicable.

            Code:
            \`\`\`
            ${code}
            \`\`\`
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
            });
            
            let htmlExplanation = response.text
                .replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => `<pre class="bg-gray-200 dark:bg-gray-900 rounded p-3 my-2 text-sm overflow-x-auto"><code>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`)
                .replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-900 px-1 rounded text-sm font-mono">$1</code>')
                .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
                .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
                .replace(/^\* (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
                .replace(/\n/g, '<br />')
                .replace(/<br \s*\/><li/g, '<li') 
                .replace(/<\/pre><br \s*\/?>/g, '</pre>');

            setExplanation(htmlExplanation);

        } catch (e) {
            console.error(e);
            setError('Failed to generate explanation. The model might be busy or the code is too complex. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LabCard
            title="AI Code Explainer"
            description="Paste a code snippet and get a detailed, line-by-line explanation of what it does."
        >
            <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code snippet here..."
                rows={8}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-4 transition-colors font-mono text-sm"
                spellCheck="false"
            />
            <button
                onClick={handleExplain}
                disabled={isLoading || !code.trim()}
                className="w-full bg-cyan-500 text-white font-semibold py-2.5 px-6 rounded-full hover:bg-cyan-600 transition-colors duration-300 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Explaining...' : 'Explain Code'}
            </button>
            {isLoading && <div className="mt-4"><LoadingSpinner /></div>}
            {error && <p className="text-red-500 dark:text-red-400 text-sm mt-4 text-center">{error}</p>}
            {explanation && (
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-700">
                    <h4 className="font-bold text-gray-800 dark:text-white mb-2">Explanation:</h4>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2" dangerouslySetInnerHTML={{ __html: explanation }} />
                </div>
            )}
        </LabCard>
    );
// FIX: Added a semicolon to properly terminate the constant-assigned function expression.
// This resolves a parsing issue that caused subsequent errors in the file.
};

interface SentimentResult {
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  score: number; // -1 to 1
  explanation: string;
}

const SentimentGauge: React.FC<{ score: number }> = ({ score }) => {
  const rotation = score * 90; // Map score from -1 to 1 => -90deg to 90deg
  const color = score < -0.2 ? '#ef4444' : score > 0.2 ? '#22c55e' : '#6b7280';

  return (
    <div className="relative w-48 h-24 mx-auto mb-2">
      <svg viewBox="0 0 100 50" className="w-full h-full">
        <path d="M10 50 A 40 40 0 0 1 90 50" fill="none" strokeWidth="10" className="text-gray-200 dark:text-gray-700" strokeLinecap="round" />
        <path d="M10 50 A 40 40 0 0 1 90 50" fill="none" strokeWidth="10" strokeDasharray="125.6" strokeDashoffset="0" style={{ stroke: color, transition: 'stroke 0.5s' }} strokeLinecap="round" />
      </svg>
      <div
        className="absolute bottom-0 left-1/2 w-0.5 h-10 bg-gray-800 dark:bg-gray-200 origin-bottom transition-transform duration-500"
        style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
      ></div>
      <div className="absolute bottom-[-8px] left-1/2 w-4 h-4 bg-gray-800 dark:bg-gray-200 rounded-full transform -translate-x-1/2"></div>
    </div>
  );
};

const SentimentAnalysisLab: React.FC = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState<SentimentResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        if (!text.trim()) return;

        setIsLoading(true);
        setError('');
        setResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const prompt = `Analyze the sentiment of the following text and provide a structured JSON response. Text: "${text}"`;
            
            const responseSchema = {
              type: Type.OBJECT,
              properties: {
                sentiment: { type: Type.STRING, enum: ["Positive", "Negative", "Neutral"] },
                score: { type: Type.NUMBER, description: "A score from -1 (very negative) to 1 (very positive)" },
                explanation: { type: Type.STRING, description: "A brief explanation for the sentiment classification." }
              },
              required: ["sentiment", "score", "explanation"]
            };

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: responseSchema,
                },
            });
            
            const jsonString = response.text.trim();
            const parsedResult: SentimentResult = JSON.parse(jsonString);
            setResult(parsedResult);

        } catch (e) {
            console.error(e);
            setError('Failed to analyze sentiment. The AI may be experiencing high traffic. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const sentimentStyles = {
        Positive: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        Negative: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        Neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };

    return (
        <LabCard
            title="Live Sentiment Analysis"
            description="Enter any text to analyze its sentiment in real-time. The AI provides a score, a classification, and a brief explanation."
        >
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to analyze... (e.g., 'This portfolio is absolutely fantastic!')"
                rows={5}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-4 transition-colors"
            />
            <button 
                onClick={handleAnalyze} 
                disabled={isLoading || !text.trim()} 
                className="w-full bg-cyan-500 text-white font-semibold py-2.5 px-6 rounded-full hover:bg-cyan-600 transition-colors duration-300 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Analyzing...' : 'Analyze Sentiment'}
            </button>

            {isLoading && <div className="mt-4"><LoadingSpinner /></div>}
            
            {error && <p className="text-red-500 dark:text-red-400 text-sm mt-4 text-center">{error}</p>}

            {result && (
                <div className="mt-6 text-center animate-fade-in">
                    <SentimentGauge score={result.score} />
                    <div className="flex justify-center items-center gap-4">
                      <span className={`px-4 py-1.5 text-lg font-bold rounded-full ${sentimentStyles[result.sentiment]}`}>
                          {result.sentiment}
                      </span>
                      <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                        Score: {result.score.toFixed(2)}
                      </span>
                    </div>
                    <blockquote className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-gray-700 dark:text-gray-300 border-l-4 border-cyan-500 dark:border-cyan-400 text-left italic">
                        {result.explanation}
                    </blockquote>
                </div>
            )}
            <style>{`
              @keyframes fade-in {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
              }
              .animate-fade-in {
                  animation: fade-in 0.5s ease-out forwards;
              }
            `}</style>
        </LabCard>
    );
};

const ImageGeneratorLab: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateImage = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError('');
        setImageUrl('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: '1:1',
                },
            });

            if (response.generatedImages && response.generatedImages.length > 0) {
                const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
                const url = `data:image/jpeg;base64,${base64ImageBytes}`;
                setImageUrl(url);
            } else {
                throw new Error("No image was generated by the API.");
            }

        } catch (e) {
            console.error(e);
            setError('Failed to generate image. The model might be busy, or your prompt may have been blocked. Please try a different prompt.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LabCard
            title="AI Image Generator"
            description="Describe an image you want to create, and the AI will bring it to life. Be as creative and detailed as you like!"
        >
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A photorealistic image of an astronaut riding a horse on Mars"
                rows={3}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-4 transition-colors"
            />
            <button
                onClick={handleGenerateImage}
                disabled={isLoading || !prompt.trim()}
                className="w-full bg-cyan-500 text-white font-semibold py-2.5 px-6 rounded-full hover:bg-cyan-600 transition-colors duration-300 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Generating...' : 'Generate Image'}
            </button>
            
            <div className="mt-4 flex-grow flex items-center justify-center bg-gray-100 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-700 min-h-[256px]">
                {isLoading && <LoadingSpinner />}
                {error && <p className="text-red-500 dark:text-red-400 text-sm text-center p-4">{error}</p>}
                {imageUrl && !isLoading && (
                    <a href={imageUrl} download="ai-generated-image.jpg" title="Click to download the image">
                        <img 
                            src={imageUrl} 
                            alt={prompt} 
                            className="max-w-full max-h-64 object-contain rounded-md animate-fade-in" 
                        />
                    </a>
                )}
                {!isLoading && !imageUrl && !error && (
                    <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-sm">Your generated image will appear here.</span>
                    </div>
                )}
            </div>
             <style>{`
              @keyframes fade-in {
                  from { opacity: 0; }
                  to { opacity: 1; }
              }
              .animate-fade-in {
                  animation: fade-in 0.5s ease-out forwards;
              }
            `}</style>
        </LabCard>
    );
};


const LabsSection: React.FC = () => {
    const { isAuthenticated, setIsLoginModalOpen } = useAuth();

    if (!isAuthenticated) {
        return (
            <Section id="labs" title="Interactive Labs">
                <div className="max-w-4xl mx-auto text-center p-8 bg-white/60 dark:bg-gray-800/40 backdrop-blur-lg border border-gray-200 dark:border-white/10 rounded-lg">
                    <div className="mx-auto mb-4 h-12 w-12 text-cyan-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Restricted</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        The interactive AI labs are available for authenticated users. Please log in to experiment with live AI models.
                    </p>
                    <button
                        onClick={() => setIsLoginModalOpen(true)}
                        className="bg-cyan-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-cyan-600 transition-colors duration-300"
                    >
                        Log In to Access Labs
                    </button>
                </div>
            </Section>
        );
    }
    
    return (
        <Section id="labs" title="Interactive Labs">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <TextSummarizerLab />
                <ImageCaptioningLab />
                <SentimentAnalysisLab />
                <ImageGeneratorLab />
                <div className="md:col-span-2">
                    <CodeExplainerLab />
                </div>
            </div>
        </Section>
    );
};

export default LabsSection;
