import Event from "../models/Event.js";

/**
 * Create event
 * POST /api/events
 * body: { title, description, date, apartment }
 */
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, apartment } = req.body;
    if (!title || !date) return res.status(400).json({ error: "Title and date required" });

    const event = await Event.create({
      title,
      description,
      date,
      apartment,
      createdBy: req.userId
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * List events in apartment
 * GET /api/events/:apartmentId
 */
export const listEvents = async (req, res) => {
  try {
    const { apartmentId } = req.params;
    const events = await Event.find({ apartment: apartmentId })
      .populate("createdBy", "name email")
      .populate("participants", "name email");
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * RSVP event
 * PATCH /api/events/:id/rsvp
 */
export const rsvpEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (event.participants.includes(req.userId)) {
      return res.status(400).json({ error: "Already RSVPed" });
    }
    event.participants.push(req.userId);
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};