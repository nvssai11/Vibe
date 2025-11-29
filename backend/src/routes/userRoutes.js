import express from "express";
const router = express.Router();
import { registerUser, loginUser, getProfile, updateProfile, approveUser, getNearbyUsers } from "../controllers/UserController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/approve-user", protect, adminOnly, approveUser);
router.get("/nearby", protect, getNearbyUsers);


export default router;