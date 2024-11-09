import React from 'react';
import TransactionHistory from '../components/TransactionHistory';
import CryptoHealthScore from '../components/CryptoHealthScore';
import WalletAssets from '../components/WalletAssets';
import TradingViewChart from '../components/TradingViewChart';

function Dashboard() {
    const walletAddress = "WALLETHEXCODE";
    const healthScore = 85; // Placeholder score, could be calculated or fetched from an API

    return (
        <div className="container mx-auto mt-20 p-6">
            <h1 className="text-3xl font-bold text-white mb-8">Crypto Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-lg shadow-md min-h-[200px] flex items-center justify-center">
                    <CryptoHealthScore score={healthScore} />
                </div>
                <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-lg shadow-md min-h-[200px] flex items-center justify-center">
                    <TransactionHistory walletAddress={walletAddress} />
                </div>
                <div className="bg-neutral-800 border border-neutral-700  p-4 rounded-lg shadow-md min-h-[200px] flex items-center justify-center">
                    <WalletAssets walletAddress={walletAddress} />
                </div>
                <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-lg shadow-md min-h-[600px] flex items-center justify-center">
                <TradingViewChart symbol="BTCUSD" />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
