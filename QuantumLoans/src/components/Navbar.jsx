import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSDK } from '@metamask/sdk-react';

function Navbar() {
    const [active, setActive] = useState('');
    const [account, setAccount] = useState('');
    const { sdk, connected, connecting } = useSDK();

    useEffect(() => {
        const checkConnection = async () => {
            if (sdk && connected) {
                try {
                    const accounts = await sdk.connect();
                    setAccount(accounts[0]);
                } catch (err) {
                    console.error("Failed to get accounts", err);
                    setAccount('');
                }
            } else {
                setAccount('');
            }
        };

        checkConnection();
    }, [sdk, connected]);

    const handleClick = (page) => {
        setActive(page);
    }

    const connectWallet = async () => {
        try {
            const accounts = await sdk?.connect();
            setAccount(accounts?.[0]);
        } catch (err) {
            console.error("Failed to connect", err);
        }
    }

    const disconnectWallet = async () => {
        try {
            await sdk?.disconnect();
            setAccount('');
        } catch (err) {
            console.error("Failed to disconnect", err);
        }
    }

    const navItems = [
        { name: 'DASHBOARD', path: '/dashboard' },
        { name: 'CRYPTOHEALTH', path: '/cryptohealth' },
        { name: 'LEND', path: '/lend' },
        { name: 'BORROW', path: '/borrow' },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full bg-black border-b border-neutral-800">
            <div className="mx-auto flex items-center justify-between px-6 py-3">
                {/* Logo */}
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-4">
                        <span className="text-black font-bold">A</span>
                    </div>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 flex justify-center">
                    <div className="flex space-x-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                                    active === item.name.toLowerCase()
                                        ? 'bg-neutral-800 text-white hover:text-green-500'
                                        : 'text-neutral-400 hover:text-white'
                                }`}
                                onClick={() => handleClick(item.name.toLowerCase())}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Connect/Disconnect Wallet Button */}
                {!account ? (
                    <button 
                        onClick={connectWallet}
                        disabled={connecting}
                        className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-black text-sm font-medium rounded flex items-center gap-2"
                    >
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        {connecting ? 'Connecting...' : 'Connect Wallet'}
                    </button>
                ) : (
                    <button 
                        onClick={disconnectWallet}
                        className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-black text-sm font-medium rounded flex items-center gap-2"
                    >
                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                        {`${account.slice(0, 6)}...${account.slice(-4)}`}
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;