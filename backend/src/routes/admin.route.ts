import { Router } from "express";
import protect from "../middleware/auth.middleware";
import adminOnly from "../middleware/adminOnly";
import {
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  updateAppointmentPayment,
} from "../controllers/appointment.controller";

const router = Router();

/*
|--------------------------------------------------------------------------
| ADMIN AUTHENTICATION GUARD
|--------------------------------------------------------------------------
*/
router.use(protect);
router.use(adminOnly);

/*
|--------------------------------------------------------------------------
| ADMIN APPOINTMENT MANAGEMENT
|--------------------------------------------------------------------------
*/

// Get all appointments
router.get("/appointments", getAllAppointments);

// Get single appointment details
router.get("/appointments/:id", getAppointmentById);

// Update appointment status (e.g. pending, completed)
router.patch("/appointments/:id/status", updateAppointmentStatus);

// Update payment status (e.g. deposit paid, fully paid)
router.patch("/appointments/:id/payment", updateAppointmentPayment);

// Cancel appointment
router.patch("/appointments/:id/cancel", cancelAppointment);

export default router;