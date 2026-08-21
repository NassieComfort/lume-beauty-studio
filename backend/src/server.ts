import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import healthRoutes from "./routes/health";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/health", healthRoutes);
// Future routes go here, e.g.:
// app.use("/api/auth", authRoutes);
// app.use("/api/appointments", appointmentRoutes);
// app.use("/api/services", serviceRoutes);

// Fallback 404
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start();
