import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import Event from "../src/models/Event.js";

(async () => {
  try {
    await connectDB();
    
    // Find all events with participants
    const events = await Event.find({ participants: { $exists: true, $not: { $size: 0 } } });
    
    if (events.length === 0) {
      console.log("No events with participant data found");
      process.exit(0);
    }
    
    console.log(`Found ${events.length} events with participant data to migrate`);
    
    // Migrate participants to attendees
    for (const event of events) {
      if (!event.attendees || event.attendees.length === 0) {
        event.attendees = [];
      }
      
      // Add participants to attendees if not already present
      const participants = Array.isArray(event.participants) ? event.participants : [];
for (const participant of participants) {
        if (!event.attendees.includes(participant)) {
          event.attendees.push(participant);
        }
      }
      
      await event.save();
      console.log(`Migrated ${event.participants.length} participants for event ${event._id}`);
    }
    
    console.log("Migration completed successfully");
    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
})();