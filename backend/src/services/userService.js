import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register new user
export const registerUser = async (data) => {
  const { name, email, password, apartmentId, flatNumber, location, role } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    apartment: apartmentId || null,
    flatNumber,
    location,
    role: role || "resident",
    status: "pending",
  });

  await user.save();
  return user;
};

// Login user
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user._id, role: user.role, apartment: user.apartment },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
};

// Approve user (admin action)
export const approveUser = async (userId, approve) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.status = approve ? "approved" : "rejected";
  await user.save();

  return user;
};
