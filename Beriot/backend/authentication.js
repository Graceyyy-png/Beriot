// auth.js
import React, { useState, createContext, useContext } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  // ... other config details
};

firebase.initializeApp(firebaseConfig);

// Authentication Context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // User Registration
  const register = async (email, password) => {
    try {
      const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
      return result.user;
    } catch (error) {
      console.error('Registration Error', error);
      throw error;
    }
  };

  // User Login
  const login = async (email, password) => {
    try {
      const result = await firebase.auth().signInWithEmailAndPassword(email, password);
      return result.user;
    } catch (error) {
      console.error('Login Error', error);
      throw error;
    }
  };

  // Logout
  const logout = () => {
    return firebase.auth().signOut();
  };

  // Social Login
  const googleLogin = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await firebase.auth().signInWithPopup(provider);
      return result.user;
    } catch (error) {
      console.error('Google Login Error', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      register, 
      login, 
      logout, 
      googleLogin 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook for Authentication
export function useAuth() {
  return useContext(AuthContext);
}