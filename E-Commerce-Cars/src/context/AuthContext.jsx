import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Stores the logged-in user
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log('AuthContext currentUser:', currentUser);
  }, [currentUser]);
  useEffect(() => {
    // Check if there is a user in localStorage (or sessionStorage)
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setCurrentUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user)); // Store user data
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
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
      {loading? <div>Loading...</div>:children}
    </AuthContext.Provider>
  );
};