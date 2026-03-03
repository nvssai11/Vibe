import mongoose from "mongoose";

const { Schema } = mongoose;

const eventSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  apartment: { type: Schema.Types.ObjectId, ref: "Apartment", required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  createdAt: { type: Date, default: Date.now }
});

eventSchema.index({ location: "2dsphere" });

export default mongoose.model("Event", eventSchema);