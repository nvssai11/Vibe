import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: String,
  role: { type: String, enum: ["resident", "apartment_admin", "super_admin"], default: "resident" },
  apartment: { type: Schema.Types.ObjectId, ref: "Apartment", default: null },
  flatNumber: String,
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
  },
  createdAt: { type: Date, default: Date.now }
});

userSchema.index({ location: "2dsphere" });

export default mongoose.model("User", userSchema);
