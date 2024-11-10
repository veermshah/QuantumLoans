// dashboard.jsx
import React from 'react';
import TransactionHistory from '../components/TransactionHistory';
import CryptoHealthScore from '../components/CryptoHealthScore';
import WalletAssets from '../components/WalletAssets';
import TradingViewChart from '../components/TradingViewChart';

function Dashboard({ walletAddress }) {
    const healthScore = 85;

    return (
        <div className="w-full min-h-screen text-white bg-white">
            <div className="w-full px-6 py-4">
                <h1 className="text-3xl font-bold mb-8">Crypto Dashboard</h1>

                <div className="flex flex-col lg:flex-row gap-8 w-full">
                    <div className="flex flex-col gap-8 lg:w-1/3 w-full">
                        <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-lg shadow-lg">
                            <CryptoHealthScore score={healthScore} />
                        </div>
                        <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-lg shadow-lg">
                            <WalletAssets walletAddress={walletAddress} />
                        </div>
                    </div>

                    <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-lg shadow-lg lg:w-2/3 w-full min-h-[500px]">
                        <TradingViewChart symbol="ETH-USD" />
                    </div>
                </div>

                <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-lg shadow-lg mt-8 w-full">
                    <TransactionHistory walletAddress={walletAddress} />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
