import React, { useEffect, useState } from "react";

export default function HealthRow(props) {
    const [cryptoData, setCryptoData] = useState(null);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false); // State to control dropdown visibility

    useEffect(() => {
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                "x-cg-demo-api-key": "CG-SBuKTfJpS4TfuzbyQKnvkxRU",
            },
        };

        fetch(`https://api.coingecko.com/api/v3/coins/${props.id}`, options)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setCryptoData(data);
                
                // Create detailed market description
                const marketDescription = {
                    name: data.name,
                    symbol: data.symbol,
                    currentPrice: data.market_data.current_price.usd,
                    marketCap: data.market_data.market_cap.usd,
                    priceChange24h: data.market_data.price_change_percentage_24h,
                    athDistance: ((data.market_data.current_price.usd - data.market_data.ath.usd) / data.market_data.ath.usd) * 100,
                    liquidityRisk: data.market_data.market_cap.usd / data.market_data.total_volume.usd,
                    riskScore: (data.market_data.price_change_percentage_24h / 100) * data.market_data.current_price.usd,
                    timestamp: new Date().toISOString(),
                    analysis: {
                        riskLevel: getRiskLevel(data),
                        liquidityAssessment: getLiquidityAssessment(data),
                        priceStatus: getPriceStatus(data)
                    }
                };

                // Store in localStorage with unique key for each crypto
                localStorage.setItem(
                    `crypto_analysis_${data.id}`, 
                    JSON.stringify(marketDescription)
                );
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
                setError(err.message);
            });
    }, [props.id]); // Added props.id as dependency

    // Helper functions for analysis
    const getRiskLevel = (data) => {
        const riskScore = (data.market_data.price_change_percentage_24h / 100) * data.market_data.current_price.usd;
        if (riskScore > 500) return "High Risk";
        if (riskScore >= 50) return "Medium Risk";
        return "Low Risk";
    };

    const getLiquidityAssessment = (data) => {
        const liquidityRatio = data.market_data.market_cap.usd / data.market_data.total_volume.usd;
        if (liquidityRatio > 100) return "Low Liquidity";
        if (liquidityRatio > 50) return "Medium Liquidity";
        return "High Liquidity";
    };

    const getPriceStatus = (data) => {
        const athDistance = ((data.market_data.current_price.usd - data.market_data.ath.usd) / data.market_data.ath.usd) * 100;
        if (athDistance > -20) return "Near All-Time High";
        if (athDistance > -50) return "Moderate Recovery Potential";
        return "Significant Recovery Potential";
    };

    

    // Toggle the dropdown visibility
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="mr-16 my-2">
            <div
                onClick={toggleDropdown}
                className="bg-white shadow-2xl rounded-lg px-4 py-3 hover:scale-105 duration-100 cursor-pointer flex justify-between"
            >
                <div className="flex font-bold text-lg">
                    {cryptoData?.name || "Loading..."}
                </div>
                <div className="flex">
                    <span
                        className={`font-bold ${
                            (cryptoData?.market_data
                                .price_change_percentage_24h /
                                100) *
                                cryptoData?.market_data.current_price.usd >
                            500
                                ? "text-red-500"
                                : (cryptoData?.market_data
                                      .price_change_percentage_24h /
                                      100) *
                                      cryptoData?.market_data.current_price
                                          .usd >=
                                  50
                                ? "text-yellow-500"
                                : "text-green-500"
                        }`}
                    >
                        Risk Score:
                    </span>
                    <span>{"\u00A0\u00A0"}</span>
                    {(
                        (cryptoData?.market_data.price_change_percentage_24h /
                            100) *
                        cryptoData?.market_data.current_price.usd
                    ).toFixed(2)}
                </div>
            </div>

            {/* Dropdown content */}
            {isOpen && (
                <div className="bg-gray-200 mt-2 rounded-xl p-4 shadow-lg">
                    {error ? (
                        <div className="text-red-500">Error: {error}</div>
                    ) : cryptoData ? (
                        <div>
                            <p>Symbol: {cryptoData?.symbol?.toUpperCase()}</p>
                            <p>
                                Current Price (USD): $
                                {cryptoData?.market_data.current_price?.usd}
                            </p>
                            <p>
                                Market Cap: $
                                {cryptoData?.market_data.market_cap.usd}
                            </p>
                            <p>
                                {(
                                    ((cryptoData?.market_data.current_price
                                        .usd -
                                        cryptoData?.market_data.ath.usd) /
                                        cryptoData?.market_data.ath.usd) *
                                    100
                                ).toFixed(2)}
                                % away from All Time High
                            </p>
                            <p>
                                Liquidity Risk:{" "}
                                {(
                                    cryptoData?.market_data.market_cap.usd /
                                    cryptoData?.market_data.total_volume.usd
                                ).toFixed(2)}
                            </p>

                            {/* Add more data fields as needed */}
                        </div>
                    ) : (
                        <div>Loading data...</div>
                    )}
                </div>
            )}
        </div>
    );
}
