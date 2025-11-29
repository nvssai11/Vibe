import express from "express";
import { createApartment, listPendingUsers, approveUser, getApartmentAdmin, listApartments } from "../controllers/adminController.js";
import { requireAuth, adminOnlyForApartment } from "../middlewares/authMiddleware.js";

const router = express.Router();

// list all apartments (public endpoint)
router.get('/apartments', listApartments);

// create apartment (super_admin or any authenticated can create; for production lock to super_admin)
router.post("/create-apartment", requireAuth, createApartment);

// get apartment admin info
router.get("/apartment-admin/:apartmentId", requireAuth, getApartmentAdmin);

// list pending users for apartment (admin only)
router.get("/pending-users/:apartmentId", requireAuth, adminOnlyForApartment("apartmentId"), listPendingUsers);

// approve or reject user (admin only)
router.post("/approve-user", requireAuth, adminOnlyForApartment("apartmentId"), approveUser);

export default router;