import { Router } from "express";
import protect from "../middleware/auth.middleware";
import adminOnly from "../middleware/adminOnly";

import {
  getAvailability,
  updateAvailability,
} from "../controllers/availability.controller";

const router = Router();

// Admin authentication
router.use(protect);
router.use(adminOnly);

// GET studio working hours
router.get("/", getAvailability);

// UPDATE studio working hours
router.put("/", updateAvailability);

export default router;