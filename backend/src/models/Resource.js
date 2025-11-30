import mongoose from "mongoose";

const { Schema } = mongoose;

const resourceSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["tools", "appliances", "furniture", "books", "other"],
    set: (value) => value.toLowerCase() // Normalize input to lowercase
  },
  title: { type: String, required: true },
  description: String,
  category: { 
    type: String, 
    enum: ["tools", "appliances", "furniture", "books", "other"],
    required: true
  },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  apartment: { type: Schema.Types.ObjectId, ref: "Apartment", required: true, index: true },
  status: { 
    type: String, 
    enum: ["available", "requested", "borrowed", "returned", "declined"], 
    default: "available" 
  },
 borrower: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null

},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now  } 
}

);


resourceSchema.index({ apartment: 1, owner: 1 });

export default mongoose.model("Resource", resourceSchema);