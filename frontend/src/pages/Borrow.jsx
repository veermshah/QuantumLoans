import React, { useEffect, useState } from "react";
import Spline from "@splinetool/react-spline";

function Borrow() {
    const [isChecked2, setIsChecked2] = useState(false);
    const [cryptoData, setCryptoData] = useState(null);
    const [cryptoData2, setCryptoData2] = useState(null);
    const [error, setError] = useState(null);

    // State variables for inputs
    const [collateralType, setCollateralType] = useState("Bitcoin");
    const [collateralAmount, setCollateralAmount] = useState("");
    const [cashToBorrow, setCashToBorrow] = useState("");

    // State variables for calculated values
    const [interestRate, setInterestRate] = useState("--");
    const [initialLoanToValue, setInitialLoanToValue] = useState("--");

    // State for backend response and transaction details
    const [borrowMessage, setBorrowMessage] = useState("");
    const [transactionDetails, setTransactionDetails] = useState(null);

    // State for loading status
    const [isLoading, setIsLoading] = useState(false);

    // State for input errors
    const [inputErrors, setInputErrors] = useState({
        collateralAmount: "",
        cashToBorrow: "",
    });

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

    // Function to validate inputs
    const validateInputs = () => {
        const errors = {
            collateralAmount: "",
            cashToBorrow: "",
        };

        const collateralAmt = parseFloat(collateralAmount);
        const cashBorrow = parseFloat(cashToBorrow);

        // Minimum values
        const minCollateral = 0.1;
        const minCashBorrow = 1000;

        if (!collateralAmount || isNaN(collateralAmt) || collateralAmt < minCollateral) {
            errors.collateralAmount = `Minimum collateral amount is ${minCollateral} ${collateralType}`;
        }

        if (!cashToBorrow || isNaN(cashBorrow) || cashBorrow < minCashBorrow) {
            errors.cashToBorrow = `Minimum cash to borrow is $${minCashBorrow}`;
        }

        setInputErrors(errors);

        // Return true if there are no errors
        return !errors.collateralAmount && !errors.cashToBorrow;
    };

    // Function to calculate loan details
    const calculateLoanDetails = () => {
        if (!validateInputs()) {
            setInterestRate("--");
            setInitialLoanToValue("--");
            return;
        }

        const collateralAmt = parseFloat(collateralAmount);
        const cashBorrow = parseFloat(cashToBorrow);

        let collateralPrice = 0;
        if (collateralType === "Bitcoin" && cryptoData) {
            collateralPrice = cryptoData.market_data.current_price.usd;
        } else if (collateralType === "Ethereum" && cryptoData2) {
            collateralPrice = cryptoData2.market_data.current_price.usd;
        } else {
            setInterestRate("--");
            setInitialLoanToValue("--");
            return;
        }

        const totalCollateralValue = collateralAmt * collateralPrice;
        const initialLTV = (cashBorrow / totalCollateralValue) * 100;

        // Simple interest rate calculation based on LTV
        let rate = 5 + (initialLTV - 50) * 0.1; // Base rate 5%, adjusts with LTV
        rate = Math.max(5, Math.min(rate, 15)); // Clamp between 5% and 15%

        setInitialLoanToValue(initialLTV.toFixed(2) + "%");
        setInterestRate(rate.toFixed(2) + "%");
    };

    useEffect(() => {
        calculateLoanDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collateralAmount, cashToBorrow, collateralType, cryptoData, cryptoData2]);

    useEffect(() => {
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
            },
        };

        fetch(`https://api.coingecko.com/api/v3/coins/bitcoin`, options)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((data) => {
                setCryptoData(data);
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
                setError(err.message);
            });

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
    }, []);

    // Function to handle borrow button click
    const handleBorrow = () => {
        if (!validateInputs()) {
            return;
        }

        setIsLoading(true);
        setBorrowMessage("");
        setTransactionDetails(null);

        // Map collateralType to collateral_token symbol
        const collateralToken = collateralType === "Bitcoin" ? "BTC" : "ETH";

        // Define the token to borrow (e.g., "ARB")
        const tokenToBorrow = "ARB"; // Change this if borrowing different tokens

        fetch("http://127.0.0.1:5000/borrow", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: tokenToBorrow, // Token to borrow
                amount: parseFloat(cashToBorrow),
                collateral_token: collateralToken, // Collateral token symbol
                collateral_amount: parseFloat(collateralAmount),
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Borrow response:", data);
                setBorrowMessage(data.message);

                if (data.tx_hash) {
                    // Use the actual transaction details returned from the backend
                    const transaction = {
                        txHash: data.tx_hash,
                        timestamp: new Date().toLocaleString(),
                        amountBorrowed: data.amount,
                        collateralLocked: `${data.collateral_amount} ${data.collateral_token}`,
                        feeRate: data.fee_rate,
                        fee: data.fee,
                        totalDue: data.total_due,
                    };
                    setTransactionDetails(transaction);
                } else {
                    setBorrowMessage("Error: Transaction hash not found.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                setBorrowMessage("Error processing borrow request");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // Disable borrow button if inputs are invalid or checkbox is not checked
    const isBorrowDisabled =
        !isChecked2 ||
        !collateralAmount ||
        !cashToBorrow ||
        interestRate === "--" ||
        initialLoanToValue === "--" ||
        inputErrors.collateralAmount ||
        inputErrors.cashToBorrow;

    return (
        <div className="bg-white min-h-screen w-full flex justify-center">
            <div className="absolute top-20 opacity-90">
                <Spline scene="https://prod.spline.design/0X0VvCqBs6o5FdpF/scene.splinecode" />
            </div>
            <div className="absolute top-32 w-full max-w-5xl mx-4 md:mx-auto">
                <div className="bg-white rounded-3xl p-6 shadow-2xl flex justify-between">
                    {/* Collateral Type Section */}
                    <div className="w-1/2">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold mb-2">Collateral Type</h2>
                            <div className="relative">
                                <select
                                    className="w-full p-4 bg-white border border-gray-200 rounded-xl appearance-none cursor-pointer focus:outline-none focus:border-gray-400"
                                    value={collateralType}
                                    onChange={(e) => setCollateralType(e.target.value)}
                                >
                                    <option>Bitcoin</option>
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
                                {collateralType} Price: $
                                {collateralType === "Bitcoin" && cryptoData
                                    ? cryptoData.market_data.current_price.usd.toLocaleString()
                                    : collateralType === "Ethereum" && cryptoData2
                                    ? cryptoData2.market_data.current_price.usd.toLocaleString()
                                    : "--"}
                            </p>
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Collateral Amount */}
                            <div>
                                <h2 className="text-lg font-medium mb-2">Collateral Amount</h2>
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="Enter Amount"
                                        className={`w-full p-4 bg-white border ${
                                            inputErrors.collateralAmount ? "border-red-500" : "border-gray-200"
                                        } rounded-xl focus:outline-none focus:border-gray-400`}
                                        value={collateralAmount}
                                        onChange={(e) => setCollateralAmount(e.target.value)}
                                    />
                                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        {collateralType === "Bitcoin" ? "BTC" : "ETH"}
                                    </span>
                                </div>
                                <p className="mt-2 text-gray-500">Min. 0.1 {collateralType}</p>
                                {inputErrors.collateralAmount && (
                                    <p className="text-red-500 text-sm">{inputErrors.collateralAmount}</p>
                                )}
                            </div>

                            {/* Cash to Borrow */}
                            <div>
                                <h2 className="text-lg font-medium mb-2">Cash to Borrow</h2>
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="Enter Amount"
                                        className={`w-full p-4 pl-8 bg-gray-50 border ${
                                            inputErrors.cashToBorrow ? "border-red-500" : "border-gray-200"
                                        } rounded-xl focus:outline-none focus:border-gray-400`}
                                        value={cashToBorrow}
                                        onChange={(e) => setCashToBorrow(e.target.value)}
                                    />
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        $
                                    </span>
                                </div>
                                <p className="mt-2 text-gray-500">Min. $1,000</p>
                                {inputErrors.cashToBorrow && (
                                    <p className="text-red-500 text-sm">{inputErrors.cashToBorrow}</p>
                                )}
                            </div>
                        </div>

                        {/* Loan Details */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div>
                                <p className="text-gray-500 mb-2">Cash to Borrow:</p>
                                <p className="font-medium text-green-600">
                                    {cashToBorrow ? `$${parseFloat(cashToBorrow).toLocaleString()}` : "--"}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-2">Interest Rate:</p>
                                <p className="font-medium text-green-600">{interestRate}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-2">Initial Loan To Value:</p>
                                <p className="font-medium text-green-600">{initialLoanToValue}</p>
                            </div>
                        </div>

                        {/* Range Indicators */}
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>$1,000</span>
                            <span>$100,000,000</span>
                        </div>

                        {/* Info Text */}
                        <p className="mt-4 text-gray-600 text-sm">
                            Increasing your cash amount increases your LTV. Interest rates shown are based on
                            current cash and collateral selection.
                        </p>
                    </div>
                    <div className="w-1/2">
                        <div className="bg-black rounded-2xl text-white ml-6 p-6">
                            <h1 className="font-bold text-xl mb-3">Terms of your agreement</h1>
                            <h1>State of resident: Texas</h1>
                            <h1>Term: 1 Year</h1>
                            <h1>Liquidity Draw Amount: {cashToBorrow || "--"}</h1>
                            <h1>LTV: {initialLoanToValue}</h1>
                            <h1>Rate/APR: {interestRate}</h1>
                            <div className="h-0.5 bg-white my-5"></div>
                            <h1>Total Amount Due: {cashToBorrow ? `$${cashToBorrow}` : "--"}</h1>
                            <CustomWhiteCheckbox />
                            <button
                                className={`bg-white rounded-2xl text-black text-2xl font-bold px-4 py-4 text-center mt-16 w-full ${
                                    isBorrowDisabled
                                        ? "opacity-50 cursor-not-allowed"
                                        : "cursor-pointer hover:scale-105 duration-100"
                                }`}
                                onClick={handleBorrow}
                                disabled={isBorrowDisabled}
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
                                    "BORROW"
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Borrow Response and Transaction Details */}
                {borrowMessage && (
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
                                    <strong>Amount Borrowed:</strong> $
                                    {parseFloat(transactionDetails.amountBorrowed).toLocaleString()}
                                </p>
                                <p>
                                    <strong>Collateral Locked:</strong>{" "}
                                    {transactionDetails.collateralLocked}
                                </p>
                                <p>
                                    <strong>Fee Rate:</strong> {transactionDetails.feeRate}
                                </p>
                                <p>
                                    <strong>Fee:</strong> $
                                    {parseFloat(transactionDetails.fee).toLocaleString()}
                                </p>
                                <p>
                                    <strong>Total Due:</strong> $
                                    {parseFloat(transactionDetails.totalDue).toLocaleString()}
                                </p>
                            </div>
                        ) : (
                            <p className="text-red-600">{borrowMessage}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Borrow;
