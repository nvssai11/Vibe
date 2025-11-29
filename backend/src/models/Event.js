import mongoose from "mongoose";

const { Schema } = mongoose;

const eventSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  apartment: { type: Schema.Types.ObjectId, ref: "Apartment", required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Event", eventSchema);