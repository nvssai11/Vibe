// frontend/src/api/event.api.js
import axiosClient from "./axiosClient";

// Fetch all events in an apartment
export const getEvents = async (apartmentId) => {
  const res = await axiosClient.get(`/events/${apartmentId}`);
  return res.data;
};

// Create new event (admin only)
export const createEvent = async (data) => {
  const res = await axiosClient.post("/events", data);
  return res.data;
};

// RSVP to an event
export const rsvpEvent = async (id) => {
  const res = await axiosClient.patch(`/events/${id}/rsvp`);
  return res.data;
};
