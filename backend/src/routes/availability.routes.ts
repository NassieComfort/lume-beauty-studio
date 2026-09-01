import { Router } from "express";

import {
  getAvailability,
  createOrUpdateAvailability,
} from "../controllers/availability.controller";

import protect from "../middleware/auth.middleware";
import adminOnly from "../middleware/role.middleware";

const router = Router();

router.get("/", getAvailability);

router.put(
  "/",
  protect,
  adminOnly,
  createOrUpdateAvailability
);

export default router;