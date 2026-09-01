import { Router } from "express";
import {
  getServices,
  getSingleService,
  createNewService,
  editService,
  removeService,
} from "../controllers/service.controller";

import protect from "../middleware/protect";
import adminOnly from "../middleware/adminOnly";

const router = Router();

router.get("/", getServices);
router.get("/:id", getSingleService);

router.post(
  "/",
  protect,
  adminOnly,
  createNewService
);

router.patch(
  "/:id",
  protect,
  adminOnly,
  editService
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  removeService
);

export default router;