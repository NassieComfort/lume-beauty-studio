import { Request, Response, NextFunction } from "express";
import Availability from "../models/Availability";
import AppError from "../utils/AppError";

export const getAvailability = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const availability = await Availability.find().sort({ dayOfWeek: 1 });
    return res.status(200).json({
      success: true,
      data: availability,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { isOpen, openingTime, closingTime } = req.body;
    const dayOfWeek = Number(req.body.dayOfWeek);

    if (Number.isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
      return next(new AppError("Invalid day of week.", 400));
    }

    const availability = await Availability.findOneAndUpdate(
      { dayOfWeek },
      {
        isOpen,
        openingTime: openingTime || "09:00",
        closingTime: closingTime || "18:00",
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Availability updated successfully.",
      data: availability,
    });
  } catch (error) {
    next(error);
  }
};