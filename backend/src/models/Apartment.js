import mongoose from "mongoose";

const { Schema } = mongoose;

const apartmentSchema = new Schema({
  name: { type: String, required: true },
  address: String,
  pincode: String,
  geo: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
  },
  admins: [{ type: Schema.Types.ObjectId, ref: "User" }], // users who are admins
  createdAt: { type: Date, default: Date.now }
});

apartmentSchema.index({ geo: "2dsphere" });

export default mongoose.model("Apartment", apartmentSchema);
