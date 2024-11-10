import React from "react";

function WalletAssets() {
    // Hardcoded assets for Solana, Bitcoin, Ethereum, and Arbitrum
    const assets = [
        { tokenName: "Solana", amount: 100.5 },
        { tokenName: "Bitcoin", amount: 0.25 },
        { tokenName: "Ethereum", amount: 2.1 },
        { tokenName: "Arbitrum", amount: 150.75 },
    ];

    return (
        <div>
            <h2 className="text-lg font-bold mb-8">Wallet Assets</h2>
            <ul className="list-disc list-inside space-y-2">
                {assets.length > 0 ? (
                    assets.map((asset, index) => (
                        <div
                            key={index}
                            className="bg-gray-100 font-bold text-lg shadow-2xl rounded-2xl px-4 py-2 text-black"
                        >
                            {asset.tokenName}: {asset.amount} units
                        </div>
                    ))
                ) : (
                    <p className="text-neutral-400">No assets available</p>
                )}
            </ul>
        </div>
    );
}

export default WalletAssets;
