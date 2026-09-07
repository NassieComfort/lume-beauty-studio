import { Router } from "express";
import {
  register,
  login,
  getMe,
  updateAdmin,
} from "../controllers/auth.controller";
import protect from "../middleware/auth.middleware";
import adminOnly from "../middleware/adminOnly";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", protect, getMe);
router.patch("/admin-account", protect, adminOnly, updateAdmin);

export default router;