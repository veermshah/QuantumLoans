import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TransactionHistory() {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchTransactions() {
            try {
                const response = await axios.get('http://127.0.0.1:5000/transactions');
                console.log(response);
                if (response.data.transactions && Array.isArray(response.data.transactions)) {
                    setTransactions(response.data.transactions.reverse());
                } else {
                    setError("Failed to fetch transactions or unexpected response format");
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
                setError("Failed to load transactions.");
            }
        }
        fetchTransactions();
    }, []);

    const renderTransaction = (tx) => {
        return (
            <li key={tx.tx_hash} className="p-4 bg-gray-800 rounded-md text-white mb-4">
                <div className="flex justify-between">
                    <div>
                        <strong>Transaction Hash:</strong> <span className="text-blue-400">{tx.tx_hash}</span>
                    </div>
                    <div>
                        <strong>Type:</strong> {tx.transaction_type.toUpperCase()}
                    </div>
                </div>
                <div className="mt-2">
                    <strong>User Address:</strong> {tx.user_address}
                </div>
                <div>
                    <strong>Timestamp:</strong> {new Date(tx.timestamp).toLocaleString()}
                </div>
                <hr className="my-2 border-gray-600" />
                {tx.transaction_type === 'lend' && (
                    <div>
                        <div>
                            <strong>Token:</strong> {tx.token}
                        </div>
                        <div>
                            <strong>Amount:</strong> {tx.amount.toLocaleString()}
                        </div>
                        <div>
                            <strong>Interest Rate:</strong> {(tx.rate * 100).toFixed(2)}%
                        </div>
                        <div>
                            <strong>Interest Earned:</strong> {tx.interest.toLocaleString()}
                        </div>
                        <div>
                            <strong>Total Return:</strong> {tx.total.toLocaleString()}
                        </div>
                    </div>
                )}
                {tx.transaction_type === 'borrow' && (
                    <div>
                        <div>
                            <strong>Token Borrowed:</strong> {tx.token}
                        </div>
                        <div>
                            <strong>Amount Borrowed:</strong> {tx.amount.toLocaleString()}
                        </div>
                        <div>
                            <strong>Collateral Token:</strong> {tx.collateral_token}
                        </div>
                        <div>
                            <strong>Collateral Amount:</strong> {tx.collateral_amount.toLocaleString()}
                        </div>
                        <div>
                            <strong>Fee Rate:</strong> {(tx.fee_rate * 100).toFixed(2)}%
                        </div>
                        <div>
                            <strong>Fee:</strong> {tx.fee.toLocaleString()}
                        </div>
                        <div>
                            <strong>Total Due:</strong> {tx.total_due.toLocaleString()}
                        </div>
                    </div>
                )}
            </li>
        );
    };

    return (
        <div className="max-w-3xl mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
            {error ? (
                <div className="text-red-500">{error}</div>
            ) : transactions.length > 0 ? (
                <ul>
                    {transactions.map(tx => renderTransaction(tx))}
                </ul>
            ) : (
                <p className="text-neutral-400">No transactions found.</p>
            )}
        </div>
    );
}

export default TransactionHistory;
