import { RequestHandler } from "express";

import Availability from "../models/Availability";
import AppError from "../utils/AppError";
import asyncHandler from "../utils/asyncHandler";

export const getAvailability: RequestHandler = asyncHandler(
  async (_req, res) => {
    const availability = await Availability.find({
      isActive: true,
    }).sort({ dayOfWeek: 1 });

    res.json({
      success: true,
      availability,
    });
  }
);

export const createAvailability: RequestHandler = asyncHandler(
  async (req, res) => {
    const {
      dayOfWeek,
      startTime,
      endTime,
    } = req.body;

    if (
      dayOfWeek === undefined ||
      !startTime ||
      !endTime
    ) {
      throw new AppError(
        "dayOfWeek, startTime and endTime are required",
        400
      );
    }

    const existing = await Availability.findOne({
      dayOfWeek,
    });

    if (existing) {
      throw new AppError(
        "Availability already exists for this day",
        409
      );
    }

    const availability = await Availability.create({
      dayOfWeek,
      startTime,
      endTime,
    });

    res.status(201).json({
      success: true,
      message: "Availability created successfully",
      availability,
    });
  }
);

export const updateAvailability: RequestHandler =
  asyncHandler(async (req, res) => {
    const availability =
      await Availability.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!availability) {
      throw new AppError("Availability not found", 404);
    }

    res.json({
      success: true,
      message: "Availability updated successfully",
      availability,
    });
  });

export const deleteAvailability: RequestHandler =
  asyncHandler(async (req, res) => {
    const availability =
      await Availability.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );

    if (!availability) {
      throw new AppError("Availability not found", 404);
    }

    res.json({
      success: true,
      message: "Availability removed successfully",
    });
  });