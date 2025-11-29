// frontend/src/components/ResourceCard.jsx
import React from "react";
import { motion } from "framer-motion";

export default function ResourceCard({ resource, currentUser, onRequest, onApprove, onReturn }) {
  const { title, description, status, owner, borrower, image } = resource;

console.log('ResourceCard debug:', {
  resourceStatus: status,
  ownerId: owner?._id,
  currentUserId: currentUser?.id,
  canApprove: owner?._id === currentUser?.id
});

const canApprove = owner?._id === currentUser?.id;
const canReturn = borrower?._id === currentUser?.id;


  const statusColors = {
    available: 'bg-green-100 text-green-800 border-green-200',
    requested: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    borrowed: 'bg-red-100 text-red-800 border-red-200'
  };

  const statusIcons = {
    available: (
      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    requested: (
      <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    borrowed: (
      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    )
  };

  return (
    <motion.div 
      className="resource-card border rounded-xl p-5 shadow-lg hover:shadow-xl transition-all bg-white"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {image && (
        <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <div className="flex items-center space-x-1">
          {statusIcons[status]}
          <span className={`text-xs px-3 py-1 rounded-full border font-medium ${statusColors[status]}`}>
            {status.toUpperCase()}
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center">
          <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-sm text-gray-600">
            <span className="font-medium">Owner:</span> {owner?.name || (owner?._id ? 'Anonymous' : 'Not specified')}
          </span>
        </div>
        
        {borrower && (
          <div className="flex items-center">
            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-sm text-gray-600">
              <span className="font-medium">Borrower:</span> {borrower?.name || (borrower?._id ? 'Anonymous' : 'Not specified')}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex gap-3">
        {status === "available" && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onRequest(resource._id)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium text-sm shadow-md"
          >
            Request
          </motion.button>
        )}
        
        {status === "requested" && canApprove && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onApprove(resource._id)}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-medium text-sm shadow-md"
          >
            Approve
          </motion.button>
        )}
        
        {status === "borrowed" && canReturn && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onReturn(resource._id)}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-medium text-sm shadow-md"
          >
            Return
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}