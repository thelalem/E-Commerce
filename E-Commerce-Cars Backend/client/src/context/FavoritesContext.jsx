import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axiosClient from '../utils/axios';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  
  // Fetch or re-sync favorites
  const fetchFavorites = async () => {
    if (currentUser) {
      try {
        setLoading(true);
        const res = await axiosClient.get('/favorites');
        console.log('Fetched favorites:', res.data);
        setFavorites(res.data.favorites || []);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    }
  };

  // Initial fetch when user logs in
  useEffect(() => {
    if (!currentUser) {
      setFavorites([]); // Clear favorites if no user
      return;
    }
    fetchFavorites();
  }, [currentUser]);

  // Add a product to favorites
  const addToFavorites = async (product) => {
    try {
      console.log('Adding to favorites:', product);
      const res = await axiosClient.post('/favorites', {
        productId: product.id || product._id,
      });
      console.log('Favorites after adding:', res.data.favorites);
      await fetchFavorites(); // Ensure state sync
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  // Remove a product from favorites
  const removeFromFavorites = async (productId) => {
    try {
      const favorite = favorites.find( f => f.product._id === productId);
      const res = await axiosClient.delete(`/favorites/${favorite._id}`);
      console.log('Favorites after removing:', res.data.favorites);
      await fetchFavorites(); // Ensure state sync
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  // Check if a product is in the favorites list
  const isFavorite = (productId) => {
    return favorites.some(
      (fav) =>
        (fav.product._id === productId || fav.product.id === productId)
    );
  };
  
  console.log('Favorites:', favorites);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        favoritesCount: favorites.length,
        loading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
