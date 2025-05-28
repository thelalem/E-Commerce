import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../context/AuthContext";
import { use, useEffect } from "react";

const ProductCard = ({ product, favoriteId }) => {
    const { addToCart } = useCart();
    const { currentUser, isSeller } = useAuth();

    const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
    const navigate = useNavigate();

    const handleAddToCart = () => {
        if(!currentUser){
            navigate('/login');
            return;
        }
        console.log("Current User:", isSeller);
        if(isSeller){
            console.log("Is Seller:", isSeller);
            toast.error("Sellers cannot add products to cart", {
                position: "bottom-right",
                autoClose: 2500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
            return;
        }
        if(product.stock <= 0) {
            toast.error(`${product.name} is out of stock`, {
                position: "bottom-right",
                autoClose: 2500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        console.log("Adding to cart:", product);
        addToCart(product);
        toast.success(`${product.name} added to cart`, {
            position: "bottom-right",
            autoClose: 2500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const handleFavoriteClick = (e) => {
        e.stopPropagation(); // Prevent event bubbling to parent element
        if(!currentUser){
            navigate('/login');
            return;
        }
        if (isFavorite(product._id)) {
            removeFromFavorites(favoriteId);
            toast.info(`${product.name} removed from favorites`,{
                position: "bottom-right",
                autoClose: 2500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            addToFavorites(product);
            toast.success(`${product.name} added to favorites!`,{
                position: "bottom-right",
                autoClose: 2500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };
    const isOutOfStock = product.stock <= 0;
    
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">

            <button
                onClick={handleFavoriteClick}
                className="absolute top-3 left-3 z-10 p-2 rounded-full hover:bg-white/20 transition-colors duration-200 focus:outline-none"
                aria-label={isFavorite(product.id || product._id) ? "Remove from favorites" : "Add to favorites"}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 ${isFavorite(product.id || product._id) ? 'text-red-500 fill-red-500' : 'text-white fill-white opacity-80'}`}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={isFavorite(product.id || product._id) ? 0 : 1}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                </svg>
            </button>

            <div className="relative pb-[60%] overflow-hidden">
                <img
                    src={product.imageUrl?
                        (product.imageUrl.startsWith('http')
                         ? product.imageUrl 
                         :`${import.meta.env.VITE_API_URL}${product.imageUrl}`) 
                          : '/default-image.jpg'
                    }
                    alt={product.name}
                    className={`absolute h-full w-full object-cover hover:scale-105 transition-transform duration-500" ${
                        isOutOfStock ? 'filter blur-[2px] brightness-90' : ''
                    }`}
                    crossOrigin="anonymous"
                />
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {product.category}
                </div>
                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-red-600/90 text-white text-sm font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 truncate">{product.name}</h3>
                    <span className="text-sm text-gray-500">{product.location}</span>
                </div>
                <div>
                    {product.stock > 0 ?(
                        <span className="text-sm text-green-600 font-medium">
                            In Stock ({product.stock} available)
                        </span>
                    ) : (
                        <span className="text-sm text-red-600 font-semibold">
                            Out of Stock
                        </span>
                    )}
                </div>
                <p className="text-xl font-bold text-blue-600 mb-4">
                    {new Intl.NumberFormat("en-ET", {
                        style: "currency",
                        currency: "ETB",
                        maximumFractionDigits: 0,
                    }).format(product.price)}
                </p>
                
                <div className="flex gap-2">
                    {/* Add to Cart Button */}
                    <button 
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
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
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                    
                    {/* View Details Button */}
                    <Link to={`/product/${product.id || product._id}`} className="flex-1">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center">
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
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                            Details
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;