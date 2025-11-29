import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {  // hashed password
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["apartment_admin", "super_admin"],
    default: "apartment_admin"
  },
  apartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Apartment", // optional: link to apartment collection
    required: function() {
      return this.role === "apartment_admin";
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hide password when sending response
adminSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
