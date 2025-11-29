
// frontend/src/components/EventCard.jsx
import React from "react";
import { motion } from "framer-motion";

export default function EventCard({ event, currentUser, onRSVP }) {
  const { title, description, date, participants = [], image } = event;

  const hasRSVPed = Array.isArray(participants) && participants?.some(u => u?._id === currentUser?._id);
  const formattedDate = new Date(date).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <motion.div 
      className="event-card border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all bg-white overflow-hidden"
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
        <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
          {formattedDate}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {Array.isArray(participants) && participants.slice(0, 3).map((user, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            ))}
            {participants.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium">
                +{participants.length - 3}
              </div>
            )}
          </div>
          <span className="text-sm text-gray-500">
            {Array.isArray(participants) ? participants.length : 0} {Array.isArray(participants) && participants.length === 1 ? 'person' : 'people'} going
          </span>
        </div>
        
        {!hasRSVPed ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onRSVP(event._id)}
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-md"
          >
            RSVP Now
          </motion.button>
        ) : (
          <div className="flex items-center space-x-1">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-600 font-medium">You're attending</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}