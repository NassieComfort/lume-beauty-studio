import { Router } from "express";

import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
} from "../controllers/appointment.controller";

const router = Router();

// =========================
// APPOINTMENTS
// =========================

// Create appointment
router.post("/", createAppointment);

// Get all appointments
router.get("/", getAllAppointments);

// Get appointment by ID
router.get("/:id", getAppointmentById);

// Update appointment status
router.patch(
  "/:id",
  updateAppointmentStatus
);

// Cancel appointment
router.patch(
  "/:id/cancel",
  cancelAppointment
);

export default router;