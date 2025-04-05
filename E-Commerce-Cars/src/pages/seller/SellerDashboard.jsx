import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SellerDashboard = () => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats,setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
    productName: ''
  });

  useEffect(() => {
    console.log('Logged-in user in SellerDashboard:', currentUser);
  }, [currentUser]);

  useEffect(() => {
    const fetchProducts = () => {
      try {
        const mockProducts = JSON.parse(localStorage.getItem('products') || '[]');
        const sellerProducts = mockProducts.filter(product => product.seller === currentUser?.name);

        setProducts(sellerProducts);

        const totalValue = sellerProducts.reduce((sum, product) => {
          const price = parseFloat(product.price.replace(/[^0-9.]/g, ''));
          return sum + price;
        }, 0);

        setStats({
          totalProducts: sellerProducts.length,
          totalValue: totalValue.toLocaleString('en-US', {
            style: 'currency',
            currency: 'ETB',
          }),
        });

      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchProducts();
    }
  }, [currentUser]);

  const handleDelete = (productId) => {
    const productToDelete = products.find(p => p.id === productId);
    setDeleteModal({
      isOpen: true,
      productId,
      productName: productToDelete.name
    });
  };

  const confirmDelete = () => {
    const updatedProducts = products.filter(product => product.id !== deleteModal.productId);
    setProducts(updatedProducts);
    
    const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const filteredProducts = allProducts.filter(product => product.id !== deleteModal.productId);
    localStorage.setItem('products', JSON.stringify(filteredProducts));
    
    setDeleteModal({ isOpen: false, productId: null, productName: '' });
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
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 overflow-hidden">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
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
                  <p className="text-sm text-gray-500 mt-2">{product.category}</p>
                  <div className="mt-4 flex space-x-2">
                    <Link
                      to={`/seller/edit-product/${product.id}`}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
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
