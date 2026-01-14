import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { useAuth } from '../context/AuthContext';

interface SentimentResult {
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  score: number; // -1 to 1
  explanation: string;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center space-x-2">
        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
);

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
    const { isAuthenticated, setIsLoginModalOpen } = useAuth();

    const handleAnalyze = async () => {
        if (!isAuthenticated || !text.trim()) return;

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
                model: 'gemini-2.5-flash',
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
    
    if (!isAuthenticated) {
      return (
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-md text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Authentication is required for the sentiment analysis demo.</p>
            <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-cyan-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-cyan-600 transition-colors duration-300"
              >
                Log In to Continue
              </button>
        </div>
      );
    }

    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-md">
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
        </div>
    );
};

export default SentimentAnalysisLab;