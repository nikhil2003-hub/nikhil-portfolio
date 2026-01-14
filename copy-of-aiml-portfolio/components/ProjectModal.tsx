
import React, { useEffect, useState } from 'react';
import type { Project } from '../types';
import { GoogleGenAI } from '@google/genai';
import WebcamObjectDetection from './WebcamObjectDetection';
import SentimentAnalysisLab from './SentimentAnalysisLab';
import { useAuth } from '../context/AuthContext';

interface ProjectModalProps {
    project: Project;
    onClose: () => void;
    startDeepDive?: boolean;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, startDeepDive = false }) => {
    const [deepDive, setDeepDive] = useState('');
    const [isDeepDiveLoading, setIsDeepDiveLoading] = useState(false);
    const { isAuthenticated, setIsLoginModalOpen } = useAuth();

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        const originalTitle = document.title;
        document.title = `${project.title} | Nikhilesh's Portfolio`;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
            document.title = originalTitle; // Restore original title on close
        };
    }, [onClose, project.title]);
    
    const formatDeepDiveHTML = (text: string) => {
        return text
            .replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => `<pre class="bg-gray-800 text-white rounded p-3 my-2 text-sm overflow-x-auto"><code>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`)
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^\* (.*$)/gm, '<li>$1</li>')
            .replace(/\n/g, '<br />')
            .replace(/<br \s*\/><(h[23]|li|pre)/g, '<$1')
            .replace(/<\/(pre|h2|h3|li)><br \s*\/?>/g, '</$1>');
    };

    const handleDeepDive = async () => {
        if (!isAuthenticated) {
            setIsLoginModalOpen(true);
            return;
        }

        setIsDeepDiveLoading(true);
        setDeepDive('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const prompt = `Provide a detailed technical deep dive for the project titled "${project.title}".
Structure your response using the following markdown format ONLY:

## Architecture
[Detailed explanation of the project's architecture.]

## Technologies Used
[List and explain the key technologies, libraries, and frameworks.]

## Challenges & Solutions
[Describe 1-2 main challenges faced during development and how they were overcome.]

Use markdown headings for sections and code blocks (e.g., \`\`\`python ... \`\`\`) for any technical snippets.`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
            });
            setDeepDive(formatDeepDiveHTML(response.text));
        } catch (error) {
            console.error("Error generating deep dive:", error);
            setDeepDive("<p>Sorry, I couldn't generate a deep dive at this moment.</p>");
        } finally {
            setIsDeepDiveLoading(false);
        }
    };

    useEffect(() => {
        if (startDeepDive && isAuthenticated) {
            handleDeepDive();
        }
    }, [startDeepDive, isAuthenticated]);

    const renderInteractiveComponent = () => {
         if (!isAuthenticated) {
            return (
                <div className="p-8 text-center">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Authentication Required</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Please log in to access this interactive demo.</p>
                    <button 
                        onClick={() => setIsLoginModalOpen(true)}
                        className="bg-cyan-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-cyan-600 transition-colors duration-300"
                    >
                        Log In to Continue
                    </button>
                </div>
            );
        }
        
        switch (project.slug) {
            case 'webcam-object-detection':
                return <WebcamObjectDetection />;
            case 'sentiment-analysis-api':
                return <SentimentAnalysisLab />;
            default:
                return null;
        }
    };
    
    // Special modal for interactive demos
    if (project.slug === 'webcam-object-detection' || project.slug === 'sentiment-analysis-api') {
        return (
            <div 
                className="fixed inset-0 bg-black bg-opacity-80 z-[100] flex justify-center items-center p-2 sm:p-4 animate-fade-in"
                onClick={onClose}
                role="dialog"
                aria-modal="true"
                aria-labelledby="project-title"
            >
                <div 
                    className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden w-full max-w-3xl max-h-[90vh] flex flex-col animate-slide-in-up"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-4 sm:p-6 flex justify-between items-start border-b border-gray-200 dark:border-gray-700">
                        <div>
                           <h2 id="project-title" className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{project.title}</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{project.description}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors flex-shrink-0 ml-4" aria-label="Close modal">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="p-4 sm:p-6 overflow-y-auto">
                        {renderInteractiveComponent()}
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
    }
    
    // Default modal for other projects
    const modalImage = project.image.replace('/400/300', '/800/450');
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 z-[100] flex justify-center items-center p-2 sm:p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-title"
        >
            <div 
                className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden w-full max-w-3xl max-h-[90vh] flex flex-col animate-slide-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative">
                    <img src={modalImage} alt={project.title} className="w-full h-auto max-h-[200px] sm:max-h-72 object-cover" />
                    <button onClick={onClose} className="absolute top-3 right-3 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors" aria-label="Close modal">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-4 sm:p-6 md:p-8 overflow-y-auto">
                    <h2 id="project-title" className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">{project.title}</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map(tag => (
                            <span key={tag} className="bg-gray-200 dark:bg-gray-700 text-cyan-700 dark:text-cyan-300 text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
                        ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-4 mb-6">
                        {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="bg-cyan-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-cyan-600 transition-colors duration-300 text-sm sm:text-base">
                                View Live Demo
                            </a>
                        )}
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold py-2 px-6 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 text-sm sm:text-base">
                                View on GitHub
                        </a>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <button onClick={handleDeepDive} disabled={isDeepDiveLoading} className="bg-transparent dark:bg-gray-800 text-cyan-600 dark:text-cyan-400 border border-cyan-500 dark:border-cyan-400 font-semibold py-2 px-6 rounded-full hover:bg-cyan-50 dark:hover:bg-cyan-900/50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isDeepDiveLoading ? 'Generating...' : 'Technical Deep Dive with AI'}
                        </button>
                        {isDeepDiveLoading && (
                            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-700 animate-pulse">
                                <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-cyan-500 dark:text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <p>Generating technical analysis... this may take a moment.</p>
                                </div>
                            </div>
                        )}
                        {deepDive && (
                             <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none mt-4 p-4 bg-gray-100 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-700" dangerouslySetInnerHTML={{__html: deepDive}}></div>
                        )}
                    </div>
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

export default ProjectModal;
