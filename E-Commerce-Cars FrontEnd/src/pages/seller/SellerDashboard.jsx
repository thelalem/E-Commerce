import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../utils/axios';

const SellerDashboard = () => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
    productName: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Fetch products for the current seller from backend
        const res = await axiosClient.get(`/products/seller/${currentUser?.id}`);
        const sellerProducts = res.data;
        setProducts(sellerProducts);

        const totalValue = sellerProducts.reduce((sum, product) => {
          const price = typeof product.price === "number"
            ? product.price
            : parseFloat((product.price || "0").toString().replace(/[^0-9.]/g, ''));
          return sum + price;
        }, 0);

        setStats({
          totalProducts: sellerProducts.length,
          totalValue: totalValue.toLocaleString('en-US', {
            style: 'currency',
            currency: 'ETB',
            maximumFractionDigits: 0,
          }),
        });
      } catch (error) {
        setProducts([]);
        setStats({ totalProducts: 0, totalValue: 0 });
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchProducts();
    }
  }, [currentUser]);

  const handleDelete = (productId) => {
    const productToDelete = products.find(p => (p.id || p._id) === productId);
    setDeleteModal({
      isOpen: true,
      productId,
      productName: productToDelete?.name || ''
    });
  };

  const confirmDelete = async () => {
    try {
      await axiosClient.delete(`/products/${deleteModal.productId}`);
      setProducts(products.filter(product => (product.id || product._id) !== deleteModal.productId));
      setDeleteModal({ isOpen: false, productId: null, productName: '' });
    } catch (error) {
      setDeleteModal({ isOpen: false, productId: null, productName: '' });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {/* Dashboard Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500">Total Products</h3>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500">Total Inventory Value</h3>
          <p className="text-4xl font-bold">{stats.totalValue}</p>
        </div>
      </div>

      {/* Products List Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Your Products</h3>
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">You haven't added any products yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id || product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 overflow-hidden">
                  {product.imageUrl && (
                    <img
                    src={product.imageUrl?
                      (product.imageUrl.startsWith('http')
                       ? product.imageUrl 
                       :`${import.meta.env.VITE_API_URL}${product.imageUrl}`) 
                        : '/default-image.jpg'
                  }
                      alt={product.name}
                      className="w-full h-full object-cover"
                      crossOrigin='anonymous'
                      
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'ETB',
                      maximumFractionDigits: 0,
                    }).format(product.price)}
                  </p>

                    {/* ✅ Stock indicator with color */}
                    <p className="text-sm mt-1">
                      {product.stock === 0 ? (
                        <span className="text-red-600 font-semibold">Out of Stock</span>
                      ) : product.stock < 5 ? (
                        <span className="text-yellow-600 font-semibold">Low Stock: {product.stock}</span>
                      ) : (
                        <span className="text-green-600 font-semibold">In Stock: {product.stock}</span>
                      )}
                    </p>

                  <p className="text-sm text-gray-500 mt-2">{product.category}</p>
                  <div className="mt-4 flex space-x-2">
                    <Link
                      to={`/seller/edit-product/${product._id}`}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6">
        <Link
          to="/seller/orders"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View Orders
        </Link>
      </div>

      {deleteModal.isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete "{deleteModal.productName}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteModal({ isOpen: false, productId: null, productName: '' })}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
