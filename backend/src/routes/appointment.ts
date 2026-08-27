import { Router } from "express";

import {
  getAppointments,
  getAppointment,
  getAvailableSlots,
  createAppointment,
  updateAppointmentStatus,
  updatePaymentStatus,
  cancelAppointment,
} from "../controllers/appointment.controller";

import protect from "../middleware/auth.middleware";
import adminOnly from "../middleware/role.middleware";

const router = Router();

/*
  Public booking routes
*/

router.get("/available-slots", getAvailableSlots);

router.post("/", createAppointment);

/*
  Authenticated routes
*/

router.get(
  "/",
  protect,
  getAppointments
);

router.get(
  "/:id",
  protect,
  getAppointment
);

router.patch(
  "/:id/cancel",
  protect,
  cancelAppointment
);

/*
  Admin routes
*/

router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateAppointmentStatus
);

router.patch(
  "/:id/payment",
  protect,
  adminOnly,
  updatePaymentStatus
);

export default router;