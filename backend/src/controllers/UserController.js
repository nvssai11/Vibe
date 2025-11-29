// controllers/UserController.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, apartmentId, flatNumber, location } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      apartment: apartmentId,
      flatNumber,
      location,
      role: "resident", // default role
      approved: false
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user/admin
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, apartment: user.apartment },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("apartment", "name address");
    
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      apartment: user.apartment,
      flatNumber: user.flatNumber,
      status: user.status,
      location: user.location
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, flatNumber, location } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (flatNumber) user.flatNumber = flatNumber;
    if (location) user.location = location;

    await user.save();
    res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Approve a user (admin only)
export const approveUser = async (req, res) => {
  try {
    const { userId, approve } = req.body;

    // Only admins can approve
    if (req.user.role !== "apartment_admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.approved = approve;
    await user.save();

    res.status(200).json({ message: `User ${approve ? "approved" : "rejected"}`, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/users/nearby?lng=...&lat=...&radius=...
 * Returns users within a radius of the provided coordinates
 */
export const getNearbyUsers = async (req, res) => {
  try {
    const { lng, lat, radius } = req.query;

    if (!lng || !lat) return res.status(400).json({ error: "Longitude and latitude are required" });

    const users = await User.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: radius ? parseInt(radius) : 1000 // default 1 km
        }
      },
      status: "approved" // only show approved users
    })
    .select("-password") // hide passwords
    .populate({
      path: 'apartment',
      select: 'name'
    });

    res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};