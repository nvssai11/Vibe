// frontend/src/pages/Auth/Register.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiHome, FiMapPin } from "react-icons/fi";
// import axios from "axios";
import axiosClient from "../../api/axiosClient";

const Register = () => {
  const { register, error, notice } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apartmentOptions, setApartmentOptions] = useState([]);
  const [apartmentId, setApartmentId] = useState("");
  const [flatNumber, setFlatNumber] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [locationError, setLocationError] = useState(null);
  const [loadingApartments, setLoadingApartments] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApartments = async () => {
      setLoadingApartments(true);
      try {
        const response = await axiosClient.get('/admin/apartments');
        setApartmentOptions(response.data.map(apartment => ({
          id: apartment._id,
          name: apartment.name
        })));
      } catch (error) {
        console.error('Error fetching apartments:', error);
      } finally {
        setLoadingApartments(false);
      }
    };

    fetchApartments();
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          setLocationError('Could not fetch location. Please enable location services.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register({ 
      name, 
      email, 
      password, 
      apartmentId, 
      flatNumber,
      location: { coordinates: [longitude, latitude] }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100/30 via-purple-100/30 to-pink-100/30 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Floating background elements */}
      <motion.div 
        animate={{ 
          x: [0, 80, 0],
          y: [0, -60, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -left-20 -top-20 w-40 h-40 rounded-full bg-blue-100 opacity-30"
      />
      <motion.div 
        animate={{ 
          x: [0, -100, 0],
          y: [0, 80, 0],
          rotate: [0, 8, 0]
        }}
        transition={{ 
          duration: 22,
          repeat: Infinity,
          ease: "linear",
          delay: 3
        }}
        className="absolute -right-20 bottom-10 w-48 h-48 rounded-full bg-green-100 opacity-30"
      />
      
      <motion.div 
        initial={{ y: -20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 100 }}
        className="bg-white/20 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/20 relative z-10"
      >
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          className="flex justify-center mb-8"
        >
          <motion.div 
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="bg-gradient-to-r from-green-600 to-blue-500 p-4 rounded-full shadow-lg"
          >
            <FiUser className="h-12 w-12 text-white" />
          </motion.div>
        </motion.div>
        
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">Create Account</h2>
        <p className="text-gray-500 text-center mb-8">Join our community today</p>
        
        {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>}
        {notice && <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded">
          <p className="text-green-700">{notice}</p>
        </div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label classe="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                type="email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apartment ID</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMapPin className="text-gray-400" />
              </div>
              <select
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
                value={apartmentId}
                onChange={(e) => setApartmentId(e.target.value)}
                required
              >
                <option value="">Select your apartment</option>
                {loadingApartments ? (
                  <option value="" disabled>Loading apartments...</option>
                ) : apartmentOptions.length > 0 ? (
                  apartmentOptions.map((apt) => (
                    <option key={apt.id} value={apt.id}>
                      {apt.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No apartments available</option>
                )}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Flat Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiHome className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={flatNumber}
                onChange={(e) => setFlatNumber(e.target.value)}
                placeholder="Enter your flat number"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                type="password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <div className="hidden">
            <input type="hidden" value={latitude} />
            <input type="hidden" value={longitude} />
          </div>
          
          <motion.button
            type="submit"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 5px 15px rgba(16, 185, 129, 0.3)"
            }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white py-3 px-4 rounded-xl font-medium hover:from-indigo-700 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl relative overflow-hidden group"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
            <span className="relative z-10">Register</span>
          </motion.button>
        </form>
        
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Already have an account?{" "}
            <motion.button
              onClick={() => navigate("/login")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-medium text-blue-600 hover:text-blue-500 hover:underline focus:outline-none"
            >
              Login here
            </motion.button>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Register;