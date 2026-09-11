import { Router } from "express";

import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  updateAppointmentPayment,
  cancelAppointment,
} from "../controllers/appointment.controller";

import protect from "../middleware/auth.middleware";
import adminOnly from "../middleware/adminOnly";

const router = Router();

// ======================================================
// PUBLIC
// ======================================================

router.post(
  "/",
  createAppointment
);

// ======================================================
// ADMIN
// ======================================================

router.get(
  "/",
  protect,
  adminOnly,
  getAllAppointments
);

router.get(
  "/:id",
  protect,
  adminOnly,
  getAppointmentById
);

router.patch(
  "/:id",
  protect,
  adminOnly,
  updateAppointmentStatus
);

router.patch(
  "/:id/payment",
  protect,
  adminOnly,
  updateAppointmentPayment
);

router.patch(
  "/:id/cancel",
  protect,
  adminOnly,
  cancelAppointment
);

export default router;