import { Router } from "express";

import {
  getServices,
  getServiceById,
  getAllServicesAdmin,
  createService,
  updateService,
  deleteService,
  toggleService,
} from "../controllers/service.controller";

import protect from "../middleware/auth.middleware";
import adminOnly from "../middleware/adminOnly";

const router = Router();

// Public routes (active services only)
router.get("/", getServices);
router.get("/:id", getServiceById);

// Protected Admin middleware
router.use(protect, adminOnly);

// Protected Admin routes
router.get("/admin/all", getAllServicesAdmin);
router.post("/", createService);
router.patch("/:id", updateService);
router.delete("/:id", deleteService);
router.patch("/:id/toggle", toggleService);

export default router;