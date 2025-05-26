import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosClient from '../utils/axios.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user on app load
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axiosClient.get('/auth/me'); // Backend validates token from cookie
        setCurrentUser(res.data.user);
      } catch (error) {
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  const login = (userData) => {
    setCurrentUser(userData.user); // Backend sets the cookie
  };

  const logout = async () => {
    try {
      await axiosClient.post('/auth/logout'); // Backend clears the cookie
    } catch (error) {}
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
    isBuyer: currentUser?.role === 'buyer',
    isSeller: currentUser?.role === 'seller',
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

