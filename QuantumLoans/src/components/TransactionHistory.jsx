import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TransactionHistory({ walletAddress }) {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchTransactions() {
            try {
                const response = await axios.get(
                    `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&sort=desc&apikey=ETHERSCANAPIKEY`
                );
                if (Array.isArray(response.data.result)) {
                    setTransactions(response.data.result);
                } else {
                    setError("Failed to fetch transactions or unexpected response format");
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
                setError("Failed to load transactions.");
            }
        }
        fetchTransactions();
    }, [walletAddress]);

    return (
        <div>
            <h2 className="text-lg font-bold mb-2">Transaction History</h2>
            {error ? (
                <div className="text-red-500">{error}</div>
            ) : transactions.length > 0 ? (
                <ul className="space-y-1">
                    {transactions.map(tx => (
                        <li key={tx.hash} className="text-neutral-300">
                            {tx.from} → {tx.to} | {tx.value / 1e18} ETH | {new Date(tx.timeStamp * 1000).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-neutral-400">No transactions found.</p>
            )}
        </div>
    );
}

export default TransactionHistory;