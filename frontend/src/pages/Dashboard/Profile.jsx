// frontend/src/pages/Dashboard/Profile.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { updateProfile } from "../../api/user.api";
import { FiUser, FiMail, FiPhone, FiHome, FiSave } from "react-icons/fi";
import { getProfile } from "../../api/user.api";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [flatNumber, setFlatNumber] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Attempting to fetch profile...');
        if (!user) {
          console.warn('No user object available');
          return;
        }
        
        const profile = await getProfile();
        console.log('Profile data received:', profile);
        
        setName(profile.name || '');
        setEmail(profile.email || '');
        setPhone(profile.phone || '');
        setFlatNumber(profile.flatNumber || '');
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        alert('Failed to load profile. Please try again.');
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateProfile({ name, email, phone, flatNumber });
      setUser(updated);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-6 py-8 bg-gradient-to-br from-indigo-50/30 to-violet-50/30 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20"
    >
      <motion.h2 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent flex items-center gap-3"
        >
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="p-2 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg text-white"
          >
            <FiUser size={24} />
          </motion.div>
          My Profile
        </motion.h2>
      
      <motion.form 
        onSubmit={handleSubmit}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-6 bg-white p-8 rounded-xl shadow-md"
      >
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-2"
        >
          <label className="flex items-center gap-2 text-gray-600">
            <FiUser />
            Full Name
          </label>
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required 
          />
        </motion.div>
        
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-2"
        >
          <label className="flex items-center gap-2 text-gray-600">
            <FiMail />
            Email
          </label>
          <input 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required 
          />
        </motion.div>
        
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-2"
        >
          <label className="flex items-center gap-2 text-gray-600">
            <FiPhone />
            Phone
          </label>
          <input 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </motion.div>
        
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="space-y-2"
        >
          <label className="flex items-center gap-2 text-gray-600">
            <FiHome />
            Flat Number
          </label>
          <input 
            value={flatNumber} 
            onChange={e => setFlatNumber(e.target.value)} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </motion.div>
        
        <motion.button
            type="submit"
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2 relative overflow-hidden group"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <FiSave className="animate-pulse" />
              Save Changes
            </span>
          </motion.button>
      </motion.form>
    </motion.div>
  );
}