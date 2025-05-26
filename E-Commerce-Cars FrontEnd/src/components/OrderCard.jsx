import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../utils/axios";

// OrderCard.jsx
const OrderCard = ({ order }) => {
    const formatPrice = (price) => {
      return new Intl.NumberFormat("en-ET", {
        style: "currency",
        currency: "ETB",
      }).format(price);
    };
  
    // Safely get products array
    const products = Array.isArray(order.products) ? order.products : [];
  
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="p-6">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Order #{order.id}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-medium text-gray-900">
                {formatPrice(order.totalPrice)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                order.status === "delivered" ? "bg-green-100 text-green-800" :
                order.status === "pending" ? "bg-blue-100 text-blue-800" :
                "bg-red-100 text-red-800"
              }`}>
                {order.status?.charAt(0)?.toUpperCase() + order.status?.slice(1)}
              </span>
            </div>
          </div>
  
          {/* Products Grid */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              Products ({products.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((item, index) => {
                const product = typeof item.product === 'object' ? item.product : item;
                const uniqueKey = `${order.id}-${product.id || product._id || index}`;
                
                return (
                  <div key={uniqueKey} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <img
                        src={
                          product.imageUrl
                            ? product.imageUrl.startsWith("http")
                              ? product.imageUrl
                              : `${import.meta.env.VITE_API_URL}${product.imageUrl}`
                            : "/default-image.jpg"
                        }
                        alt={product.name || "Product"}
                        className="w-16 h-16 object-cover rounded-md border border-gray-200"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div className="flex-grow">
                      <h5 className="font-medium text-gray-800">
                        {product.name || "Unknown Product"}
                      </h5>
                      <div className="flex justify-between mt-1 text-sm text-gray-600">
                        <span>Qty: {item.quantity || 1}</span>
                        <span>{formatPrice(product.price || 0)} each</span>
                      </div>
                      <div className="mt-2 text-sm font-medium text-blue-600">
                        {formatPrice((product.price || 0) * (item.quantity || 1))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
  
          {/* View Details Button */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link
              to={`/orders/${order.id}`}
              state={{ products }}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
            >
              View Order Details
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  };

export default OrderCard;