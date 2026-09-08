import { Router } from "express";

import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  updateAppointmentPayment,
  cancelAppointment,
} from "../controllers/appointment.controller";

const router = Router();

// Public booking
router.post("/", createAppointment);

// Appointment management
router.get("/", getAllAppointments);
router.get("/:id", getAppointmentById);

router.patch(
  "/:id",
  updateAppointmentStatus
);

router.patch(
  "/:id/payment",
  updateAppointmentPayment
);

router.patch(
  "/:id/cancel",
  cancelAppointment
);

export default router;