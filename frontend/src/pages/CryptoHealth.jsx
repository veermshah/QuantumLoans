import { PieChart } from "@mui/x-charts/PieChart";
import HealthRow from "../components/HealthRow";
import CryptoHealthScore from "../components/CryptoHealthScore";
import React, { useState, useRef } from "react";
import ChatComponent from "../components/ChatComponent";

function CryptoHealth() {
    const [isOpen, setIsOpen] = useState(false);
    const [analysisResult, setAnalysisResult] = useState("");

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const analysisRef = useRef(null);

    const handleClick = () => {
        analysisRef.current?.scrollIntoView({ behavior: "smooth" });

        // Retrieve data from localStorage
        const bitcoinData =
            localStorage.getItem("crypto_analysis_bitcoin") || "";
        const ethereumData =
            localStorage.getItem("crypto_analysis_ethereum") || "";
        const solanaData = localStorage.getItem("crypto_analysis_solana") || "";
        const arbitrumData =
            localStorage.getItem("crypto_analysis_arbitrum") || "";

        // Perform basic analysis (e.g., concatenation or simple statistics)
        const analysis = `
            Bitcoin: ${bitcoinData}
            Ethereum: ${ethereumData}
            Solana: ${solanaData}
            Arbitrum: ${arbitrumData}
        `;

        // Update analysisResult state
        setAnalysisResult(analysis);
    };

    const data = [
        { id: 0, value: 2.1 * 3192.72, label: "Ethereum" },
        { id: 1, value: 0.25 * 79472, label: "Bitcoin" },
        { id: 2, value: 100.5 * 204.34, label: "Solana" },
        { id: 3, value: 1500.75 * 0.636769, label: "Arbitrum" },
    ];

    // Calculate total value
    const totalValue = data.reduce((acc, item) => acc + item.value, 0);

    // Format each item label with dollar and percentage values
    const formattedData = data.map((item) => ({
        ...item,
        label: `${item.label}: $${item.value.toFixed(2)} (${(
            (item.value / totalValue) *
            100
        ).toFixed(1)}%)`,
    }));

    return (
        <div className="w-full min-h-screen bg-white ">
            {/* Added top padding here */}
            <div className="w-full px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Left side: Pie chart */}
                    <div className="w-1/2 pt-16">
                        <PieChart
                            colors={[
                                "#79ff98",
                                "#5ec269",
                                "#458f4d",
                                "#2c5c31",
                            ]}
                            series={[
                                {
                                    data: formattedData,
                                    highlightScope: {
                                        fade: "global",
                                        highlight: "item",
                                    },
                                    faded: {
                                        innerRadius: 30,
                                        additionalRadius: -30,
                                        color: "gray",
                                    },
                                },
                            ]}
                            margin={{
                                top: 100,
                                bottom: 100,
                                left: 100,
                                right: 100,
                            }}
                            slotProps={{
                                legend: {
                                    direction: "row",
                                    position: {
                                        vertical: "bottom",
                                        horizontal: "middle",
                                    },
                                    padding: 0,
                                },
                            }}
                            width={600}
                            height={600}
                        />
                    </div>

                    {/* Right side: Content */}
                    <div className="w-1/2 pl-4 mt-16">
                        {/* Add any additional content here */}
                        {/* Display Total Combined Value */}
                        <div className="text-4xl font-bold text-neutral-800 mb-12">
                            Total Wallet Value: ${totalValue.toFixed(2)}
                        </div>
                        <div
                            onClick={toggleDropdown}
                            className="bg-neutral-800 border cursor-pointer border-neutral-700 p-4 rounded-lg  hover:scale-105 duration-100 text-white mr-16 mb-6 shadow-2xl"
                        >
                            <CryptoHealthScore score={83} />

                            {/* Dropdown content */}
                            {isOpen && (
                                <div className="mt-4 p-4 bg-white-900 border border-neutral-700 rounded-lg flex flex-col gap-5">
                                    <p>How is this score being calculated?</p>
                                    <img src="form1.png" alt="" />
                                    <img src="form2.png" alt="" />
                                    <img src="form3.png" alt="" />
                                    <img src="form4.png" alt="" />
                                    <img src="form5.png" alt="" />
                                    <p>
                                        Health Score = average of all the scores
                                        for each crypto
                                    </p>
                                </div>
                            )}
                        </div>
                        <HealthRow id="ethereum" />
                        <HealthRow id="bitcoin" />
                        <HealthRow id="solana" />
                        <HealthRow id="arbitrum" />
                        <button
                            onClick={handleClick}
                            className="mr-16 my-2 bg-black rounded-full px-6 py-3 text-white text-xl font-bold hover:scale-105 duration-100 active:scale-90"
                        >
                            Analyze
                        </button>
                    </div>
                </div>
            </div>
            <div ref={analysisRef}>
                <br></br>
            </div>
            <div className="bg-neutral-800 rounded-lg shadow-2xl p-4 mx-16 my-16 text-white">
                <div className="font-bold text-2xl mb-3">Analysis</div>
                <ChatComponent initialAnalysis={analysisResult} />
            </div>
        </div>
    );
}

export default CryptoHealth;
