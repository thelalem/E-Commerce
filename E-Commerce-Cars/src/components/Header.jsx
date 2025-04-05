import { Link } from "react-router-dom";
import CartIcon from "./CartIcon";
import FavoritesIcon from "./FavoritesIcon";
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Header = () => {
    const { currentUser, isSeller, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                    <Link to="/" className="flex items-center">
                        <svg
                            className="h-8 w-8 text-blue-600 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                            />
                        </svg>
                        <span className="hidden sm:inline">AutoElite</span>
                    </Link>
                </h1>

                {/* Mobile menu button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="sm:hidden text-gray-500 hover:text-blue-600 focus:outline-none"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden sm:block">
                    <ul className="flex space-x-4 md:space-x-8">
                        <li>
                            <Link 
                                to="/" 
                                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/about" 
                                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/contact" 
                                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                            >
                                Contact Us
                            </Link>
                        </li>
                        <li><CartIcon/></li>
                        <li><FavoritesIcon/></li>

                        {isSeller && (
                            <li>
                                <Link
                                    to="/seller/dashboard"
                                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                                >
                                    Seller Dashboard
                                </Link>
                            </li>
                        )}
                        {currentUser ? (
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                                >
                                    Logout
                                </button>
                            </li>
                        ) : (
                            <li>
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                                >
                                    Login
                                </Link>
                            </li>
                        )}	
                    </ul>
                </nav>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="sm:hidden bg-white pb-4 px-4">
                    <ul className="flex flex-col space-y-3">
                        <li>
                            <Link 
                                to="/" 
                                className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/about" 
                                className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/contact" 
                                className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Contact Us
                            </Link>
                        </li>
                        <li className="flex items-center py-2">
                            <CartIcon/>
                        </li>
                        <li className="flex items-center py-2">
                            <FavoritesIcon/>
                        </li>

                        {isSeller && (
                            <li>
                                <Link
                                    to="/seller/dashboard"
                                    className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Seller Dashboard
                                </Link>
                            </li>
                        )}
                        {currentUser ? (
                            <li>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium py-2"
                                >
                                    Logout
                                </button>
                            </li>
                        ) : (
                            <li>
                                <Link
                                    to="/login"
                                    className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            </li>
                        )}	
                    </ul>
                </div>
            )}
        </header>
    );
};

export default Header;