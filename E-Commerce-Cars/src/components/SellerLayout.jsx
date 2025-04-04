import { Link, Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const SellerLayout = () => {
  const { currentUser , logout } = useAuth(); // Get the current user and logout function from the AuthContext
  const navigate = useNavigate(); // Hook to programmatically navigate between routes

  useEffect(() => {
    // Redirect to login page if the user is not logged in or not a seller
    if(!currentUser || currentUser.role !== 'seller') {
        navigate('/login');
    };
  }, [currentUser, navigate]); // Dependency array ensures this runs when currentUser or navigate changes

  const handleLogout = () => {
    // Logout the user and redirect to the login page
    logout();
    navigate('/login');
  };

  // If the user is not logged in or not a seller, render nothing
  if (!currentUser || currentUser.role !== 'seller') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo or main link */}
              <div className="flex-shrink-0 flex items-center">
                <Link to="/seller/dashboard" className="text-xl font-bold text-gray-900">
                  Seller Dashboard
                </Link>
              </div>
              {/* Navigation links */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <NavLink
                  to="/seller/dashboard"
                  className={({ isActive }) => 
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive 
                        ? 'border-blue-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/seller/add-product"
                  className={({ isActive }) => 
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive 
                        ? 'border-blue-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`
                  }
                >
                  Add Product
                </NavLink>
                <NavLink
                  to="/seller/messages"
                  className={({ isActive }) => 
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive 
                        ? 'border-blue-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`
                  }>Messages
                  </NavLink>
              </div>
            </div>
            {/* User info and logout button */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <span className="mr-4 text-sm font-medium text-gray-700">
                Welcome, {currentUser?.name}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content area */}
      <div className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <Outlet /> {/* Render child routes here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerLayout;