// src/services/eventService.js
import Event from "../models/Event.js";

// Create a new event
export const createEvent = async ({ title, description, date, apartmentId, createdBy }) => {
  const event = new Event({
    title,
    description,
    date,
    apartment: apartmentId,
    createdBy,
    attendees: []
  });
  await event.save();
  return event;
};

// RSVP to an event
export const rsvpEvent = async ({ eventId, userId }) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  if (!event.attendees.includes(userId)) {
    event.attendees.push(userId);
    await event.save();
  }

  return event;
};

// Cancel RSVP
export const cancelRsvp = async ({ eventId, userId }) => {
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  event.attendees = event.attendees.filter((id) => String(id) !== String(userId));
  await event.save();
  return event;
};

// Get all events for an apartment
export const getApartmentEvents = async (apartmentId) => {
  return await Event.find({ apartment: apartmentId });
};
