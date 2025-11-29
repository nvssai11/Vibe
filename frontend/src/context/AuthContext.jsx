import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "../api/axiosClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  // Register user
  const register = async (userData) => {
    try {
      await axios.post("/auth/register", userData);
      setNotice("Registration successful. Await admin approval.");
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      const { data } = await axios.post("/auth/login", credentials);

      // Save token
      localStorage.setItem("token", data.token);

      // Get profile
      setCurrentUser(data.user);

      return data.user;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      return null;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setError(null);
    setNotice(null);
  };

  // Load user on app start
  useEffect(() => {
    const loadProfile = async () => {
    console.log('AuthContext: Checking for token in localStorage');
    const token = localStorage.getItem("token");
    if (token) {
      console.log('AuthContext: Found token, attempting to load profile');
      try {
        const { data } = await axios.get("/users/profile");
        console.log('AuthContext: Profile loaded successfully:', data);
        setCurrentUser({
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          apartment: data.apartment?._id || data.apartment,
          status: data.status
        });
      } catch (err) {
        console.error('AuthContext: Failed to load profile:', err);
        localStorage.removeItem("token");
      }
    } else {
      console.log('AuthContext: No token found in localStorage');
    }
    setIsLoading(false);
    console.log('AuthContext: Finished loading profile, isLoading:', false);
  };
    loadProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isLoading,
        error,
        notice,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);