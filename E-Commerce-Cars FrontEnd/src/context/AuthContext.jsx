import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosClient from '../utils/axios.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  // Fetch current user on app load
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axiosClient.get('/auth/me'); 
        setCurrentUser(res.data.user);
      } catch (error) {
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  const login = ({token, user}) => {
    setAccessToken(token);
    setCurrentUser(user); // Backend sets the cookie
    localStorage.setItem('accessToken', token); // Store token in localStorage
  };

  const logout = async () => {
    try {
      await axiosClient.post('/auth/logout'); // Backend clears the cookie
    } catch (error) {}
    setCurrentUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken'); // Clear token from localStorage
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

