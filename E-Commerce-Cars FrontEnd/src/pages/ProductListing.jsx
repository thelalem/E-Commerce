import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { useSearchParams } from 'react-router-dom';
import axiosClient from "../utils/axios.js";
import {  FiLoader } from "react-icons/fi";

function ProductListingPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [debouncedQuery, setDebouncedQuery] = useState(searchParams.get('query') || '');

    //Get filters from URL params
    const category = searchParams.get('category') || '';
    const location = searchParams.get('location') || '';
    const priceRange = searchParams.get('priceRange') || '';
    const sortOption = searchParams.get('sort') || '';
    const searchQuery = searchParams.get('query') || '';
    

    // Debounce search query 
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchQuery]);
    
    
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if(category) params.append('category', category);
                if(location) params.append('location', location);
                if(priceRange){
                    const [minPrice, maxPrice] = priceRange.split('-');
                    if(minPrice) params.append('minPrice', minPrice);
                    if(maxPrice) params.append('maxPrice', maxPrice.replace('+', ''));
                }
                if(sortOption) params.append('sort', sortOption);
                if(debouncedQuery) params.append('query', debouncedQuery);

                const res = await axiosClient.get(`/products/search?${params.toString()}`);
                const data = res.data;
                console.log("Fetched Products nside product listing:", data.products);
                setProducts(Array.isArray(data.products) ? data.products : []);
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            }
            setLoading(false);
        };
        fetchProducts();
    }, [category, location, priceRange, sortOption, debouncedQuery]);



    const handleFilterChange = (filterName, value) => {
        // Update URL params when filters change
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(filterName, value);
        } else {
            newParams.delete(filterName);
        }
        setSearchParams(newParams);   
    };
    if (loading) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8 bg-white rounded-xl shadow-sm max-w-md w-full">
              <FiLoader className="animate-spin text-blue-500 text-4xl mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700">Loading Products</h2>
              <p className="text-gray-500 mt-2">Please wait while we fetch Products</p>
            </div>
          </div>
        );
      }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="container mx-auto px-4 py-8">
                {/* Search and Filters */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Find Your Vehicle</h2>
                    <div className="relative max-w-2xl mb-6">
                        <input
                            type="text"
                            className="w-full p-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Search cars by make, model, or keyword..."
                            value={searchQuery}
                            onChange={(e) => handleFilterChange('query', e.target.value)}
                        />
                        <svg
                            className="absolute right-4 top-4 h-6 w-6 text-gray-400"
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

                    <div className="flex flex-wrap gap-4">
                        {/* Category Filter */}
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
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
                                onChange={(e) => handleFilterChange('location', e.target.value)}
                            >
                                <option value="">All Locations</option>
                                <option value="Addis Ababa">Addis Ababa</option>
                                <option value="Adama"> Adama</option>
                                <option value="Dire Dawa">Dire Dawa</option>
                            </select>
                        </div>

                        {/* Price Range Filter */}
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (in Birr)</label>
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={priceRange}
                                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                            >
                                <option value="">All Prices</option>
                                <option value="0-4500000">Up to 4,500,000 Birr</option>
                                <option value="4500001-9000000">4,500,001 - 9,000,000 Birr</option>
                                <option value="9000001+">Above 9,000,000 Birr</option>
                            </select>
                        </div>

                        {/* Sorting Option */}
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={sortOption}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                            >
                                <option value="">Default</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="name-asc">Name: A to Z</option>
                                <option value="name-desc">Name: Z to A</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Product Listing */}
                <section className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Available Cars</h2>
                        <div className="flex items-center gap-4">
                            <p className="text-gray-600">{products.length} cars available</p>
                        </div>
                    </div>
                    
                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
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

export default ProductListingPage;