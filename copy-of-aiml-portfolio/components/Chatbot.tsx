
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);

const ThinkingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const WebSearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
    </svg>
);


interface Message {
    role: 'user' | 'model';
    text: string;
    sources?: any[];
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: "Hello! I'm an AI assistant. How can I help you learn more about Nikhilesh's portfolio?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const [useThinkingMode, setUseThinkingMode] = useState(false);
    const [useWebSearch, setUseWebSearch] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const aiRef = useRef<GoogleGenAI | null>(null);

    // Initialize AI instance once.
    useEffect(() => {
        if (process.env.API_KEY) {
            aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
        }
    }, []);

    useEffect(() => {
        if (aiRef.current) {
            let modelName = 'gemini-3-flash-preview';
            const modelParams: any = {};
            
            if (useThinkingMode) {
                modelName = 'gemini-3-pro-preview';
                modelParams.config = { thinkingConfig: { thinkingBudget: 32768 } };
            } else if (useWebSearch) {
                modelName = 'gemini-3-flash-preview';
                modelParams.config = { tools: [{googleSearch: {}}] };
            }

            const chatHistory = messages
              .filter(msg => !msg.text.includes('mode enabled') && !msg.text.includes('mode disabled'))
              .map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            }));

            const newChat = aiRef.current.chats.create({
                model: modelName,
                ...modelParams,
                history: chatHistory,
            });
            setChat(newChat);
        }
    }, [useThinkingMode, useWebSearch, messages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const handleToggleThinkingMode = () => {
        if (useWebSearch) setUseWebSearch(false);
        const thinkingModeEnabled = !useThinkingMode;
        setUseThinkingMode(thinkingModeEnabled);
        setMessages(prev => [...prev, { role: 'model', text: `Thinking mode ${thinkingModeEnabled ? 'enabled' : 'disabled'}. Complex queries will now be handled by a more powerful model.` }]);
    };

    const handleToggleWebSearch = () => {
        if (useThinkingMode) setUseThinkingMode(false);
        const webSearchEnabled = !useWebSearch;
        setUseWebSearch(webSearchEnabled);
        setMessages(prev => [...prev, { role: 'model', text: `Web search ${webSearchEnabled ? 'enabled' : 'disabled'}. I can now access up-to-date information.` }]);
    };

    const handleSendMessage = async () => {
        if (input.trim() === '' || isLoading || !chat) return;

        const userMessage: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chat.sendMessage({ message: userMessage.text });

            const modelMessage: Message = {
                role: 'model',
                text: response.text,
                sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
            };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error) {
            console.error('Error sending message to Gemini:', error);
            const errorMessage: Message = { role: 'model', text: 'Sorry, something went wrong. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-cyan-500 text-white p-4 rounded-full shadow-lg hover:bg-cyan-600 transition-transform duration-300 transform hover:scale-110 z-50"
                aria-label="Toggle Chatbot"
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-full max-w-sm h-full max-h-[600px] flex flex-col bg-white/80 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-200 dark:border-white/10 rounded-lg shadow-2xl z-50 animate-fade-in-up">
                    <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">AI Assistant</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Powered by Gemini</p>
                        </div>
                        <div className="flex items-center space-x-2">
                             <button onClick={handleToggleThinkingMode} title="Thinking Mode" className={`flex items-center p-2 rounded-full text-xs ${useThinkingMode ? 'bg-cyan-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
                                <ThinkingIcon />
                            </button>
                             <button onClick={handleToggleWebSearch} title="Web Search" className={`flex items-center p-2 rounded-full text-xs ${useWebSearch ? 'bg-cyan-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
                                <WebSearchIcon />
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                                    <p className="text-sm" dangerouslySetInnerHTML={{__html: msg.text.replace(/\n/g, '<br />')}}></p>
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                                            <h4 className="text-xs font-semibold mb-1">Sources:</h4>
                                            <ul className="text-xs space-y-1">
                                                {msg.sources.map((source, i) => (
                                                    source.web && <li key={i}>
                                                        <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-cyan-600 dark:text-cyan-300 hover:underline truncate block">
                                                           {i + 1}. {source.web.title}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
                                        <div className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                        <div className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask a question..."
                                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full py-2 px-4 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSendMessage}
                                className="bg-cyan-500 text-white p-2 rounded-full hover:bg-cyan-600 disabled:bg-gray-600"
                                disabled={isLoading || input.trim() === ''}
                            >
                                <SendIcon />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </>
    );
};

export default Chatbot;
