import { Request, Response, NextFunction } from "express";
import Availability from "../models/Availability";
import AppError from "../utils/AppError";

export const getAvailability = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const availability = await Availability.find().sort({
      dayOfWeek: 1,
    });

    return res.status(200).json({
      success: true,
      data: availability,
    });
  } catch (error) {
    return next(error);
  }
};

export const createOrUpdateAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { dayOfWeek, isOpen, openingTime, closingTime } = req.body;

    if (dayOfWeek === undefined || isOpen === undefined) {
      return next(
        new AppError("dayOfWeek and isOpen are required", 400)
      );
    }

    if (dayOfWeek < 0 || dayOfWeek > 6) {
      return next(new AppError("Invalid day of week", 400));
    }

    const availability = await Availability.findOneAndUpdate(
      { dayOfWeek },
      {
        dayOfWeek,
        isOpen,
        openingTime,
        closingTime,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: availability,
    });
  } catch (error) {
    return next(error);
  }
};