import React, { useState, useEffect } from "react";
import { mockProducts } from "../utils/mockProducts";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { useSearchParams } from 'react-router-dom';

function ProductListingPage() {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [priceRange, setPriceRange] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

    // Fetch products only once
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000)); 
                setProducts(mockProducts);
                setFilteredProducts(mockProducts); // Initialize filteredProducts only once
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []); // Run only once when the component mounts

    // Initialize filters from URL params
    useEffect(() => {
        const urlCategory = searchParams.get('category');
        const urlSort = searchParams.get('sort');
        if (urlCategory) setCategory(urlCategory);
        if (urlSort) setSortOption(urlSort);
    }, [searchParams]); // Only update filters, not products

    // Apply filters and sorting whenever state changes
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

        // Apply sorting
        filtered = [...filtered].sort((a, b) => {
            if (sortOption === "price-asc") {
                const priceA = parseInt(a.price.replace(/[^0-9]/g, ""));
                const priceB = parseInt(b.price.replace(/[^0-9]/g, ""));
                return priceA - priceB;
            } else if (sortOption === "price-desc") {
                const priceA = parseInt(a.price.replace(/[^0-9]/g, ""));
                const priceB = parseInt(b.price.replace(/[^0-9]/g, ""));
                return priceB - priceA;
            } else if (sortOption === "name-asc") {
                return a.name.localeCompare(b.name);
            } else if (sortOption === "name-desc") {
                return b.name.localeCompare(a.name);
            }
            return 0;
        });
    
        setFilteredProducts(filtered);
    }, [searchQuery, category, location, priceRange, products, sortOption]);

    const handleFilterChange = (filterName, value) => {
        // Update URL params when filters change
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(filterName, value);
        } else {
            newParams.delete(filterName);
        }
        setSearchParams(newParams);
        
        // Update state
        switch(filterName) {
            case 'category': setCategory(value); break;
            case 'location': setLocation(value); break;
            case 'priceRange': setPriceRange(value); break;
            case 'sort': setSortOption(value); break;
            default: break;
        }
    };

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
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                            >
                                <option value="">All Prices</option>
                                <option value="0-30000">Up to $30,000</option>
                                <option value="30001-60000">$30,001 - $60,000</option>
                                <option value="60001+">Above $60,000</option>
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
                            <p className="text-gray-600">{filteredProducts.length} cars available</p>
                        </div>
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

export default ProductListingPage;