// frontend/src/pages/Dashboard/Events.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getEvents, createEvent, rsvpEvent } from "../../api/event.api";
import EventCard from "../../components/EventCard";
import { useAuth } from "../../hooks/useAuth";
import { FiCalendar, FiPlus, FiRefreshCw } from "react-icons/fi";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const { currentUser } = useAuth();
  const apartmentId = currentUser?.apartment;
  console.log('Current user object:', currentUser);
  console.log('Extracted apartmentId:', apartmentId);

  const fetchEvents = async () => {
    try {
      console.log('Fetching events for apartment triggered events:', apartmentId);
      
      setLoading(true);
      
      const res = await getEvents(apartmentId);
      console.log('Events API response:', res);
      setEvents(res);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching events:', err);
      alert("Failed to fetch events");
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Apartment ID changed:', apartmentId);
    if (apartmentId) fetchEvents();
    else console.log('No apartment ID available');
  }, [apartmentId]);

  if (!apartmentId) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-700">No apartment assigned</h3>
        <p className="mt-2 text-gray-500">
          Please contact your apartment admin to get assigned to an apartment
        </p>
      </div>
    );
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    console.log('Creating event with:', { title, description, date, apartment: apartmentId });
    try {
      const result = await createEvent({ title, description, date, apartment: apartmentId });
      console.log('Event created successfully:', result);
      setTitle(""); setDescription(""); setDate("");
      fetchEvents();
    } catch (err) {
      console.error('Error creating event:', err);
      alert("Failed to create event");
    }
  };

  const handleRSVP = async (id) => {
    try {
      const updatedEvent = await rsvpEvent(id);
      setEvents(events.map(ev => ev._id === id ? updatedEvent : ev));
    } catch (err) {
      console.error('RSVP error:', err);
      alert(err.response?.data?.error || 'Failed to RSVP');
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
      className="max-w-6xl mx-auto px-6 py-8 bg-gradient-to-br from-purple-50/30 to-pink-50/30 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20"
    >
      <div className="flex justify-between items-center mb-8">
        <motion.h2 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3"
        >
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg text-white"
          >
            <FiCalendar size={24} />
          </motion.div>
          Community Events
        </motion.h2>
        <motion.p 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500"
        >
          {events.length} upcoming {events.length === 1 ? 'event' : 'events'}
        </motion.p>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New Event</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              placeholder="Event title" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              placeholder="Event description" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition min-h-[100px]"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
            <input 
              type="datetime-local" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required 
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <FiPlus />
            Create Event
          </motion.button>
        </form>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="space-y-6"
      >
        {events.length === 0 ? 
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="bg-blue-100 p-6 rounded-full mb-6">
              <FiCalendar className="text-blue-500 text-4xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No upcoming events</h3>
            <p className="text-gray-500 mb-6">
              There are currently no scheduled events in your community.
            </p>
            <motion.button
              onClick={fetchEvents}
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(168, 85, 247, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2 relative overflow-hidden group"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
              <span className="relative z-10 flex items-center gap-2">
                <FiRefreshCw className="animate-spin-slow" />
                Refresh Events
              </span>
            </motion.button>
          </motion.div> :
          events.map((ev, index) => (
            <motion.div
              key={ev._id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <EventCard event={ev} currentUser={currentUser} onRSVP={handleRSVP} />
            </motion.div>
          ))
        }
      </motion.div>
    </motion.div>
  );
}