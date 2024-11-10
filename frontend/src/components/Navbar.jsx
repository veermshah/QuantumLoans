import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [active, setActive] = React.useState("");

    const handleClick = (page) => {
        setActive(page);
    };

    const navItems = [
        { name: "DASHBOARD", path: "/dashboard" },
        { name: "CRYPTOHEALTH", path: "/cryptohealth" },
        { name: "LEND", path: "/lend" },
        { name: "BORROW", path: "/borrow" },
    ];

    React.useEffect(() => {
        // Set the active state when the location changes
        if (location.pathname !== "/") {
            const activePage = navItems.find((item) => item.path === location.pathname);
            if (activePage) {
                setActive(activePage.name.toLowerCase());
            }
        } else {
            setActive(""); // No active tab when on the root page
        }
    }, [location, navItems]);

    return (
        <nav className="fixed top-0 left-0 w-full bg-black border-neutral-800">
            <div className="mx-auto flex items-center justify-between px-6 pt-4">
                {/* Logo */}
                <div className="flex items-center pb-4">
                    <div
                        onClick={() => navigate("/")}
                        className="w-8 h-8 hover:scale-110 cursor-pointer duration-100 rounded-full bg-green-500 flex items-center justify-center mr-4"
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
                                        ? "bg-gray-200 text-black hover:text-green-500"
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

                {/* Connect Wallet Button */}
                <div className="mb-3">
                    <button className="px-4 py-1 bg-green-600 hover:bg-white hover:text-black text-white text-md font-medium rounded-xl">
                        Connect Wallet
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
