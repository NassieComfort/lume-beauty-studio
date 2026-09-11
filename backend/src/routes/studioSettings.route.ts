import { Router } from "express";

import {
  getStudioSettings,
  updateStudioSettings,
} from "../controllers/studioSettings.controller";

import protect from "../middleware/auth.middleware";
import adminOnly from "../middleware/adminOnly";

const router = Router();

router.use(
  protect,
  adminOnly
);

router.get(
  "/",
  getStudioSettings
);

router.put(
  "/",
  updateStudioSettings
);

export default router;