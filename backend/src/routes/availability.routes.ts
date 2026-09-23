import { Request, Response, NextFunction } from "express";
import Availability from "../models/Availability";
import AppError from "../utils/AppError";
import { getAvailableSlots } from "../services/availability.service";
import { Router } from "express";

// ========================================
// ADMIN: GET STUDIO AVAILABILITY
// ========================================

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
    next(error);
  }
};

// ========================================
// ADMIN: UPDATE STUDIO AVAILABILITY
// ========================================

export const updateAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { isOpen, openingTime, closingTime } = req.body;

    const dayOfWeek = Number(req.body.dayOfWeek);

    if (
      Number.isNaN(dayOfWeek) ||
      dayOfWeek < 0 ||
      dayOfWeek > 6
    ) {
      return next(
        new AppError("Invalid day of week.", 400)
      );
    }

    const availability =
      await Availability.findOneAndUpdate(
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

// ========================================
// PUBLIC: GET AVAILABLE BOOKING SLOTS
// ========================================

export const getPublicAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const date = String(req.query.date || "");
    const serviceId = String(req.query.serviceId || "");

    if (!date) {
      return next(
        new AppError("Date is required.", 400)
      );
    }

    if (!serviceId) {
      return next(
        new AppError("Service is required.", 400)
      );
    }

    const availability = await getAvailableSlots(
      date,
      serviceId
    );

    return res.status(200).json({
      success: true,
      data: availability,
    });
  } catch (error) {
    next(error);
  }
};
 
export default Router;
