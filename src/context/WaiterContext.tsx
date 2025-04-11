"use client";

import React, { createContext, useState, useContext } from 'react';

interface Waiter {
    id: string;
    upiId: string;
}

interface WaiterContextType {
    waiters: Waiter[];
    addWaiter: (waiter: Waiter) => void;
}

const WaiterContext = createContext<WaiterContextType | undefined>(undefined);

export const WaiterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [waiters, setWaiters] = useState<Waiter[]>([]);

    const addWaiter = (waiter: Waiter) => {
        setWaiters([...waiters, waiter]);
    };

    const value: WaiterContextType = {
        waiters,
        addWaiter,
    };

    return (
        <WaiterContext.Provider value={value}>
            {children}
        </WaiterContext.Provider>
    );
};

export const useWaiterContext = () => {
    const context = useContext(WaiterContext);
    if (!context) {
        throw new Error("useWaiterContext must be used within a WaiterProvider");
    }
    return context;
};
