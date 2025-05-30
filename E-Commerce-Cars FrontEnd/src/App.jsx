import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import ProductDetails from "./components/ProductDetails";
import { useEffect } from "react";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {  FiLoader } from "react-icons/fi";
import { FavoritesProvider } from "./context/FavoritesContext";
import FavoritesPage from "./pages/FavoritesPage";
import { AuthProvider } from './context/AuthContext';
import SellerLayout from './components/SellerLayout';
import SellerDashboard from './pages/seller/SellerDashboard';
import AddProduct from './pages/seller/AddProduct';
import EditProduct from './pages/seller/EditProduct';
import SellerOrdersPage from './pages/seller/SellerOrdersPage';
import Messages from "./pages/seller/Messages";
import Login from "./components/Login";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import ProductListingPage from "./pages/ProductListing";
import Register from "./components/Register";
import MyOrdersPage from "./pages/MyOrderPage";
import OrderDetailsPage from "./pages/OrderDetails";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <Router>
            <ToastContainer />
            <AuthWrapper />
          </Router>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
};

function AuthWrapper() {
  const { currentUser, isSeller, isBuyer, loading } = useAuth();

  if (loading) {
    return(
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8 bg-white rounded-xl shadow-sm max-w-md w-full">
              <FiLoader className="animate-spin text-blue-500 text-4xl mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
              
            </div>
          </div>
    );
    }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductListingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route
        path="/favorites"
        element={<FavoritesPage /> }
      />
      {/* Buyer Routes */}
      <Route
        path="/cart"
        element={isBuyer ? <CartPage /> : <Navigate to="/login" replace />}
      />
      
      <Route
        path="/orders"
        element={isBuyer ? <MyOrdersPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/orders/:orderId"
        element={isBuyer ? <OrderDetailsPage /> : <Navigate to="/login" replace />}
      />
       {/* Profile Route */}
       <Route
        path="/profile"
        element={currentUser ? <ProfilePage /> : <Navigate to="/login" replace />}
      />
      {/* Seller Routes */}
      <Route
        path="/seller"
        element={isSeller ? <Navigate to="/seller/dashboard" replace /> : <Navigate to="/login" />}
      />
      <Route element={isSeller ? <SellerLayout /> : <Navigate to="/login" />}>
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/messages" element={<Messages />} />
        <Route path="/seller/add-product" element={<AddProduct />} />
        <Route path="/seller/edit-product/:id" element={<EditProduct />} />
        <Route path="/seller/orders" element={<SellerOrdersPage />} />
      </Route>
    </Routes>
  );
}

export default App;
