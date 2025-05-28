import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axiosClient from "../utils/axios";
import { FiShoppingBag, FiCalendar, FiTruck, FiDollarSign, FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const passedProducts = location.state?.products || [];
  const [order, setOrder] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  // Formatter for Ethiopian Birr (ETB)
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
    }).format(price);
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/orders/${orderId}`);
        setOrder(res.data);

        const orderProductIds = res.data.products.map((item) =>
          typeof item.product === "string" ? item.product : item.product._id
        );
        // Only fetch if not passed
        if (passedProducts.length === 0) {
          console.log("Fetching product details for order products...");
          const detailed = await Promise.all(
            orderProductIds.map(async (id) => {
              console.log("Fetching product details for ID:", id);
              const res = await axiosClient.get(`/products/${id}`);
              console.log("Fetched product details:", res.data);
              return res.data;
            })
          );
          setProductDetails(detailed);
        } else {
          console.log("Using passed product details:", passedProducts);
          setProductDetails(passedProducts);
        }
      } catch (err) {
        console.error("Error loading order details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Normalize products data to have uniform structure
  const normalizedProducts = order?.products.map((item) => {
    // If productDetails were fetched as full product objects (checkout redirect case)
    if (passedProducts.length === 0) {
      // productDetails is an array of product objects matching order products
      const id = typeof item.product === "string" ? item.product : item.product._id;
      const product = productDetails.find((p) => (p._id || p.id) === id);
      return {
        ...product,
        quantity: item.quantity || 1,
        price: item.price || product?.price || 0,
        orderItemId: item._id,
      };
    } else {
      // From MyOrdersPage: product already nested inside item.product
      return {
        ...item.product,
        quantity: item.quantity,
        price: item.price || item.product.price,
        orderItemId: item._id,
      };
    }
  }) || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm max-w-md w-full">
          <FiLoader className="animate-spin text-blue-500 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Loading order details...</h2>
          <p className="text-gray-500 mt-2">Please wait while we fetch your order information</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm max-w-md w-full">
          <FiShoppingBag className="text-blue-500 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Order not found</h2>
          <p className="text-gray-500 mt-2">We couldn't locate the order you're looking for</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
      <button
          onClick={() => navigate(-2)}
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Order Summary */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start">
                <div className="bg-blue-50 p-3 rounded-lg mr-4">
                  <FiShoppingBag className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Order Number</h3>
                  <p className="text-lg font-semibold text-gray-900">{order.id}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-50 p-3 rounded-lg mr-4">
                  <FiCalendar className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-50 p-3 rounded-lg mr-4">
                  <FiDollarSign className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                  <p className="text-lg font-semibold text-gray-900">{formatPrice(order.totalPrice)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          {order.shippingAddress && (
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiTruck className="text-blue-500 mr-2" />
                Shipping Information
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{order.shippingAddress}</p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-6">
              {normalizedProducts.map((product) => (
                <div key={product._id} className="flex flex-col sm:flex-row border-b border-gray-100 pb-6">
                  <div className="flex-shrink-0 mb-4 sm:mb-0">
                    <img
                      src={
                        product?.imageUrl
                          ? product.imageUrl.startsWith("http")
                            ? product.imageUrl
                            : `${import.meta.env.VITE_API_URL}${product.imageUrl}`
                          : "/default-image.jpg"
                      }
                      alt={product?.name || "Product"}
                      className="w-24 h-24 object-cover rounded-lg"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className="flex-1 sm:ml-6">
                    <div className="flex justify-between">
                      <h4 className="text-lg font-medium text-gray-900">
                        {product?.name || "Unknown Product"}
                      </h4>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatPrice(product.price * product.quantity)}
                      </p>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      {product?.description || "No description available"}
                    </p>
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <span className="mr-4">Qty: {product.quantity}</span>
                      <span>Price: {formatPrice(product.price)} each</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex justify-between text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
