// frontend/src/components/DashboardLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main content */}
      <div className="p-6">

        {/* Page content */}
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}