import { Router } from "express";

import {
  getAvailability,
  createAvailability,
  updateAvailability,
  deleteAvailability,
} from "../controllers/availability.controller";

import protect from "../middleware/auth.middleware";
import adminOnly from "../middleware/role.middleware";

const router = Router();

router.get("/", getAvailability);

router.post(
  "/",
  protect,
  adminOnly,
  createAvailability
);

router.patch(
  "/:id",
  protect,
  adminOnly,
  updateAvailability
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteAvailability
);

export default router;