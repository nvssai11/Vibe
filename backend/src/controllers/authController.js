import User from "../models/User.js";
import Apartment from "../models/Apartment.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * POST /api/auth/register
 * body: { name, email, password, apartmentId, flatNumber, location: { coordinates: [lng, lat] } }
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, apartmentId, flatNumber, location } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hash,
      apartment: apartmentId || null,
      flatNumber: flatNumber || null,
      location: location || undefined,
      status: apartmentId ? "pending" : "approved" // If apartment selected -> pending approval, else approved
    });

    await user.save();

    // If apartmentId provided, notify admins (out of scope for now) — return pending message
    if (apartmentId) {
      return res.status(201).json({ message: "Registered, pending apartment admin approval", userId: user._id });
    }

    // Otherwise issue token for approved user
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/auth/login
 * body: { email, password }
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing email/password" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    if (user.status !== "approved") {
      return res.status(403).json({ error: "Account not approved by apartment admin" });
    }

    const token = jwt.sign({ id: user._id, role: user.role, apartment: user.apartment }, process.env.JWT_SECRET);
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, apartment: user.apartment }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/auth/me
 * headers: Authorization: Bearer <token>
 */
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password").populate("apartment", "name address");
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      apartment: user.apartment,
      status: user.status
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};