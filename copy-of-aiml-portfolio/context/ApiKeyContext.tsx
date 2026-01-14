import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface ApiKeyContextType {
    apiKey: string | null;
    setApiKey: (key: string | null) => void;
    isApiKeyModalOpen: boolean;
    setIsApiKeyModalOpen: (isOpen: boolean) => void;
}

export const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [apiKey, setApiKeyState] = useState<string | null>(null);
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        // Try to get the key from localStorage on initial load
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) {
            setApiKeyState(storedKey);
        } else {
            // If no key, open the modal for the user to enter one.
            setIsApiKeyModalOpen(true);
        }
        setIsInitialLoad(false);
    }, []);

    const setApiKey = (key: string | null) => {
        setApiKeyState(key);
        if (key) {
            localStorage.setItem('gemini_api_key', key);
            setIsApiKeyModalOpen(false); // Close modal on save
        } else {
            localStorage.removeItem('gemini_api_key');
        }
    };

    // Avoid rendering children until we have checked for the key, to prevent flashes of disabled content
    if (isInitialLoad) {
        return null; 
    }

    return (
        <ApiKeyContext.Provider value={{ apiKey, setApiKey, isApiKeyModalOpen, setIsApiKeyModalOpen }}>
            {children}
        </ApiKeyContext.Provider>
    );
};

export const useApiKey = (): ApiKeyContextType => {
    const context = useContext(ApiKeyContext);
    if (context === undefined) {
        throw new Error('useApiKey must be used within an ApiKeyProvider');
    }
    return context;
};
