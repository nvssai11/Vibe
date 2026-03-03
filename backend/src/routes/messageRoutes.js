import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  sendMessage,
  getMessages,
  getConversations,
  markMessageAsRead
} from "../controllers/messageController.js";

const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/conversations").get(protect, getConversations);
router.route("/:userId").get(protect, getMessages);
router.route("/:messageId/read").patch(protect, markMessageAsRead);

export default router;