import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const currentUser = useAuth();
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage wwhen the user logs in

  useEffect(() => {
    if (currentUser) {
      const favoritesKey = `favorites_${currentUser.id}`; // Use a user-specific key
      const savedFavorites = localStorage.getItem(favoritesKey);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      } else {
        setFavorites([]); // Initialize an empty favorites list for new users
      }
    }
  }, [currentUser]);

  // Save favorites to localStorage when they change
  useEffect(() => {
    if (currentUser) {
      const favoritesKey = `favorites_${currentUser.id}`; // Use a user-specific key
      localStorage.setItem(favoritesKey, JSON.stringify(favorites));
    }
  }, [favorites, currentUser]);
  const addToFavorites = (product) => {
    setFavorites(prevFavorites => {
      // Check if product is already favorited
      if (prevFavorites.some(item => item.id === product.id)) {
        return prevFavorites;
      }
      return [...prevFavorites, product];
    });
  };

  const removeFromFavorites = (productId) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(item => item.id !== productId)
    );
  };

  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        favoritesCount: favorites.length
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