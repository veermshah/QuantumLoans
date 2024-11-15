import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSDK } from "@metamask/sdk-react";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [active, setActive] = useState("");

    // const [active, setActive] = useState(''); // You can remove this commented line
    const [account, setAccount] = useState('');
    const { sdk, connected, connecting } = useSDK();

    useEffect(() => {
        const checkConnection = async () => {
            if (sdk && connected) {
                try {
                    const accounts = await sdk.connect();
                    setAccount(accounts[0]);
                } catch (err) {
                    console.error("Failed to get accounts", err);
                    setAccount("");
                }
            } else {
                setAccount("");
            }
        };

        checkConnection();
    }, [sdk, connected]);


    const connectWallet = async () => {
        try {
            const accounts = await sdk?.connect();
            setAccount(accounts?.[0]);
        } catch (err) {
            console.error("Failed to connect", err);
        }
    };

    const disconnectWallet = async () => {
        try {
            await sdk?.disconnect();
            setAccount("");
        } catch (err) {
            console.error("Failed to disconnect", err);
        }
    };


    // Remove the first handleClick declaration and keep only one
    const handleClick = (page) => {
        setActive(page);
    };

    const navItems = [
        { name: "DASHBOARD", path: "/dashboard" },
        { name: "CRYPTOHEALTH", path: "/cryptohealth" },
        { name: "LEND", path: "/lend" },
        { name: "BORROW", path: "/borrow" },
    ];

    useEffect(() => {
        // Set the active state when the location changes
        if (location.pathname !== "/") {
            const activePage = navItems.find(
                (item) => item.path === location.pathname
            );
            if (activePage) {
                setActive(activePage.name.toLowerCase());
            }
        } else {
            setActive(""); // No active tab when on the root page
        }
    }, [location, navItems]);

    return (
        <nav className="fixed top-0 left-0 z-50 w-full bg-black border-neutral-800">
            <div className="mx-auto flex items-center justify-between px-6 pt-4">
                {/* Logo */}
                <div className="flex items-center pb-4">
                    <div
                        onClick={() => navigate("/")}
                        className="mr-36 w-8 h-8 hover:scale-110 cursor-pointer duration-100 rounded-full bg-green-500 flex items-center justify-center"
                    >
                        <span className="text-black font-bold">QL</span>
                    </div>
                </div>

                {/* Navigation Items */}
                <div className=" flex justify-center">
                    <div className="flex space-x-5 mt-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-t-2xl ${
                                    active === item.name.toLowerCase()
                                        ? "bg-white text-black hover:text-green-500"
                                        : "text-neutral-400 hover:text-white"
                                }`}
                                onClick={() =>
                                    handleClick(item.name.toLowerCase())
                                }
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Connect/Disconnect Wallet Button */}
                {!account ? (
                    <button
                        onClick={connectWallet}
                        disabled={connecting}
                        className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded flex items-center gap-2"
                    >
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                        {connecting ? "Connecting..." : "Connect Wallet"}
                    </button>
                ) : (
                    <button
                        onClick={disconnectWallet}
                        className="px-4 py-1.5 bg-white hover:bg-black hover:border-white hover:border-2 hover:text-white text-black text-sm font-medium rounded flex items-center gap-2"
                    >
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        {`${account.slice(0, 6)}...${account.slice(-4)}`}
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;