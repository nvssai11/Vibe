import express from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { createEvent, listEvents, rsvpEvent } from "../controllers/eventController.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", createEvent);
router.get("/:apartmentId", listEvents);
router.patch("/:id/rsvp", rsvpEvent);

export default router;
