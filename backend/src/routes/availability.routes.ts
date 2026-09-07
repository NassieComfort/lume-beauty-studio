import { Router } from "express";
import {
  getAvailability,
  createOrUpdateAvailability,
} from "../controllers/availability.controller";

import protect from "../middleware/auth.middleware";
import adminOnly from "../middleware/adminOnly";

const router = Router();

/*
|--------------------------------------------------------------------------
| Availability Routes
|--------------------------------------------------------------------------
*/

// Public: Fetch available studio slots for booking
router.get("/", getAvailability);

// Admin: Configure base weekly working hours or date rules
router.put(
  "/",
  protect,
  adminOnly,
  createOrUpdateAvailability
);

export default router;