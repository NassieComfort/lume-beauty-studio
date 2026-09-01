import { Router } from "express";

import {
  getBlockedSlots,
  createBlockedSlot,
  deleteBlockedSlot,
} from "../controllers/blockedSlot.controller";

import protect from "../middleware/auth.middleware";
import adminOnly from "../middleware/role.middleware";

const router = Router();

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