import { PieChart } from "@mui/x-charts/PieChart";
import HealthRow from "../components/HealthRow";

function CryptoHealth() {
    return (
        <div className="w-full min-h-screen bg-white ">
            {/* Added top padding here */}
            <div className="w-full px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Left side: Pie chart */}
                    <div className="w-1/2 pt-36">
                        <PieChart
                            colors={[
                                "#79ff98",
                                "#5ec269",
                                "#458f4d",
                                "#2c5c31",
                            ]}
                            series={[
                                {
                                    data: [
                                        {
                                            id: 0,
                                            value: 0.5,
                                            label: "Ethereum",
                                        },
                                        {
                                            id: 1,
                                            value: 0.25,
                                            label: "Bitcoin",
                                        },
                                        { id: 2, value: 1, label: "Solana" },
                                        { id: 3, value: 2, label: "Arbitrum" },
                                    ],
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
                            width={600}
                            height={400}
                        />
                    </div>

                    {/* Right side: Content */}
                    <div className="w-1/2 pl-4">
                        {/* Add any additional content here */}
                        <HealthRow id="ethereum" />
                        <HealthRow id="bitcoin" />
                        <HealthRow id="solana" />
                        <HealthRow id="arbitrum" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CryptoHealth;
