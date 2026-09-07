import { Request, Response, NextFunction } from "express";
import {
  registerUser,
  loginUser,
  updateAdminAccount,
} from "../services/auth.service";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    const result = await registerUser(
      name,
      email,
      password
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { currentPassword, email, newPassword } = req.body;

    if (!req.user || !currentPassword || !email) {
      return next(new Error("Current password and email are required"));
    }

    if (newPassword && newPassword.length < 6) {
      return next(new Error("New password must be at least 6 characters"));
    }

    const result = await updateAdminAccount(
      req.user.id,
      currentPassword,
      email,
      newPassword
    );

    res.json({ success: true, message: "Admin account updated", data: result });
  } catch (error) {
    next(error);
  }
};