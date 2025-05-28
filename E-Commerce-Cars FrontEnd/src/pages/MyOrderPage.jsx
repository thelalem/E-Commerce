import React, { useEffect, useState } from "react";
import axiosClient from "../utils/axios";
import OrderCard from "../components/OrderCard";
import { useNavigate } from "react-router-dom";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
    }).format(price);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await axiosClient.get("/orders/buyer");
        const ordersData = res.data || [];
        
        // Enhanced error handling for missing data
        if (!Array.isArray(ordersData)) {
          throw new Error("Invalid orders data format");
        }

        // Get all unique product IDs
        const productIds = [];
        ordersData.forEach(order => {
          if (Array.isArray(order.products)) {
            order.products.forEach(item => {
              if (item.product) {
                const id = typeof item.product === 'string' ? item.product : item.product._id;
                if (id) productIds.push(id);
              }
            });
          }
        });

        // Fetch product details in batch
        let productDetails = [];
        if (productIds.length > 0) {
          const productDetailsRes = await axiosClient.post("/products/batch", {
            productIds: [...new Set(productIds)] // Remove duplicates
          });
          productDetails = productDetailsRes.data || [];
        }

        // Merge products with their details
        const ordersWithProductDetails = ordersData.map(order => {
          const productsWithDetails = (order.products || []).map(item => {
            const productId = typeof item.product === 'string' ? item.product : item.product?._id;
            const productDetail = productDetails.find(p => p._id === productId);
            
            return {
              ...item,
              product: productDetail || item.product || { name: "Unknown Product", price: 0 }
            };
          });

          return {
            ...order,
            products: productsWithDetails,
            totalPrice: order.totalPrice || productsWithDetails.reduce((sum, item) => 
              sum + (item.product?.price || 0) * (item.quantity || 1), 0)
          };
        });

        setOrders(ordersWithProductDetails);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message || "Failed to load orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-blue-500 rounded-full mb-2"></div>
          <p className="text-blue-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-lg shadow-sm p-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-blue-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-700 mb-1">
          No orders yet
        </h3>
        <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Go Back
          </button>
        <p className="text-gray-500">Your order history will appear here</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          Back to listings
        </button>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid divide-y divide-gray-100">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={{
                ...order,
                totalPriceFormatted: formatPrice(order.totalPrice), 
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;