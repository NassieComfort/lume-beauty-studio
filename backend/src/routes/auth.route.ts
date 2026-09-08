import { Router } from "express";

import {
  register,
  login,
  getMe,
  changePassword,
  updateAdminAccountDetails,
} from "../controllers/auth.controller";

import protect from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", protect, getMe);

router.patch(
  "/admin-account",
  protect,
  updateAdminAccountDetails
);

router.patch(
  "/change-password",
  protect,
  changePassword
);

export default router;