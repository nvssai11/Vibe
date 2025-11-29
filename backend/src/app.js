import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/admin.routes.js";
import resourceRoutes from "./routes/resource.routes.js";
import eventRoutes from "./routes/event.routes.js";
import userRoutes from "./routes/userRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => res.send({ ok: true, message: "Community API" }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);

export default app;