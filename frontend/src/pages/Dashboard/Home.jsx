import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FiUsers, FiBook, FiCalendar, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Home() {
  const { user } = useAuth();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-6 py-8 bg-gradient-to-br from-amber-50/30 to-orange-50/30 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20"
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome back, {user?.name || "Resident"}!
        </h1>
        <p className="text-lg text-gray-500">Connect with your community and access helpful resources</p>
      </motion.div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        <motion.div 
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link 
            to="/dashboard/people-nearby" 
            className="bg-white/90 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-blue-300/30 text-center relative overflow-hidden group backdrop-blur-sm"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
            />
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 relative z-10 shadow-lg">
              <FiBook className="text-white text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 relative z-10">People Nearby</h3>
            <p className="text-gray-500 text-sm relative z-10">Connect with neighbors in your area</p>
          </Link>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link 
            to="/dashboard/resources" 
            className="bg-white/90 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-green-300/30 text-center relative overflow-hidden group backdrop-blur-sm"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
            />
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 relative z-10 shadow-lg">
              <FiCalendar className="text-white text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 relative z-10">Resources</h3>
            <p className="text-gray-500 text-sm relative z-10">Access community guides and tools</p>
          </Link>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link 
            to="/dashboard/events" 
            className="bg-white/90 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-purple-300/30 text-center relative overflow-hidden group backdrop-blur-sm"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
            />
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 relative z-10 shadow-lg">
              <FiUser className="text-white text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 relative z-10">Events</h3>
            <p className="text-gray-500 text-sm relative z-10">Discover and join local events</p>
          </Link>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link 
            to="/dashboard/profile" 
            className="bg-white/90 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-amber-300/30 text-center relative overflow-hidden group backdrop-blur-sm"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
            />
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 relative z-10 shadow-lg">
              <FiUsers className="text-white text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 relative z-10">Profile</h3>
            <p className="text-gray-500 text-sm relative z-10">Update your personal information</p>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}