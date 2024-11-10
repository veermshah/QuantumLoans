import React, { createContext, useContext, useState } from 'react';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState('');

    return (
        <WalletContext.Provider value={{ walletAddress, setWalletAddress }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);
