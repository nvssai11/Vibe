import jwt from "jsonwebtoken";
import User from "../models/User.js";

// General auth middleware
export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "No token" });
    const token = header.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    req.userRole = payload.role;
    // optionally load user
    req.user = await User.findById(req.userId).select("-password");
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

// Admin-only for a specific apartment
export const adminOnlyForApartment = (paramField = "apartmentId") => {
  return async (req, res, next) => {
    try {
      console.log('Checking apartmentId in middleware:', { 
        params: req.params, 
        body: req.body,
        headers: req.headers
      });
      const apartmentId = req.params[paramField] || req.body[paramField];
      if (!apartmentId) return res.status(400).json({ error: "apartmentId required" });

      const user = req.user;
      if (!user) return res.status(401).json({ error: "No user loaded" });

      // super_admin bypass
      if (user.role === "super_admin") return next();

      // user must be apartment admin and belong to same apartment
      const userApartmentId = user.apartment?._id || user.apartment;
      if (user.role === "apartment_admin" && String(userApartmentId) === String(apartmentId)) {
        return next();
      }
      return res.status(403).json({ error: "Admin rights required for this apartment" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };
};

// Simple protect middleware (like before)
export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Admin-only middleware
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "apartment_admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};