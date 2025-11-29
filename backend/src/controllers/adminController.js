import User from "../models/User.js";
import Apartment from "../models/Apartment.js";

/**
 * GET /api/admin/pending-users/:apartmentId
 * only apartment admins can call
 */
export const listPendingUsers = async (req, res) => {
  try {
    const { apartmentId } = req.params;
    const users = await User.find({ apartment: apartmentId, status: "pending" }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/admin/approve-user
 * body: { userId, approve: true|false }
 */
export const approveUser = async (req, res) => {
  try {
    const { userId, approve } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.status = approve ? "approved" : "rejected";
    if (approve) user.role = user.role || "resident";
    await user.save();

    // Optionally: send notification / email (omitted)
    res.json({ message: `User ${approve ? "approved" : "rejected"}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/admin/create-apartment
 * body: { name, address, pincode, geo: { coordinates: [lng, lat] }, adminUserId }
 * Creates apartment and assigns admin role to the provided user
 */
/**
 * GET /api/admin/apartment-admin/:apartmentId
 * Returns the admin user for the specified apartment
 */
export const getApartmentAdmin = async (req, res) => {
  try {
    const { apartmentId } = req.params;
    const admin = await User.findOne({ 
      apartment: apartmentId, 
      role: "apartment_admin",
      status: "approved"
    }).select("_id apartment");
    
    if (!admin) return res.status(404).json({ error: "No admin found for this apartment" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listApartments = async (req, res) => {
  try {
    const apartments = await Apartment.find().select("name address pincode");
    res.json(apartments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createApartment = async (req, res) => {
  try {
    const { name, address, pincode, geo, adminUserId } = req.body;
    const apt = await Apartment.create({ name, address, pincode, geo, admins: [adminUserId] });

    if (adminUserId) {
      await User.findByIdAndUpdate(adminUserId, { apartment: apt._id, role: "apartment_admin", status: "approved" });
    }
    res.status(201).json(apt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};