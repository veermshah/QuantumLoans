import React, { useEffect, useState } from "react";
import Spline from "@splinetool/react-spline";
import Checkbox from "@mui/material/Checkbox";
import { pink } from "@mui/material/colors";

function Borrow() {
    const [isChecked1, setIsChecked1] = useState(false);
    const [isChecked2, setIsChecked2] = useState(false);
    const [cryptoData, setCryptoData] = useState(null);
    const [cryptoData2, setCryptoData2] = useState(null);
    const [error, setError] = useState(null);

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
                <span className="ml-2 text-white">I verify that I agree to the terms listed above.</span>
            </label>
        </div>
    );

    useEffect(() => {
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                "x-cg-demo-api-key": "INSERT_API_KEY",
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
                console.log(data);
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
                console.log(data);
                setCryptoData2(data);
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
                setError(err.message);
            });
    }, []); // Empty dependency array means this runs once on component mount

    return (
        <div className="bg-white min-h-screen w-full flex justify-center">
            <div className="absolute top-20 opacity-90">
                <Spline scene="https://prod.spline.design/0X0VvCqBs6o5FdpF/scene.splinecode" />
            </div>
            <div className="absolute top-32 w-full max-w-5xl mx-4 md:mx-auto">
                <div className="bg-white rounded-3xl p-6 shadow-2xl flex  justify-between">
                    {/* Collateral Type Section */}
                    <div className="w-1/2">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold mb-2">
                                Collateral Type
                            </h2>
                            <div className="relative">
                                <select className="w-full p-4 bg-white border border-gray-200 rounded-xl appearance-none cursor-pointer focus:outline-none focus:border-gray-400">
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
                                BTC Price: $77,270.94
                            </p>
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Collateral Amount */}
                            <div>
                                <h2 className="text-lg font-medium mb-2">
                                    Collateral Amount
                                </h2>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter Amount"
                                        className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400"
                                    />
                                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        BTC
                                    </span>
                                </div>
                                <p className="mt-2 text-gray-500">
                                    Min. 0.17255 BTC
                                </p>
                            </div>

                            {/* Cash to Borrow */}
                            <div>
                                <h2 className="text-lg font-medium mb-2">
                                    Cash to Borrow
                                </h2>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter Amount"
                                        className="w-full p-4 pl-8 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400"
                                    />
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        $
                                    </span>
                                </div>
                                <p className="mt-2 text-gray-500">
                                    Min. $10,000
                                </p>
                            </div>
                        </div>

                        {/* Loan Details */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div>
                                <p className="text-gray-500 mb-2">
                                    Cash to Borrow:
                                </p>
                                <p className="font-medium">--</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-2">
                                    Interest Rate:
                                </p>
                                <p className="font-medium">--</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-2">
                                    Initial Loan To Value:
                                </p>
                                <p className="font-medium">--</p>
                            </div>
                        </div>

                        {/* Range Indicators */}
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>$10,000</span>
                            <span>$100,000,000</span>
                        </div>

                        {/* Info Text */}
                        <p className="mt-4 text-gray-600 text-sm">
                            Increasing your cash amount increases your LTV.
                            Interest rates shown are based on current cash and
                            collateral selection.
                        </p>
                    </div>
                    <div className="w-1/2">
                        <div className="bg-black rounded-2xl text-white ml-6 p-6">
                            <h1 className="font-bold text-xl mb-3">
                                Terms of your agreement
                            </h1>
                            <h1 className="">State of resident: Texas</h1>
                            <h1 className="">Term: </h1>
                            <h1 className="">Liquidity Draw Amount: </h1>
                            <h1 className="">LTV: </h1>
                            <h1 className="">Rate/APR: </h1>
                            <div className="h-0.5 bg-white my-5"></div>
                            <h1 className="">Total Amount: </h1>
                            <CustomWhiteCheckbox />
                            <div className="bg-white rounded-2xl cursor-pointer hover:scale-105 duration-100 text-black text-2xl font-bold px-4 py-4 text-center mt-16">BORROW</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Borrow;
