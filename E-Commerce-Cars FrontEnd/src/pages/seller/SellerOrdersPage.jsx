import React, { useEffect, useState } from "react";
import axiosClient from "../../utils/axios";
import { useAuth } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

const SellerOrdersPage = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerOrders = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get(`/orders/seller/orders`);
        console.log("Fetched seller orders:", res.data);

        const productIds = res.data.flatMap((order) =>
          order.products.map((item) => item.product._id)
        );

        const productDetailsRes = await axiosClient.post(`/products/batch`, {
          productIds,
        });
        const productDetails = productDetailsRes.data;

        const ordersWithProductDetails = res.data.map((order) => {
          const productsWithDetails = order.products.map((item) => {
            const productDetail = productDetails.find(
              (product) => product._id === item.product._id
            );
            return {
              ...productDetail,
              quantity: item.quantity,
            };
          });
          return { ...order, products: productsWithDetails };
        });
        console.log("Orders with product details:", ordersWithProductDetails);
        setOrders(ordersWithProductDetails);
      } catch (error) {
        console.error("Error fetching seller orders:", error);
        setOrders([]);
        toast.error("Failed to fetch seller orders."); // Show error toast
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchSellerOrders();
    }
  }, [currentUser]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosClient.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Order status updated successfully!"); // Show success toast
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update order status."
      ); // Show error toast
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-blue-500 rounded-full mb-2"></div>
          <p className="text-blue-600 font-medium">Loading orders...</p>
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
          No orders found
        </h3>
        <p className="text-gray-500">Orders for your products will appear here</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToastContainer /> {/* Add ToastContainer here */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">Orders for Your Products</h1>
          <p className="text-gray-500 mt-1">
            Manage all orders containing your products
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Buyer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (

                <tr key={order._id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order._id? order._id.slice(0, 8): 'unknown'}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.buyer?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-3">
                      {order.products.map((product, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <img
                            src={
                              product?.imageUrl
                                ? product.imageUrl.startsWith("http")
                                  ? product.imageUrl
                                  : `${import.meta.env.VITE_API_URL}${product.imageUrl}`
                                : "/default-image.jpg"
                            }
                            alt={product?.name || "Product"}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                            crossOrigin="anonymous"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {product.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Intl.NumberFormat("en-ET", {
                      style: "currency",
                      currency: "ETB",
                    }).format(order.totalPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`block w-full pl-3 pr-10 py-2 text-base border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        order.status === "pending"
                          ? "border-yellow-300 bg-yellow-50 text-yellow-700"
                          : order.status === "shipped"
                          ? "border-blue-300 bg-blue-50 text-blue-700"
                          : order.status === "delivered"
                          ? "border-green-300 bg-green-50 text-green-700"
                          : "border-red-300 bg-red-50 text-red-700"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerOrdersPage;
