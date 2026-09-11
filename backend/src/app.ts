import express, { Application, Request, Response } from "express";
import cors from "cors";

console.log("Registering studio-settings route...");

// Import Routes
import authRoutes from "./routes/auth.route";
import adminRoutes from "./routes/admin.route";
import appointmentRoutes from "./routes/appointment";
import availabilityRoutes from "./routes/availability.routes";
import blockedSlotRoutes from "./routes/blockedSlot.route";
import serviceRoutes from "./routes/service.route";
import healthRoutes from "./routes/health";
import studioSettingsRouter from "./routes/studioSettings.route";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Endpoints
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/blocked-slots", blockedSlotRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/studio-settings", studioSettingsRouter);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: any) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ success: false, message });
});

export default app;