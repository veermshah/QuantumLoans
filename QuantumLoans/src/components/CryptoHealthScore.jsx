import React from 'react';

function CryptoHealthScore({ score }) {
    return (
        <div>
            <h2 className="text-lg font-bold mb-2">Crypto Health Score</h2>
            <p className="text-3xl font-semibold text-green-400">{score}</p>
        </div>
    );
}

export default CryptoHealthScore;