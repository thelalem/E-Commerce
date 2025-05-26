import { Link } from "react-router-dom";
import CartIcon from "./CartIcon";
import FavoritesIcon from "./FavoritesIcon";
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Header = () => {
    const { currentUser, isSeller, isBuyer, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo/Brand */}
                <Link to="/" className="flex items-center space-x-2 group">
                    <svg
                        className="h-8 w-8 text-blue-600 group-hover:text-blue-500 transition-colors"
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
                    <span className="text-xl font-bold text-blue-800 group-hover:text-blue-600 hidden sm:inline transition-colors">AutoElite</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-1">
                    <Link 
                        to="/" 
                        className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                        Home
                    </Link>
                    <Link 
                        to="/about" 
                        className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                        About
                    </Link>
                    <Link 
                        to="/contact" 
                        className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                        Contact
                    </Link>

                    {/* Buyer-specific links */}
                    {currentUser && isBuyer && (
                        <>
                            <Link
                                to="/orders"
                                className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 text-sm font-medium"
                            >
                                My Orders
                            </Link>
                            <div className="px-2">
                                <CartIcon className="text-gray-600 hover:text-blue-600" />
                            </div>
                        </>
                    )}

                    {/* Seller-specific link */}
                    {isSeller && (
                        <Link
                            to="/seller/dashboard"
                            className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 text-sm font-medium"
                        >
                            Dashboard
                        </Link>
                    )}

                    {/* Favorites (visible to all logged-in users) */}
                    {currentUser && (
                        <div className="px-2">
                            <FavoritesIcon className="text-gray-600 hover:text-blue-600" />
                        </div>
                    )}

                    {/* Profile Icon */}
                    {currentUser && (
                        <Link
                            to="/profile"
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                            aria-label="Profile"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-6 w-6" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                                />
                            </svg>
                        </Link>
                    )}

                    {/* Auth buttons */}
                    <div className="ml-2 pl-2 border-l border-gray-200">
                        {currentUser ? (
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            >
                                Logout
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </nav>

                {/* Mobile menu button */}
                <div className="md:hidden flex items-center space-x-4">
                    {!isSeller && currentUser && <CartIcon className="text-gray-600 hover:text-blue-600" />}
                    {currentUser && <FavoritesIcon className="text-gray-600 hover:text-blue-600" />}
                    {currentUser && (
                        <Link to="/profile" className="text-gray-600 hover:text-blue-600 p-1">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-6 w-6" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                                />
                            </svg>
                        </Link>
                    )}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-gray-600 hover:text-blue-600 focus:outline-none p-1 transition-colors"
                    >
                        {isMenuOpen ? (
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        <Link 
                            to="/" 
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link 
                            to="/about" 
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About
                        </Link>
                        <Link 
                            to="/contact" 
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Contact
                        </Link>

                        {currentUser && isBuyer && (
                            <Link
                                to="/orders"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                My Orders
                            </Link>
                        )}

                        {isSeller && (
                            <Link
                                to="/seller/dashboard"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Seller Dashboard
                            </Link>
                        )}

                        <div className="pt-2 border-t border-gray-200">
                            {currentUser ? (
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;