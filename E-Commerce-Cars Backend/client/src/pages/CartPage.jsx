import { useState } from "react";
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axios';
import { toast } from 'react-toastify';

const CartPage = () => {
  const { currentUser } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState("");

  console.log("cart items", cartItems)

  const handleCheckout = async () => {
    if (!shippingAddress) {
      toast.error("Please provide a shipping address.");
      return;
    }
    const outOfStockItems = cartItems.filter(
      (item) => item.quantity > item.product.stock 
    );
    
  
    if (outOfStockItems.length > 0) {
      outOfStockItems.forEach(item => {
        toast.error(
          `Only ${item.product.stock} left in stock for "${item.product.name}", but you selected ${item.quantity}.`
        );
      });
      return;
    }
    try {
      const orderData = {
        products: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress,
      };

      const res = await axiosClient.post('/orders', orderData);
      console.log("Order response:", res.data);
      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/orders/${res.data.order.id}`);
    } catch (error) {
      console.error("Error during checkout:", error);
      const message = error?.response?.data?.message || 'Failed to place order';
      toast.error(message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back 
        </button>
      <h1 className="text-3xl font-bold text-blue-800 mb-8">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-blue-50 rounded-lg">
          <p className="text-lg text-blue-700 mb-4">Your cart is empty</p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Browse Cars
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.product._id} className="flex flex-col sm:flex-row gap-4 p-4 border border-blue-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="relative w-full sm:w-40 h-40 flex-shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={item.product.imageUrl
                      ? (item.product.imageUrl.startsWith('http')
                        ? item.product.imageUrl
                        : `${import.meta.env.VITE_API_URL}${item.product.imageUrl}`)
                      : '/default-image.jpg'
                    }
                    alt={item.product.name}
                    className="absolute h-full w-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-blue-900">{item.product.name}</h3>
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  <p className="text-blue-600 font-medium mt-1">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "ETB",
                      maximumFractionDigits: 0,
                    }).format(item.product.price)}
                  </p>
                  
                  <div className="mt-4 flex items-center">
                    <div className="flex items-center border border-blue-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-1 bg-white text-center w-12">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    
                    <p className="ml-auto text-lg font-semibold text-blue-800">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "ETB",
                        maximumFractionDigits: 0,
                      }).format(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-blue-100 rounded-lg shadow-sm p-6 h-fit sticky top-4">
            <h2 className="text-xl font-bold text-blue-800 mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-blue-50">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-blue-800">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "ETB",
                    maximumFractionDigits: 0,
                  }).format(cartTotal)}
                </span>
              </div>
              
              <div className="pt-2">
                <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Address
                </label>
                <textarea
                  id="shippingAddress"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your shipping address"
                  rows="3"
                />
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium mt-4 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;