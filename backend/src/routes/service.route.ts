import { Router } from "express";

import {
  getServices,
  getSingleService,
  createNewService,
  editService,
  removeService,
} from "../controllers/service.controller";

import protect from "../middleware/auth.middleware";
import adminOnly from "../middleware/adminOnly";

const router = Router();

/*
|--------------------------------------------------------------------------
| Beauty Services Catalog Routes
|--------------------------------------------------------------------------
*/

// Public: Fetch all active services
router.get("/", getServices);

// Public: Fetch single service details
router.get("/:id", getSingleService);

// Admin: Add a new service to the catalog
router.post("/", protect, adminOnly, createNewService);

// Admin: Edit service name, price, or duration
router.patch("/:id", protect, adminOnly, editService);

// Admin: Delete a service from the catalog
router.delete("/:id", protect, adminOnly, removeService);

export default router;