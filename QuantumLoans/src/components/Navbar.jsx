import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    const [active, setActive] = React.useState('');
    const handleClick = (page) => {
        setActive(page);
    }
    return (
        <div className="fixed top-0 left-0 w-full">
            <div className="mx-auto flex flex-row items-center justify-between px-20 py-4 bg-pastelblue rounded-t">
                <p className="poppins-bold text-3xl text-white">
                    Quantum Loans
                </p>
                
                <div className="flex flex-row gap-8 py-2 text-2xl">
                    <div className="poppins-semibold transition duration-300 ease-in-out hover:bg-white hover:rounded">
                        <Link to="/dashboard" className={active === 'dashboard' ? 'bg-white rounded' : 'text-white hover:text-black'} onClick={() => handleClick('dashboard')}>
                            Dashboard
                        </Link>
                    </div>
                    <div className="poppins-semibold transition duration-300 ease-in-out hover:bg-white hover:rounded">
                        <Link to="/borrow" className={active === 'borrow' ? 'bg-white rounded' : 'text-white hover:text-black'} onClick={() => handleClick('borrow')}>
                            Borrow
                        </Link>
                    </div>
                    <div className="poppins-semibold transition duration-300 ease-in-out hover:bg-white hover:rounded">
                        <Link to="/lend" className={active === 'lend' ? 'bg-white rounded' : 'text-white hover:text-black'} onClick={() => handleClick('lend')}>
                            Lend
                        </Link>
                    </div>
                    <div className="poppins-semibold transition duration-300 ease-in-out hover:bg-white hover:rounded hover:text-black">
                        <Link to="/cryptohealth" className={active === 'cryptohealth' ? 'bg-white rounded' : 'text-white hover:text-black'} onClick={() => handleClick('cryptohealth')}>
                            CryptoHealth
                        </Link>
                    </div>
                </div>
            </div>
            <hr className="w-full flex-row border-t-2 border-white border-opacity-50"></hr>
        </div>
    );
}


export default Navbar;
