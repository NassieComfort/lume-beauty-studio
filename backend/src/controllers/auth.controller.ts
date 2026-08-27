import { RequestHandler } from "express";
import bcrypt from "bcryptjs";

import User from "../models/User";
import AppError from "../utils/AppError";
import asyncHandler from "../utils/asyncHandler";
import generateToken from "../utils/generateToken";

export const register: RequestHandler = asyncHandler(
  async (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError(
        "Name, email and password are required",
        400
      );
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      throw new AppError("An account with this email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: "customer",
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  }
);

export const login: RequestHandler = asyncHandler(
  async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(
        "Email and password are required",
        400
      );
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    if (!user.isActive) {
      throw new AppError("This account has been disabled", 403);
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  }
);

export const getMe: RequestHandler = asyncHandler(
  async (req, res) => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  }
);