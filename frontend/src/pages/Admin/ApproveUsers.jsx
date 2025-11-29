// frontend/src/pages/Admin/ApproveUsers.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { getPendingUsers, approveUser } from "../../api/admin.api";

function ApproveUsers() {
  const [users, setUsers] = useState([]);
  const { currentUser } = useAuth();

  const fetchUsers = async () => {
    try {
      if (!currentUser?.apartment) {
        console.log("No apartment assigned to current user");
        return;
      }
      const res = await getPendingUsers(currentUser.apartment._id || currentUser.apartment);
      setUsers(res);
    } catch (error) {
      console.error("Error fetching pending users:", error);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered, currentUser:", currentUser);
    fetchUsers();
  }, [currentUser?.apartment]);

  const handleApprove = async (id) => {
    try {
      if (!currentUser?.apartment) {
        throw new Error('No apartment assigned to current user');
      }
      const apartmentId = currentUser.apartment._id || currentUser.apartment;
      console.log('Approving user with:', { 
        userId: id, 
        apartmentId,
        currentUser: currentUser
      });
      await approveUser(id, apartmentId);
      setUsers(users.filter(user => user._id !== id));
      toast.success('User approved successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Failed to approve user');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white/20 backdrop-blur-lg rounded-xl shadow-lg border border-white/10 transition-all duration-300 hover:shadow-xl">
      <div className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl shadow-md animate-gradient-x">
          <h1 className="text-3xl font-bold text-white drop-shadow-md">User Approvals</h1>
          <p className="text-white/90 mt-2">Review and approve pending user registrations</p>
        <p className="text-gray-600 mt-2">Review and approve new community members</p>
      </div>
      <div className="text-sm text-gray-500 mb-6">
        {users.length} {users.length === 1 ? 'user' : 'users'} pending
      </div>
      
      {users.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No pending approvals</h3>
          <p className="mt-1 text-gray-500">All users have been approved</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users.map(u => (
            <div key={u._id} className="flex flex-col p-6 bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-blue-100">
              <div>
                <p className="font-semibold text-gray-800">{u.name}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
              <button
                onClick={() => handleApprove(u._id)}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ApproveUsers;