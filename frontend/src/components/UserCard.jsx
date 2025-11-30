// frontend/src/components/UserCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';

export default function UserCard({ user }) {
  const roleColors = {
    resident: 'bg-green-100 text-green-800 border-green-200',
    apartment_admin: 'bg-blue-100 text-blue-800 border-blue-200',
    super_admin: 'bg-purple-100 text-purple-800 border-purple-200'
  };

  const navigate = useNavigate();
  return (
    <motion.div 
      className="user-card border rounded-xl p-5 shadow-lg hover:shadow-xl transition-all bg-white"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-4 mb-4">
        <motion.div 
          className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold shadow-inner"
          whileHover={{ scale: 1.05 }}
        >
          {user.name?.charAt(0)?.toUpperCase() || '?'}
        </motion.div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800">{user.name || "Unnamed Resident"}</h3>
          <p className="text-gray-500 text-sm">{user.email}</p>
          
          {user.flatNumber && (
            <div className="flex items-center mt-1 space-x-1">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm text-gray-500">
                {user.apartmentName ? `${user.apartmentName} - Flat #${user.flatNumber}` : `Flat #${user.flatNumber}`}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
        {user.role && (
          <motion.span 
            className={`inline-block px-3 py-1 text-xs rounded-full border ${roleColors[user.role] || 'bg-gray-100 text-gray-800 border-gray-200'} font-medium`}
            whileHover={{ scale: 1.05 }}
          >
            {user.role.replace("_", " ").toUpperCase()}
          </motion.span>
        )}

        <div className="flex items-center gap-3">
          {user.distance && (
          <div className="flex items-center space-x-1">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-600">
              {user.distance}m away
            </span>
          </div>
        )}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const validName = user.name && user.name !== "na" ? user.name : (user.email || "Unnamed Resident");
            navigate(`/dashboard/messages?id=${encodeURIComponent(user._id)}&name=${encodeURIComponent(validName)}`);
          }}
          className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Chat
        </motion.button>
        </div>
      </div>
    </motion.div>
  );
}