// frontend/src/pages/Dashboard/Resources.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getResources, requestResource, approveResource, returnResource, addResource } from "../../api/resource.api";
import ResourceCard from "../../components/ResourceCard";
import { useAuth } from "../../hooks/useAuth";
import { FiPackage, FiRefreshCw, FiPlus } from "react-icons/fi";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    category: ''
  });
  const { currentUser } = useAuth();
  console.log('Resources: Current user from useAuth:', {
    id: currentUser?._id || currentUser?.id,
    name: currentUser?.name,
    role: currentUser?.role,
    apartment: currentUser?.apartment
  });

  const fetchResources = async () => {
    try {
      console.log(`Fetching all resources`);
      setLoading(true);
      const res = await getResources();
      console.log(`Successfully fetched ${res.data.length} resources`, {
        resources: res.data.map(r => ({
          id: r._id,
          title: r.title,
          owner: r.owner?._id || r.owner,
          borrower: r.borrower?._id || r.borrower
        }))
      });
      setResources(res.data);
    } catch (err) {
      console.error("Failed to fetch resources:", err);
      // Consider adding toast notifications here
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleRequest = async (id) => {
    try {
      await requestResource(id);
      await fetchResources();
    } catch (err) {
      console.error("Failed to request resource:", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveResource(id);
      await fetchResources();
    } catch (err) {
      console.error("Failed to approve resource:", err);
    }
  };

  const handleReturn = async (id) => {
    try {
      await returnResource(id);
      await fetchResources();
    } catch (err) {
      console.error("Failed to return resource:", err);
    }
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    try {
      await addResource({
        title: newResource.title,
        description: newResource.description,
        category: newResource.category,
        apartment: currentUser.apartment
      });
      setNewResource({ title: '', description: '', category: '' });
      setShowCreateForm(false);
      await fetchResources();
    } catch (err) {
      console.error("Failed to create resource:", err);
    }
  };

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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-6 py-8 bg-gradient-to-br from-blue-50/30 to-purple-50/30 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20"
    >
      <div className="flex justify-between items-center mb-8">
        <motion.h2 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3"
        >
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg text-white"
          >
            <FiPackage size={24} />
          </motion.div>
          Apartment Resources
        </motion.h2>
        <motion.button
          onClick={() => setShowCreateForm(!showCreateForm)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg flex items-center gap-2"
        >
          <FiPlus />
          {showCreateForm ? 'Cancel' : 'Add Resource'}
        </motion.button>
        <motion.p 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500"
        >
          {resources.length} {resources.length === 1 ? 'item' : 'items'} available
        </motion.p>
      </div>
      
      {showCreateForm && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Resource</h3>
          <form onSubmit={handleCreateResource} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                placeholder="Resource title" 
                value={newResource.title}
                onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                placeholder="Resource description" 
                value={newResource.description}
                onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition min-h-[100px]"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={newResource.category}
                onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
              >
                <option value="tools">Tools</option>
                <option value="appliances">Appliances</option>
                <option value="furniture">Furniture</option>
                <option value="books">Books</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button 
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Create Resource
            </button>
          </form>
        </motion.div>
      )}
      
      {resources.length === 0 ? 
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="bg-blue-100 p-6 rounded-full mb-6">
            <FiPackage className="text-blue-500 text-4xl" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No resources available</h3>
          <p className="text-gray-500 mb-6">
            There are currently no shared resources in your apartment.
          </p>
          <motion.button
            onClick={fetchResources}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2 relative overflow-hidden group"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <FiRefreshCw className="animate-spin-slow" />
              Refresh Resources
            </span>
          </motion.button>
        </motion.div> :
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {resources.map((r, index) => {
            console.log(`Resources: Rendering resource ${index} (${r._id})`, {
              resourceOwner: r.owner?._id || r.owner,
              currentUser: currentUser?._id || currentUser?.id,
              match: (r.owner?._id || r.owner) === (currentUser?._id || currentUser?.id)
            });
            return (
              <motion.div
                key={r._id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <ResourceCard
                  resource={r}
                  currentUser={currentUser}
                  onRequest={handleRequest}
                  onApprove={handleApprove}
                  onReturn={handleReturn}
                />
              </motion.div>
            );
          })}
        </motion.div>
      }
    </motion.div>
  );
}