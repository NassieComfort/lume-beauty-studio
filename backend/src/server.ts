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
import adminRoutes from "./routes/admin.route";

import errorMiddleware from "./middleware/error.middleware";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Initialize Database Connection
connectDB();

/*
|--------------------------------------------------------------------------
| CORS & SECURITY MIDDLEWARE
|--------------------------------------------------------------------------
*/
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

/*
|--------------------------------------------------------------------------
| BODY PARSERS & STATIC FILES
|--------------------------------------------------------------------------
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(process.cwd(), "images")));

/*
|--------------------------------------------------------------------------
| API ENDPOINTS
|--------------------------------------------------------------------------
*/
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/blocked-slots", blockedSlotRoutes);

// Admin Restricted Area
app.use("/api/admin", adminRoutes);

/*
|--------------------------------------------------------------------------
| ROOT & FALLBACK HANDLERS
|--------------------------------------------------------------------------
*/
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Lume Beauty Studio API is running smoothly!",
  });
});

// 404 Route Not Found Handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Centralized Error Handler
app.use(errorMiddleware);

/*
|--------------------------------------------------------------------------
| START HTTP SERVER
|--------------------------------------------------------------------------
*/
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Lume Beauty Studio API running on port ${PORT}`);
});