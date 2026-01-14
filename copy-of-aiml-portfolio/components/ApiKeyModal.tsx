import React, { useState } from 'react';
import { useApiKey } from '../context/ApiKeyContext';

const ApiKeyModal: React.FC = () => {
    const { apiKey, setApiKey, isApiKeyModalOpen, setIsApiKeyModalOpen } = useApiKey();
    const [inputValue, setInputValue] = useState(apiKey || '');

    const handleSave = () => {
        if (inputValue.trim()) {
            setApiKey(inputValue.trim());
        }
    };

    const handleClose = () => {
        // Only allow closing if a key already exists.
        // First-time users must enter a key.
        if (apiKey) {
           setIsApiKeyModalOpen(false);
        }
    }

    if (!isApiKeyModalOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 z-[200] flex justify-center items-center p-4 animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="api-key-title"
        >
            <div 
                className="bg-white/95 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden w-full max-w-lg animate-slide-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <h2 id="api-key-title" className="text-2xl font-bold text-gray-900 dark:text-white">
                            Set Your Gemini API Key
                        </h2>
                        {apiKey && (
                             <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors flex-shrink-0 ml-4" aria-label="Close modal">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        To use the AI-powered features of this portfolio (like the chatbot and interactive labs), you need to provide your own Google AI Gemini API key.
                    </p>
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-500 dark:text-cyan-400 hover:underline text-sm font-semibold">
                        Get your API key from Google AI Studio &rarr;
                    </a>

                    <div className="mt-6">
                        <label htmlFor="api-key-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Your API Key
                        </label>
                        <input
                            id="api-key-input"
                            type="password"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Enter your API key here"
                            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-3 px-4 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                        {apiKey && (
                             <button 
                                onClick={handleClose}
                                className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2 px-6 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={!inputValue.trim()}
                            className="bg-cyan-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-cyan-600 transition-colors duration-300 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            Save Key
                        </button>
                    </div>
                     <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                        Your key is stored only in your browser's local storage and is never sent to any servers.
                    </p>
                </div>
            </div>
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                @keyframes slide-in-up { from { transform: translateY(20px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
                .animate-slide-in-up { animation: slide-in-up 0.4s ease-out forwards; }
             `}</style>
        </div>
    );
};

export default ApiKeyModal;
