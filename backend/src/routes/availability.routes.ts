import { Router } from "express";
import {
  getPublicAvailability,
} from "../controllers/availability.controller";

const router = Router();

// Public get availability/booked slots for a date and service
router.get("/slots", getPublicAvailability);

export default router;