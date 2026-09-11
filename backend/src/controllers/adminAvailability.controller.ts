import { Request, Response, NextFunction } from "express";
import Availability from "../models/Availability";
import AppError from "../utils/AppError";

// GET /api/admin/availability
export const getAvailability = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const availability = await Availability.find().sort({ dayOfWeek: 1 });
    return res.json({
      success: true,
      data: availability,
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/admin/availability
export const updateAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let schedule = req.body.schedule;

    // If a single day object was sent directly, wrap it in an array
    if (!schedule && typeof req.body.dayOfWeek === "number") {
      schedule = [req.body];
    }

    if (!Array.isArray(schedule)) {
      return next(
        new AppError("Please provide an array of schedule objects.", 400)
      );
    }

    // Bulk update or upsert days
    const bulkOps = schedule.map((day) => ({
      updateOne: {
        filter: { dayOfWeek: day.dayOfWeek },
        update: {
          $set: {
            dayOfWeek: day.dayOfWeek,
            isOpen: day.isOpen,
            openingTime: day.isOpen ? day.openingTime || "09:00" : undefined,
            closingTime: day.isOpen ? day.closingTime || "18:00" : undefined,
          },
        },
        upsert: true,
      },
    }));

    await Availability.bulkWrite(bulkOps);

    const updatedAvailability = await Availability.find().sort({
      dayOfWeek: 1,
    });

    return res.json({
      success: true,
      message: "Availability schedule updated successfully.",
      data: updatedAvailability,
    });
  } catch (error) {
    return next(error);
  }
};