import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import connectDB from "./config/db";

import authRoutes from "./routes/auth.route";
import serviceRoutes from "./routes/service.route";
import appointmentRoutes from "./routes/appointment";
import availabilityRoutes from "./routes/availability.routes";
import blockedSlotRoutes from "./routes/blockedSlot.route";
import healthRoutes from "./routes/health";

import errorMiddleware from "./middleware/error.middleware";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/images", express.static(path.join(process.cwd(), "images")));

/*
  API routes
*/
app.use("/api/health", healthRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/services", serviceRoutes);

app.use("/api/appointments", appointmentRoutes);

app.use("/api/availability", availabilityRoutes);

app.use("/api/blocked-slots", blockedSlotRoutes);

/*
  Root route
*/

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Lume Beauty Studio API is running smoothly!",
  });
});

/*
  404 handler
*/

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/*
  Global error handler
*/

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(
    `Lume Beauty Studio API running on http://localhost:${PORT}`
  );
});