import React from 'react';

function WalletAssets() {
    // Hardcoded assets for Solana, Bitcoin, Ethereum, and Arbitrum
    const assets = [
        { tokenName: 'Solana', amount: 100.5 },
        { tokenName: 'Bitcoin', amount: 0.25 },
        { tokenName: 'Ethereum', amount: 2.1 },
        { tokenName: 'Arbitrum', amount: 1500.75 }
    ];

    return (
        <div>
            <h2 className="text-lg font-bold mb-2">Wallet Assets</h2>
            <ul className="list-disc list-inside space-y-1">
                {assets.length > 0 ? (
                    assets.map((asset, index) => (
                        <li key={index} className="text-neutral-300">
                            {asset.tokenName}: {asset.amount} units
                        </li>
                    ))
                ) : (
                    <p className="text-neutral-400">No assets available</p>
                )}
            </ul>
        </div>
    );
}

export default WalletAssets;
