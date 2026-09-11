import { Router } from "express";

import {
  getRevenue,
} from "../controllers/revenue.controller";

import protect from "../middleware/auth.middleware";
import adminOnly from "../middleware/adminOnly";

const router = Router();

router.get(
  "/",
  protect,
  adminOnly,
  getRevenue
);

export default router;