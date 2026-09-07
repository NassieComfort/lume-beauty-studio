import { Router } from "express";
import {
  createAppointment,
  getAppointmentById,
  cancelAppointment,
} from "../controllers/appointment.controller";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public & Guest Booking Routes
|--------------------------------------------------------------------------
*/

// Create a new booking
router.post("/", createAppointment);

// Fetch a single appointment details (e.g. guest confirmation screen)
router.get("/:id", getAppointmentById);

// Public/Client-initiated cancellation (using booking reference or ID)
router.patch("/:id/cancel", cancelAppointment);

export default router;