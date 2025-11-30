import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Contexts
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";

// Dashboard Pages
import Home from "./pages/Dashboard/Home";
import PeopleNearby from "./pages/Dashboard/PeopleNearby";
import Resources from "./pages/Dashboard/Resources";
import Events from "./pages/Dashboard/Events";
import Profile from "./pages/Dashboard/Profile";
import Messages from "./pages/Dashboard/Messages";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ApproveUsers from "./pages/Admin/ApproveUsers";
import ApproveResources from "./pages/Admin/ApproveResources";
import ApproveEvents from "./pages/Admin/ApproveEvents";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>

          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Dashboard Routes (Protected) */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
<Route path="/dashboard/people-nearby" element={<ProtectedRoute><PeopleNearby /></ProtectedRoute>} />
<Route path="dashboard/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
<Route path="/dashboard/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
<Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
<Route path="/dashboard/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

            {/* Admin Routes (Protected + Admin Only) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/approve-users"
              element={
                <ProtectedRoute adminOnly={true}>
                  <ApproveUsers />  
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/approve-resources"
              element={
                <ProtectedRoute adminOnly={true}>
                  <ApproveResources />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/approve-events"
              element={
                <ProtectedRoute adminOnly={true}>
                  <ApproveEvents />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;