// frontend/src/api/admin.api.js
import axiosClient from "./axiosClient";

// Users
export const getPendingUsers = async (apartmentId) => {
  const res = await axiosClient.get(`/admin/pending-users/${apartmentId}`);
  return res.data;
};

export const approveUser = async (id, apartmentId) => {
  const res = await axiosClient.post(`/admin/approve-user`, { 
    userId: id, 
    approve: true,
    apartmentId 
  });
  return res.data;
};

// Resources
export const getPendingResources = async () => {
  const res = await axiosClient.get("/admin/resources/pending");
  return res.data;
};

export const approveResource = async (id) => {
  const res = await axiosClient.patch(`/admin/resources/${id}/approve`);
  return res.data;
};

// Events
export const getPendingEvents = async () => {
  const res = await axiosClient.get("/admin/events/pending");
  return res.data;
};

export const approveEvent = async (id) => {
  const res = await axiosClient.patch(`/admin/events/${id}/approve`);
  return res.data;
};