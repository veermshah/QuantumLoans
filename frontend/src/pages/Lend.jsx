import React, { useState, useEffect } from "react";
import Spline from "@splinetool/react-spline";

function Lend() {
    const [isChecked2, setIsChecked2] = useState(false);
    const [cryptoData2, setCryptoData2] = useState(null);
    const [error, setError] = useState(null);

    // State variables for inputs and calculations
    const [liquidityType, setLiquidityType] = useState("USDC");
    const [lendAmount, setLendAmount] = useState("");
    const [interestRate, setInterestRate] = useState("--");

    // State for backend response and transaction details
    const [lendMessage, setLendMessage] = useState("");
    const [transactionDetails, setTransactionDetails] = useState(null);

    // State for loading status
    const [isLoading, setIsLoading] = useState(false);

    // State for input errors
    const [inputError, setInputError] = useState("");

    const CustomWhiteCheckbox = () => (
        <div className="flex items-center gap-2 bg-gray-800 p-4 rounded-lg mt-4">
            <label className="flex items-center cursor-pointer">
                <div className="relative">
                    <input
                        type="checkbox"
                        checked={isChecked2}
                        onChange={(e) => setIsChecked2(e.target.checked)}
                        className="sr-only"
                    />
                    <div
                        className={`w-6 h-6 border-2 rounded-md ${
                            isChecked2
                                ? "bg-white border-white"
                                : "border-white bg-transparent"
                        } transition-colors`}
                    >
                        {/* Checkmark */}
                        {isChecked2 && (
                            <svg
                                className="w-full h-full text-black p-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        )}
                    </div>
                </div>
                <span className="ml-2 text-white">
                    I verify that I agree to the terms listed above.
                </span>
            </label>
        </div>
    );

    useEffect(() => {
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
            },
        };

        if (liquidityType === "Ethereum") {
            fetch(`https://api.coingecko.com/api/v3/coins/ethereum`, options)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return res.json();
                })
                .then((data) => {
                    setCryptoData2(data);
                })
                .catch((err) => {
                    console.error("Error fetching data:", err);
                    setError(err.message);
                });
        }
    }, [liquidityType]);

    // Function to validate inputs
    const validateInput = () => {
        const amount = parseFloat(lendAmount);
        const minAmount = liquidityType === "USDC" ? 1000 : 0.1; // Minimum amounts

        if (!lendAmount || isNaN(amount) || amount < minAmount) {
            setInputError(
                `Minimum lend amount is ${
                    liquidityType === "USDC" ? `$${minAmount}` : `${minAmount} ETH`
                }`
            );
            return false;
        }

        setInputError("");
        return true;
    };

    // Function to calculate interest rate
    const calculateInterestRate = () => {
        if (!validateInput()) {
            setInterestRate("--");
            return;
        }

        const amount = parseFloat(lendAmount);

        // Define base rate and parameters
        const baseRate = 3; // Base rate 3%
        const rateIncrement = 0.1; // Rate increases by 0.1% for each $10,000 increment
        const amountStep = 10000; // Increment step of $10,000
        const maxRate = 5; // Maximum interest rate capped at 5%

        // Calculate the dynamic rate
        let rate = baseRate + Math.floor(amount / amountStep) * rateIncrement;

        // Ensure the rate does not exceed the maximum limit
        if (rate > maxRate) {
            rate = maxRate;
        }

        setInterestRate(rate.toFixed(2) + "%");
    };

    useEffect(() => {
        calculateInterestRate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lendAmount, liquidityType]);

    // Function to handle lend button click
    const handleLend = () => {
        if (!validateInput()) {
            return;
        }

        setIsLoading(true);
        setLendMessage("");
        setTransactionDetails(null);

        const token = liquidityType === "Ethereum" ? "ETH" : "USDC";

        fetch("http://127.0.0.1:5000/lend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: token,
                amount: parseFloat(lendAmount),
                time: 1, // Assuming 1 year term
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Lend response:", data);
                setLendMessage(data.message);

                if (data.tx_hash) {
                    // Use the actual transaction details returned from the backend
                    const transaction = {
                        txHash: data.tx_hash,
                        timestamp: new Date().toLocaleString(),
                        amountLent: data.principal,
                        interestRate: data.rate,
                        interestEarned: data.interest,
                        totalReturn: data.total,
                    };
                    setTransactionDetails(transaction);
                } else {
                    setLendMessage("Error: Transaction hash not found.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                setLendMessage("Error processing lend request");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // Disable lend button if inputs are invalid or checkbox is not checked
    const isLendDisabled =
        !isChecked2 || !lendAmount || interestRate === "--" || inputError;

    return (
        <div className="bg-gray-200 min-h-screen w-full flex justify-center">
            <div className="absolute top-16 opacity-90">
                <Spline scene="https://prod.spline.design/0X0VvCqBs6o5FdpF/scene.splinecode" />
            </div>
            <div className="absolute top-32 w-full max-w-5xl mx-4 md:mx-auto">
                <div className="bg-white rounded-3xl p-6 shadow-2xl flex justify-between">
                    {/* Liquidity Type Section */}
                    <div className="w-1/2">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold mb-2">
                                Liquidity Type
                            </h2>
                            <div className="relative">
                                <select
                                    className="w-full p-4 bg-white border border-gray-200 rounded-xl appearance-none cursor-pointer focus:outline-none focus:border-gray-400"
                                    value={liquidityType}
                                    onChange={(e) => setLiquidityType(e.target.value)}
                                >
                                    <option>USDC</option>
                                    <option>Ethereum</option>
                                </select>
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                    <svg
                                        className="w-4 h-4 text-gray-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <p className="mt-2 text-gray-600">
                                {liquidityType} Price: $
                                {liquidityType === "Ethereum" && cryptoData2
                                    ? cryptoData2.market_data.current_price.usd.toLocaleString()
                                    : liquidityType === "USDC"
                                    ? "1.00"
                                    : "--"}
                            </p>
                        </div>

                        {/* Lend Amount */}
                        <div className="mb-8">
                            <h2 className="text-lg font-medium mb-2">Lend Amount</h2>
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder="Enter Amount"
                                    className={`w-full p-4 bg-white border ${
                                        inputError ? "border-red-500" : "border-gray-200"
                                    } rounded-xl focus:outline-none focus:border-gray-400`}
                                    value={lendAmount}
                                    onChange={(e) => setLendAmount(e.target.value)}
                                />
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    {liquidityType === "USDC" ? "USDC" : "ETH"}
                                </span>
                            </div>
                            {inputError && (
                                <p className="text-red-500 text-sm mt-2">{inputError}</p>
                            )}
                            <p className="mt-2 text-gray-500">
                                Min.{" "}
                                {liquidityType === "USDC"
                                    ? "$1,000"
                                    : "0.1 ETH"}
                            </p>
                        </div>

                        {/* Loan Details */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div>
                                <p className="text-gray-500 mb-2">Interest Rate:</p>
                                <p className="font-medium text-green-600">
                                    {interestRate}
                                </p>
                            </div>
                        </div>

                        {/* Info Text */}
                        <p className="mt-4 text-gray-600 text-sm">
                            Interest rates shown are based on current lend amount and liquidity type.
                        </p>
                    </div>
                    <div className="w-1/2">
                        <div className="bg-black rounded-2xl text-white ml-6 p-6">
                            <h1 className="font-bold text-xl mb-3">
                                Terms of your agreement
                            </h1>
                            <h1>State of resident: Texas</h1>
                            <h1>Term: 1 Year</h1>
                            <h1>Liquidity Amount: {lendAmount || "--"}</h1>
                            <h1>Rate/APR: {interestRate}</h1>
                            <div className="h-0.5 bg-white my-5"></div>
                            <CustomWhiteCheckbox />
                            <button
                                className={`bg-white rounded-2xl text-black text-2xl font-bold px-4 py-4 text-center mt-16 w-full ${
                                    isLendDisabled
                                        ? "opacity-50 cursor-not-allowed"
                                        : "cursor-pointer hover:scale-105 duration-100"
                                }`}
                                onClick={handleLend}
                                disabled={isLendDisabled}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin h-5 w-5 mr-3 text-black"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8H4z"
                                            ></path>
                                        </svg>
                                        Processing...
                                    </div>
                                ) : (
                                    "LEND"
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lend Response and Transaction Details */}
                {lendMessage && (
                    <div className="mt-8 bg-white rounded-3xl p-6 shadow-xl text-center">
                        <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>
                        {transactionDetails ? (
                            <div className="text-left text-gray-800">
                                <p>
                                    <strong>Transaction Hash:</strong>{" "}
                                    <span className="text-blue-600 break-all">
                                        {transactionDetails.txHash}
                                    </span>
                                </p>
                                <p>
                                    <strong>Timestamp:</strong> {transactionDetails.timestamp}
                                </p>
                                <p>
                                    <strong>Amount Lent:</strong>{" "}
                                    {liquidityType === "USDC"
                                        ? `$${parseFloat(transactionDetails.amountLent).toLocaleString()}`
                                        : `${parseFloat(transactionDetails.amountLent).toLocaleString()} ETH`}
                                </p>
                                <p>
                                    <strong>Interest Rate:</strong>{" "}
                                    {transactionDetails.interestRate}
                                </p>
                                <p>
                                    <strong>Interest Earned:</strong>{" "}
                                    {liquidityType === "USDC"
                                        ? `$${parseFloat(transactionDetails.interestEarned).toLocaleString()}`
                                        : `${parseFloat(transactionDetails.interestEarned).toLocaleString()} ETH`}
                                </p>
                                <p>
                                    <strong>Total Return:</strong>{" "}
                                    {liquidityType === "USDC"
                                        ? `$${parseFloat(transactionDetails.totalReturn).toLocaleString()}`
                                        : `${parseFloat(transactionDetails.totalReturn).toLocaleString()} ETH`}
                                </p>
                            </div>
                        ) : (
                            <p className="text-red-600">{lendMessage}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Lend;
