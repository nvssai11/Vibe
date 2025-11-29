// frontend/src/pages/Admin/AdminDashboard.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiUsers, FiFileText, FiCalendar } from "react-icons/fi";

export default function AdminDashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 p-6"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-gray-800 mb-8"
        >
          Admin Dashboard
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="col-span-full bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-2">Admin Console</h2>
            <p className="text-blue-100">Manage your community platform efficiently</p>
          </div>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link 
              to="/admin/approve-users" 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-4 border-l-4 border-blue-500"
            >
              <motion.div 
                whileHover={{ rotate: 10 }}
                className="p-3 bg-blue-100 rounded-full text-blue-600"
              >
                <FiUsers size={24} />
              </motion.div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Approve Users</h2>
                <p className="text-gray-500">Review new user registrations</p>
              </div>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link 
              to="/admin/approve-resources" 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-4 border-l-4 border-green-500"
            >
              <motion.div 
                whileHover={{ rotate: 10 }}
                className="p-3 bg-green-100 rounded-full text-green-600"
              >
                <FiFileText size={24} />
              </motion.div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Approve Resources</h2>
                <p className="text-gray-500">Manage community resources</p>
              </div>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link 
              to="/admin/approve-events" 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-4 border-l-4 border-purple-500"
            >
              <motion.div 
                whileHover={{ rotate: 10 }}
                className="p-3 bg-purple-100 rounded-full text-purple-600"
              >
                <FiCalendar size={24} />
              </motion.div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Approve Events</h2>
                <p className="text-gray-500">Review upcoming events</p>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}