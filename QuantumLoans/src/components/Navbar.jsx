import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    const [active, setActive] = React.useState('');
    
    const handleClick = (page) => {
        setActive(page);
    }

    const navItems = [
        { name: 'DASHBOARD', path: '/dashboard' },
        { name: 'CRYPTOHEALTH', path: '/cryptohealth' },
        { name: 'LEND', path: '/lend' },
        { name: 'BORROW', path: '/borrow' },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full bg-black border-b border-neutral-800">
            <div className="mx-auto flex items-center justify-between px-6 py-3">
                {/* Logo */}
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-4">
                        <span className="text-black font-bold">A</span>
                    </div>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 flex justify-center">
                    <div className="flex space-x-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                                    active === item.name.toLowerCase()
                                        ? 'bg-neutral-800 text-white hover:text-green-500'
                                        : 'text-neutral-400 hover:text-white'
                                }`}
                                onClick={() => handleClick(item.name.toLowerCase())}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Connect Wallet Button */}
                <button className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-black text-sm font-medium rounded flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    Connect Wallet
                </button>
            </div>
        </nav>
    );
}

export default Navbar;