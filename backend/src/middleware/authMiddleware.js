import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  return verifyToken(req, res, next);
};

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const checkUserExists = async (req, res, next) => {
  try {
    const { recipientId } = req.body;
    const recipient = await User.findById(recipientId);
    
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};