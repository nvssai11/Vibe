// frontend/src/pages/Admin/ApproveResources.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiFileText, FiCheck } from "react-icons/fi";
import { getPendingResources, approveResource } from "../../api/admin.api";

export default function ApproveResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await getPendingResources();
      setResources(res);
      setError(null);
    } catch (err) {
      setError('Failed to load resources. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleApprove = async (id) => {
    await approveResource(id);
    fetchResources();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-bold text-gray-800 mb-6"
      >
        Pending Resource Approvals
      </motion.h2>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Loading resources...</h3>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <FiFileText className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Error loading resources</h3>
          <p className="mt-1 text-sm text-red-500">{error}</p>
          <button 
            onClick={fetchResources}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-12">
          <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No pending resources</h3>
          <p className="mt-1 text-sm text-gray-500">All resources have been approved.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {resources.map(resource => (
            <motion.li 
              key={resource._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-4 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-800">{resource.title}</h3>
                <p className="text-sm text-gray-500">
                  By {resource.owner.name} • {resource.type}
                </p>
              </div>
              <button
                onClick={() => handleApprove(resource._id)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FiCheck className="mr-2" /> Approve
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}