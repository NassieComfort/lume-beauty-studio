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
| Blocked Slot Routes
|--------------------------------------------------------------------------
*/

router.get("/", getBlockedSlots);

router.post(
  "/",
  protect,
  adminOnly,
  createBlockedSlot
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteBlockedSlot
);

export default router;