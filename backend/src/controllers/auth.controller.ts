import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";

import {
  registerUser,
  loginUser,
  updateAdminAccount,
} from "../services/auth.service";

import User from "../models/User";
import AppError from "../utils/AppError";

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

/**
 * Change password for authenticated user/admin
 */
export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!userId) {
      return next(
        new AppError(
          "Authentication required.",
          401
        )
      );
    }

    if (!currentPassword || !newPassword) {
      return next(
        new AppError(
          "Current password and new password are required.",
          400
        )
      );
    }

    if (newPassword.length < 6) {
      return next(
        new AppError(
          "New password must be at least 6 characters.",
          400
        )
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return next(
        new AppError("User not found.", 404)
      );
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatches) {
      return next(
        new AppError(
          "Current password is incorrect.",
          401
        )
      );
    }

    const samePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (samePassword) {
      return next(
        new AppError(
          "New password must be different from your current password.",
          400
        )
      );
    }

    user.password = await bcrypt.hash(
      newPassword,
      12
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminAccountDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, email, newPassword } = req.body;

    if (!userId) {
      return next(new AppError("Authentication required.", 401));
    }

    if (!email || !String(email).trim()) {
      return next(new AppError("Email is required.", 400));
    }

    if (newPassword && !currentPassword) {
      return next(
        new AppError(
          "Current password is required to change your password.",
          400
        )
      );
    }

    const result = await updateAdminAccount(
      userId,
      currentPassword || "",
      email,
      newPassword
    );

    return res.status(200).json({
      success: true,
      message: "Account updated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};