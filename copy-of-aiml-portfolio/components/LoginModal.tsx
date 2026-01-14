import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginModal: React.FC = () => {
    const { isLoginModalOpen, setIsLoginModalOpen, login } = useAuth();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLoginAttempt = () => {
        if (password === '2309') {
            setError('');
            setPassword('');
            login(); // This will set isAuthenticated to true and close the modal
        } else {
            setError('Unauthorized user cannot access labs');
            setPassword('');
        }
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleLoginAttempt();
        }
    };

    const handleClose = () => {
        setError('');
        setPassword('');
        setIsLoginModalOpen(false);
    }

    if (!isLoginModalOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 z-[200] flex justify-center items-center p-4 animate-fade-in"
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-title"
        >
            <div 
                className="bg-white/95 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden w-full max-w-sm animate-slide-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8 text-center">
                    <div className="mx-auto mb-4 h-12 w-12 text-cyan-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 id="login-title" className="text-2xl font-bold text-gray-900 dark:text-white">
                        Access Restricted
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Please enter the password to access the interactive labs.
                    </p>

                    <div className="mt-6">
                        <label htmlFor="password-input" className="sr-only">Password</label>
                        <input
                            id="password-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter password"
                            autoFocus
                            className={`w-full bg-gray-100 dark:bg-gray-700 border rounded-md py-3 px-4 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-cyan-500'}`}
                        />
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>

                    <div className="mt-4">
                        <button
                            onClick={handleLoginAttempt}
                            className="w-full bg-cyan-500 text-white font-semibold py-3 px-6 rounded-full hover:bg-cyan-600 transition-colors duration-300"
                        >
                            Enter Labs
                        </button>
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

export default LoginModal;