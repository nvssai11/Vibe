/**
 * Usage: npm run seed
 */
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Apartment from "../models/Apartment.js";
import bcrypt from "bcrypt";

const run = async () => {
  try {
    await connectDB();

    // create admin user
    const email = "admin@sampleapt.com";
    let admin = await User.findOne({ email });
    if (!admin) {
      const hash = await bcrypt.hash("adminpass", 10);
      admin = await User.create({
        name: "Sample Admin",
        email,
        password: hash,
        role: "apartment_admin",
        status: "approved"
      });
      console.log("Admin user created:", admin.email);
    } else {
      console.log("Admin exists:", admin.email);
    }

    // create apartment
    let apt = await Apartment.findOne({ name: "Sample Apartments" });
    if (!apt) {
      apt = await Apartment.create({
        name: "Sample Apartments",
        address: "123 Sample St",
        pincode: "500001",
        geo: { type: "Point", coordinates: [78.5, 17.4] },
        admins: [admin._id]
      });
      console.log("Apartment created:", apt.name);
    } else {
      console.log("Apartment exists:", apt.name);
    }

    // attach admin to apartment
    admin.apartment = apt._id;
    await admin.save();

    console.log("Seed complete.");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

run();
