import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

// Create AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is logged in when the app loads
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // In a real application, this would be an API call to check if the token is valid
      // const response = await axios.get('/api/auth/check');
      
      // For demo purposes, check local storage
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === 'ADMIN');
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (error) {
      // If the token is invalid, log out the user
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      // In a real application, this would be an API call
      // const response = await axios.post('/api/auth/login', { username, password });
      
      // For demo purposes, simulate a login API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use fake users for demo
      let userData = null;
      
      if (username === 'Admin' && password === 'Admin@12345') {
        userData = {
          id: 1,
          username: 'Admin',
          firstName: 'System',
          lastName: 'Administrator',
          email: 'admin@library.com',
          role: 'ADMIN',
          token: 'fake-jwt-token-admin'
        };
      } else if (username === 'admin' && password === 'password') {
        userData = {
          id: 1,
          username: 'admin',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@example.com',
          role: 'ADMIN',
          token: 'fake-jwt-token-admin'
        };
      } else if (username === 'user' && password === 'password') {
        userData = {
          id: 2,
          username: 'user',
          firstName: 'Regular',
          lastName: 'User',
          email: 'user@example.com',
          role: 'USER',
          token: 'fake-jwt-token-user'
        };
      } else {
        // Check registeredUsers for any matching user
        const storedUsers = localStorage.getItem('registeredUsers');
        if (storedUsers) {
          const registeredUsers = JSON.parse(storedUsers);
          const matchingUser = registeredUsers.find(user => 
            user.username === username && user.password === password
          );
          
          if (matchingUser) {
            userData = matchingUser;
          }
        }
        
        if (!userData) {
          // Simulate a failed login
          throw new Error('Invalid username or password');
        }
      }
      
      // Store user data in localStorage (or you could use cookies)
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(userData.role === 'ADMIN');
      
      return { success: true, message: 'Login successful' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed. Please try again.' };
    }
  };

  const register = async (userData) => {
    try {
      // In a real application, this would be an API call
      // const response = await axios.post('/api/auth/register', userData);
      
      // For demo purposes, simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful registration
      const newUser = {
        id: Math.floor(Math.random() * 1000),
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password, // Store password for demo purposes
        role: 'USER',
        token: 'fake-jwt-token-new-user'
      };
      
      // Store registered user in a list of users for login purposes
      const storedUsers = localStorage.getItem('registeredUsers');
      let registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];
      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      // Auto-login after registration
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      setIsAuthenticated(true);
      setIsAdmin(false);
      
      return { success: true, message: 'Registration successful. You are now logged in.' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: error.message || 'Registration failed. Please try again.' };
    }
  };

  const logout = () => {
    // Remove user data from localStorage
    localStorage.removeItem('user');
    
    // Update state
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const updateUserProfile = async (updatedUserData) => {
    try {
      // In a real application, this would be an API call
      // const response = await axios.put('/api/users/profile', updatedUserData);
      
      // For demo purposes, simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local storage
      const updatedUser = { ...user, ...updatedUserData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      
      return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: error.message || 'Failed to update profile. Please try again.' };
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      // In a real application, this would be an API call
      // const response = await axios.post('/api/auth/forgot-password', { email });
      
      // For demo purposes, simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful password reset request
      return { success: true, message: 'Password reset instructions sent to your email.' };
    } catch (error) {
      console.error('Password reset request error:', error);
      return { success: false, message: error.message || 'Failed to send password reset. Please try again.' };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
    requestPasswordReset
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 