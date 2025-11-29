// frontend/src/pages/Dashboard/PeopleNearby.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getNearbyUsers } from "../../api/user.api";
import UserCard from "../../components/UserCard";
import { FiUsers, FiRefreshCw, FiMapPin } from "react-icons/fi";

export default function PeopleNearby() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNearby = () => {
      if (!navigator.geolocation) {
        setError("Geolocation not supported by your browser.");
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await getNearbyUsers({ lat: latitude, lng: longitude, radius: 2000 });

            // Ensure we get an array
            const usersArray = Array.isArray(res) ? res : res.users || [];
            setUsers(usersArray);
          } catch (err) {
            setError("Failed to fetch nearby users.");
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          setError("Unable to retrieve your location.");
          setLoading(false);
          if (err.code === 1) { // PERMISSION_DENIED
            window.location.href = '/dashboard';
          }
        }
      );
    };

    fetchNearby();
  }, []);

  if (loading) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center h-64"
    >
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-blue-100 rounded-full mb-4"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>
    </motion.div>
  );
  
  if (error) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-64 text-red-500"
    >
      <div className="text-center p-4 bg-red-50 rounded-lg max-w-md">
        <p>{error}</p>
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-6 py-8 bg-gradient-to-br from-green-50/30 to-teal-50/30 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20"
    >
      <div className="flex justify-between items-center mb-8">
        <motion.h2 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-3"
        >
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="p-2 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg text-white"
          >
            <FiUsers size={24} />
          </motion.div>
          People Nearby
        </motion.h2>
      </div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8 flex items-center gap-3 bg-blue-50 p-4 rounded-lg"
      >
        <FiMapPin className="text-blue-500" />
        <span className="text-gray-700">Showing residents within 2km radius</span>
      </motion.div>

      {users.length === 0 ? (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="bg-blue-100 p-6 rounded-full mb-6">
            <FiUsers className="text-blue-500 text-4xl" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No residents found nearby</h3>
          <p className="text-gray-500 mb-6 max-w-md">
            We couldn't find any community members in your immediate area. Try again later or expand your search radius.
          </p>
          <motion.button
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-green-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              <FiRefreshCw className="animate-spin-slow" />
              Refresh Location
            </span>
          </motion.button>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {users.map((user, index) => (
            <motion.div 
              key={user._id || user.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <UserCard user={user} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}