import React, { useEffect, useState } from 'react';
import axios from 'axios';

function WalletAssets({ walletAddress }) {
    const [assets, setAssets] = useState([]);

    useEffect(() => {
        async function fetchAssets() {
            try {
                const response = await axios.get(
                    `https://api.etherscan.io/api?module=account&action=tokenlist&address=${walletAddress}&apikey=ETHERSCANAPIKEY`
                );
                const data = response.data.result;
                setAssets(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching assets:', error);
                setAssets([]);
            }
        }
        fetchAssets();
    }, [walletAddress]);

    return (
        <div>
            <h2 className="text-lg font-bold mb-2">Wallet Assets</h2>
            <ul className="list-disc list-inside space-y-1">
                {assets.length > 0 ? (
                    assets.map((asset, index) => (
                        <li key={index} className="text-neutral-300">{asset.tokenName || 'Unnamed Token'}</li>
                    ))
                ) : (
                    <p className="text-neutral-400">No assets available</p>
                )}
            </ul>
        </div>
    );
}

export default WalletAssets;