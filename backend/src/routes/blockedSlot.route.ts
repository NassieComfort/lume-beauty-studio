import { Router } from "express";

import {
  getBlockedSlots,
  createBlockedSlot,
  deleteBlockedSlot,
} from "../controllers/blockedSlot.controller";

import protect from "../middleware/auth.middleware";
import adminOnly from "../middleware/adminOnly";

const router = Router();

/*
|--------------------------------------------------------------------------
| Blocked Slots Routes
|--------------------------------------------------------------------------
*/

// Public/Client: Get blocked time slots (to prevent double bookings)
router.get("/", getBlockedSlots);

// Admin: Block specific time ranges (maintenance, breaks, time off)
router.post("/", protect, adminOnly, createBlockedSlot);

// Admin: Unblock / remove a time block
router.delete("/:id", protect, adminOnly, deleteBlockedSlot);

export default router;