import Event from "../models/Event.js";

/**
 * Create event
 * POST /api/events
 * body: { title, description, date, apartment }
 */
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, apartment, location } = req.body;
    if (!title || !date) return res.status(400).json({ error: "Title and date required" });
    if (!location || !location.type || !location.coordinates) {
      return res.status(400).json({ error: "Location with type and coordinates is required" });
    }
    const event = await Event.create({
      title,
      description,
      date,
      apartment,
      location,
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
      .populate("participants", "name email"); // Ensure 'participants' is used consistently
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rsvpEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (event.participants.includes(req.userId)) { // Check 'participants' array
      return res.status(400).json({ error: "Already RSVPed" });
    }
    event.participants.push(req.userId); // Add to 'participants' array
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Fetch nearby events
 * GET /api/events/nearby
 * query: { lat, lng, radius, startDate, endDate }
 */
export const getNearbyEvents = async (req, res) => {
  try {
    const { lat, lng, radius = 2000, startDate, endDate } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude and longitude are required." });
    }

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const events = await Event.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius)
        }
      },
      ...(startDate || endDate ? { date: dateFilter } : {})
    });

    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};