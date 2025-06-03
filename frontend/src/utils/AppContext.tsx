"use client";

import React, { createContext, useContext, useRef, useState } from "react";

type ActionMap = {
    [key: string]: () => void;
};

type AppContextType = {
    registerAction: (key: string, handler: () => void) => void;
    triggerAction: (key: string) => void;
    isLoading: boolean; // Add isLoading to context
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>; // Add setIsLoading to context
};

const AppContext = createContext<AppContextType>({
    registerAction: () => {},
    triggerAction: () => {},
    isLoading: false, // Default value
    setIsLoading: () => {}, // Default empty function
});

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const actionsRef = useRef<ActionMap>({});
    const [isLoading, setIsLoading] = useState(false);

    const registerAction = (key: string, handler: () => void) => {
        actionsRef.current[key] = handler;
    };

    const triggerAction = (key: string) => {
        actionsRef.current[key]?.();
    };

    return (
        <AppContext.Provider
            value={{ registerAction, triggerAction, isLoading, setIsLoading }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
