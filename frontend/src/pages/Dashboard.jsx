import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TransactionHistory from "../components/TransactionHistory";
import CryptoHealthScore from "../components/CryptoHealthScore";
import WalletAssets from "../components/WalletAssets";
import TradingViewChart from "../components/TradingViewChart";

function Dashboard() {
    const navigate = useNavigate();
    const walletAddress = "WALLET_ADDRESS";
    const healthScore = 83;

    const [selectedCrypto, setSelectedCrypto] = useState("ETH");

    const cryptoButtons = [
        { name: "Ethereum", symbol: "ETH" },
        { name: "Bitcoin", symbol: "BTC" },
        { name: "Solana", symbol: "SOL" },
        { name: "Arbitrum", symbol: "ARB" },
    ];

    const handleCryptoSelect = (symbol) => {
        setSelectedCrypto(symbol);
    };

    return (
        <div className="w-full min-h-screen text-white bg-white">
            <div className="w-full px-6 py-4">
                <h1 className="text-3xl font-bold mb-8">Crypto Dashboard</h1>

                {/* Two-column layout for Crypto Health Score, Wallet Assets, and TradingView Chart */}
                <div className="flex flex-col lg:flex-row gap-8 w-full">
                    {/* Left column: Crypto Health Score and Wallet Assets */}
                    <div className="flex flex-col gap-3 lg:w-1/3 w-full">
                        <div
                            onClick={() => navigate("/cryptohealth")}
                            className="bg-neutral-800 border cursor-pointer border-neutral-700 p-4 rounded-lg shadow-lg hover:scale-105 duration-100"
                        >
                            <CryptoHealthScore score={healthScore} />
                        </div>
                        <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-lg shadow-lg">
                            <WalletAssets walletAddress={walletAddress} />
                        </div>
                        <div className="bg-neutral-800 p-4 rounded-lg shadow-lg">
                            <h1 className="font-bold text-lg">Chart</h1>
                            <div className="grid grid-cols-2 gap-4 my-8">
                                {cryptoButtons.map((crypto) => (
                                    <button
                                        key={crypto.symbol}
                                        onClick={() =>
                                            handleCryptoSelect(crypto.symbol)
                                        }
                                        className={`border rounded-lg py-4 font-bold text-xl hover:scale-105 duration-100 ${
                                            selectedCrypto === crypto.symbol
                                                ? "bg-white text-neutral-800"
                                                : "border-white text-white"
                                        }`}
                                    >
                                        {crypto.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right column: TradingView Chart */}
                    <div className=" p-2 rounded-lg shadow-lg lg:w-2/3 w-full min-h-[500px]">
                        <TradingViewChart symbol={`${selectedCrypto}-USD`} />
                    </div>
                </div>

                {/* Full-width Transaction History */}
                <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-lg shadow-lg mt-4 w-full">
                    <TransactionHistory walletAddress={walletAddress} />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
