import { Link } from "react-router-dom";
import CartIcon from "./CartIcon";
import FavoritesIcon from "./FavoritesIcon";
import {useAuth} from '../context/AuthContext';

const Header = () => {
    const {currentUser,isSeller,logout} = useAuth();

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
                        <span>Car Marketplace</span>
                    </Link>
                </h1>
                <nav>
                    <ul className="flex space-x-8">
                        <li>
                            <Link 
                                to="/home" 
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
                            <Link
                                to="/seller/dashboard"
                                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">

                                Seller Dashboard
                                </Link>
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
        </header>
    );
};

export default Header;