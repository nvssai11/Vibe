import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiUsers, FiCalendar, FiMessageSquare } from 'react-icons/fi';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center text-blue-600 font-bold">
            <span className="text-xl">Community</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FiHome className="mr-2" />
              Home
            </Link>
            <Link 
              to="/dashboard/people-nearby" 
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FiUsers className="mr-2" />
              People
            </Link>
            <Link 
              to="/dashboard/events" 
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FiCalendar className="mr-2" />
              Events
            </Link>
            <Link 
              to="/dashboard/messages" 
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FiMessageSquare className="mr-2" />
              Messages
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <NotificationBell />
          
          <Link 
            to="/dashboard/profile" 
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
              {localStorage.getItem('username')?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}