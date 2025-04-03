import React,{useState, useEffect, use} from "react";
import { mockProducts } from "../utils/mockProducts";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";

function HomePage(){
    const[products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [category, setCategory] = useState("");
    const [location,setLocation] = useState("");
    const [priceRange, setPriceRange] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000)); 
                
                setProducts(mockProducts);
                setFilteredProducts(mockProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
    
        fetchProducts();
    }, []);
    

    useEffect(() => {
        console.log("Filtered Products:", filteredProducts);
      }, [filteredProducts]);
      

    useEffect(() => {
        let filtered = products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    
        if (category) {
          filtered = filtered.filter((product) => product.category === category);
        }
    
        if (location) {
          filtered = filtered.filter((product) => product.location === location);
        }
    
        if (priceRange) {
          filtered = filtered.filter((product) => {
            const price = parseInt(product.price.replace(/[^0-9]/g, ""));
            if (priceRange === "0-30000") return price >= 0 && price <= 30000;
            if (priceRange === "30001-60000") return price > 30000 && price <= 60000;
            if (priceRange === "60001+") return price > 60000;
            return true;
          });
        }
    
        setFilteredProducts(filtered);
      }, [searchQuery, category, location, priceRange, products]);


      return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="mb-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white">
                    <h1 className="text-4xl font-bold mb-4">Find Your Dream Car</h1>
                    <p className="text-xl mb-6">Browse our extensive collection of premium vehicles</p>
                    
                    {/* Search Input */}
                    <div className="relative max-w-2xl">
                        <input
                            type="text"
                            className="w-full p-4 pr-12 rounded-lg text-white bg-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white placeholder-white/80 border border-white/30"
                            placeholder="Search cars by make, model, or keyword..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <svg
                            className="absolute right-4 top-4 h-6 w-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Refine Your Search</h2>
                    <div className="flex flex-wrap gap-4">
                        {/* Category Filter */}
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                <option value="SUV">SUV</option>
                                <option value="Sedan">Sedan</option>
                                <option value="Pickup">Pickup</option>
                            </select>
                        </div>

                        {/* Location Filter */}
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            >
                                <option value="">All Locations</option>
                                <option value="New York">New York</option>
                                <option value="Los Angeles">Los Angeles</option>
                                <option value="Chicago">Chicago</option>
                            </select>
                        </div>

                        {/* Price Range Filter */}
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                            >
                                <option value="">All Prices</option>
                                <option value="0-30000">Up to $30,000</option>
                                <option value="30001-60000">$30,001 - $60,000</option>
                                <option value="60001+">Above $60,000</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Featured Cars */}
                <section className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Featured Cars</h2>
                        <p className="text-gray-600">{filteredProducts.length} cars available</p>
                    </div>
                    
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No cars found</h3>
                            <p className="mt-2 text-gray-600">Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
export default HomePage;