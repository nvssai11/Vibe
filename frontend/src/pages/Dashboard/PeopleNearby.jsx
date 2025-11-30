// frontend/src/pages/Dashboard/PeopleNearby.jsx
import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { getNearbyUsers } from "../../api/user.api";
import UserCard from "../../components/UserCard";
import { FiUsers, FiRefreshCw, FiMapPin,FiMap, FiList, FiMessageSquare } from "react-icons/fi";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


import "./PeopleNearby.css";

// Fix default icon paths for Leaflet markers
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Override default icon options
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Helper component to fit map to all markers
// Sidebar for user list
// function UserSidebar({ users, onUserClick }) {
//   return (
//     <div className="sidebar">
//       <h3>Nearby People</h3>
//       <ul>
//         {users.map((user, idx) => (
//           <li key={user._id || idx} onClick={() => onUserClick(user)}>
//             <img src={user.avatar || "https://ui-avatars.com/api/?name=" + user.name} alt={user.name} className="avatar" />
//             <span>{user.name}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// FitBounds helper
function FitBounds({ markers }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, map]);
  return null;
}

export default function PeopleNearby() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [radius, setRadius] = useState(2000); // Default 2km radius
 
  const [view, setView] = useState("list");
  const [coords, setCoords] = useState(null);

  const fetchNearby = useCallback(async () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        console.log("[PeopleNearby] Geolocation:", latitude, longitude);
        try {
          const res = await getNearbyUsers({ lat: latitude, lng: longitude, radius });
          console.log("[PeopleNearby] getNearbyUsers result:", res);
          setUsers(Array.isArray(res) ? res : res.users || []);
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
  }, [radius]);

  useEffect(() => {
    fetchNearby();
  }, [fetchNearby]);

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
      className="max-w-6xl mx-auto px-4 sm:px-6 py-8 bg-white rounded-xl shadow-sm border border-gray-200"
    >
      <div className="flex flex-col items-center mb-8 gap-6">
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
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
          <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <label htmlFor="radius" className="text-gray-600 font-medium">Radius:</label>
            <select 
              id="radius" 
              value={radius} 
              onChange={e => {
                const newRadius = Number(e.target.value);
                setRadius(newRadius);
                fetchNearby();
              }} 
              className="rounded-lg p-2 border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={500}>500m</option>
              <option value={1000}>1km</option>
              <option value={2000}>2km</option>
              <option value={5000}>5km</option>
            </select>
            <div className="flex items-center gap-2 text-gray-600">
              <FiMapPin className="text-blue-500" />
              <span>Within {radius/1000}km</span>
            </div>
          </div>
        </div>
          
          <button 
            onClick={() => setView(view === "list" ? "map" : "list")} 
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-600 transition-all flex items-center justify-center gap-2"
          >
            {view === "list" ? (
              <>
                <FiMap size={18} /> Map View
              </>
            ) : (
              <>
                <FiList size={18} /> List View
              </>
            )}
          </button>
          <Link 
            to="/dashboard/messages" 
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-lg shadow-sm hover:from-green-700 hover:to-teal-600 transition-all flex items-center justify-center gap-2"
          >
            <FiMessageSquare size={18} /> Messages
          </Link>
        </div>

      
      

      {view === "map" && coords && (
        <MapContainer
          center={[coords.lat, coords.lng]}
          zoom={15}
          style={{ height: "500px", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {/* Fit map to all markers */}
          <FitBounds
            markers={[
              { lat: coords.lat, lng: coords.lng },
              ...users.map((u) => ({
                lat: u.location?.coordinates[1],
                lng: u.location?.coordinates[0],
              })),
            ]}
          />
          {/* Current user marker (highlighted) */}
          <Marker
            position={[coords.lat, coords.lng]}
            icon={new L.Icon({
              iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
              shadowUrl: markerShadow,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41],
            })}
          >
            <Popup>You are here</Popup>
          </Marker>
          {/* Other users markers (highlighted blue) */}
          {users.map((user) => (
            <Marker
              key={user._id || user.id}
              position={[user.location?.coordinates[1], user.location?.coordinates[0]]}
              icon={new L.Icon({
                iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
                shadowUrl: markerShadow,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
              })}
            >
              <Popup>
                <div className="text-center">
                  <strong>{user.name}</strong>
                  <p className="text-sm text-gray-600">
                    {user.apartmentName ? `${user.apartmentName} - Flat #${user.flatNumber}` : `Flat #${user.flatNumber}`}
                  </p>
                  <Link 
            to={`/dashboard/messages?new=${user._id}&name=${encodeURIComponent(user.name)}`}
            className="mt-2 inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors text-sm"
          >
            Start Chat
          </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
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