import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import axiosClient from '../utils/axios';
import { FiArrowRight, FiShoppingBag, FiStar, FiTruck, FiDollarSign , FiLoader} from 'react-icons/fi';

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featuredRes, allRes] = await Promise.all([
          axiosClient.get('/products/featured'),
          axiosClient.get('/products')
        ]);
        setFeaturedProducts(featuredRes.data);
        setAllProducts(allRes.data);
        console.log("Featured Products:", featuredRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-xl shadow-sm max-w-md w-full">
            <FiLoader className="animate-spin text-blue-500 text-4xl mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">Loading ...</h2>
          </div>
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="mb-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-4">Find Your Dream Car</h1>
              <p className="text-xl mb-6 max-w-2xl">Discover premium vehicles at competitive prices with our trusted dealership</p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/products"
                  className="inline-flex items-center justify-center bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors text-center shadow-md"
                >
                  Browse All Vehicles
                  <FiArrowRight className="ml-2" />
                </Link>
                <Link 
                  to="/products?category=SUV"
                  className="inline-flex items-center justify-center bg-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors text-center border border-white shadow-sm"
                >
                  Explore SUVs
                  <FiTruck className="ml-2" />
                </Link>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-20">
              <svg width="300" height="300" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#FFFFFF" d="M45.4,-45.2C58.7,-31.9,69.3,-15.9,69.3,0C69.3,15.9,58.7,31.9,45.4,45.2C32.1,58.5,16,69.2,0,69.2C-16,69.2,-32.1,58.5,-45.4,45.2C-58.7,31.9,-69.3,15.9,-69.3,0C-69.3,-15.9,-58.7,-31.9,-45.4,-45.2C-32.1,-58.5,-16,-69.2,0,-69.2C16,-69.2,32.1,-58.5,45.4,-45.2Z" transform="translate(100 100)" />
              </svg>
            </div>
          </div>

          {/* Value Propositions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: <FiStar className="text-2xl text-blue-600" />, title: "Premium Selection", text: "Curated collection of high-quality vehicles" },
              { icon: <FiDollarSign className="text-2xl text-blue-600" />, title: "Competitive Pricing", text: "Best value for your investment" },
              { icon: <FiShoppingBag className="text-2xl text-blue-600" />, title: "Easy Ordering", text: "Simple process from selection to delivery" }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-full">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Featured Cars Section */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <FiStar className="mr-2 text-blue-600" /> Featured Vehicles
              </h2>
              <Link 
                to="/products" 
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View all <FiArrowRight className="ml-1" />
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
                    key={product._id} 
                    product={product} 
                    className="hover:scale-[1.02] transition-transform duration-300 hover:shadow-lg"
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
                { name: 'SUV', count: allProducts.filter(p => p.category === 'SUV').length, icon: <FiTruck className="text-blue-600" /> },
                { name: 'Sedan', count: allProducts.filter(p => p.category === 'Sedan').length, icon: <FiShoppingBag className="text-blue-600" /> },
                { name: 'Pickup', count: allProducts.filter(p => p.category === 'Pickup').length, icon: <FiShoppingBag className="text-blue-600" /> }
              ].map((category) => (
                <Link 
                  key={category.name}
                  to={`/products?category=${category.name}`}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="bg-blue-50 p-2 rounded-full">
                      {category.icon}
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {category.count} vehicles
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">View all {category.name.toLowerCase()} vehicles</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <div className="bg-blue-600 rounded-xl p-8 text-center text-white mb-12">
            <h2 className="text-2xl font-bold mb-4">Ready to find your perfect vehicle?</h2>
            <p className="mb-6 max-w-2xl mx-auto">Our team is here to help you with every step of your car buying journey</p>
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-md"
            >
              Contact Us
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;