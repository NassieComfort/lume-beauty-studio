import { Router } from "express";

import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} from "../controllers/service.controller";

import protect from "../middleware/auth.middleware";
import adminOnly from "../middleware/role.middleware";

const router = Router();

router.get("/", getServices);
router.get("/:id", getService);

router.post(
  "/",
  protect,
  adminOnly,
  createService
);

router.patch(
  "/:id",
  protect,
  adminOnly,
  updateService
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteService
);

export default router;