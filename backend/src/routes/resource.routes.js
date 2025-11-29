import express from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import {
  addResource,
  getResources,
  requestResource,
  approveResource,
  declineResource,
  returnResource
} from "../controllers/resourceController.js";

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Resource collection routes
router.post("/", addResource);
router.get("/", getResources);

// Resource instance routes
router.patch("/:id/request", requestResource);
router.patch("/:id/approve", approveResource);
router.patch("/:id/decline", declineResource);
router.patch("/:id/return", returnResource);

export default router;