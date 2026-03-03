import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getNotifications);
router.route("/:notificationId/read").patch(protect, markAsRead);
router.route("/mark-all-read").patch(protect, markAllAsRead);

export default router;