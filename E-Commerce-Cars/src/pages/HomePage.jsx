import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../utils/mockProducts';

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get featured products
    const fetchFeaturedProducts = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Filter featured products (you could add a 'featured' flag to your mock data)
        const featured = mockProducts
          .sort(() => 0.5 - Math.random()) // Randomize
          .slice(0, 4); // Get first 4
        
        setFeaturedProducts(featured);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching featured products:", error);
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-4">Find Your Dream Car</h1>
          <p className="text-xl mb-6">Browse our extensive collection of premium vehicles</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/products"
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors text-center"
            >
              Browse All Vehicles
            </Link>
            <Link 
              to="/products?category=SUV"
              className="inline-block bg-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors text-center border border-white"
            >
              Explore SUVs
            </Link>
          </div>
        </div>

        {/* Featured Cars Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Featured Vehicles</h2>
            <Link 
              to="/products" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  className="hover:scale-105 transition-transform duration-300"
                />
              ))}
            </div>
          )}
        </section>

        {/* Popular Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Popular Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { name: 'SUV', count: mockProducts.filter(p => p.category === 'SUV').length },
              { name: 'Sedan', count: mockProducts.filter(p => p.category === 'Sedan').length },
              { name: 'Pickup', count: mockProducts.filter(p => p.category === 'Pickup').length }
            ].map((category) => (
              <Link 
                key={category.name}
                to={`/products?category=${category.name}`}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {category.count} vehicles
                  </span>
                </div>
                <p className="text-gray-600">View all {category.name.toLowerCase()} vehicles</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;