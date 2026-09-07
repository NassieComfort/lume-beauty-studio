import { Request, Response, NextFunction } from "express";
import BlockedSlot from "../models/BlockedSlot";
import AppError from "../utils/AppError";

// Get all blocked slots (optional date query filter)
export const getBlockedSlots = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filter: { date?: string } = {};

    if (req.query.date) {
      filter.date = req.query.date as string;
    }

    const blockedSlots = await BlockedSlot.find(filter).sort({
      date: 1,
      startTime: 1,
    });

    return res.status(200).json({
      success: true,
      data: blockedSlots,
    });
  } catch (error) {
    return next(error);
  }
};

// Create a full-day or time-range blocked slot
export const createBlockedSlot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date, startTime, endTime, reason } = req.body;

    if (!date) {
      return next(new AppError("Date is required", 400));
    }

    if ((startTime && !endTime) || (!startTime && endTime)) {
      return next(
        new AppError(
          "Both startTime and endTime are required for a time block",
          400
        )
      );
    }

    const blockedSlot = await BlockedSlot.create({
      date,
      startTime,
      endTime,
      reason,
    });

    return res.status(201).json({
      success: true,
      message: "Blocked slot created successfully",
      data: blockedSlot,
    });
  } catch (error) {
    return next(error);
  }
};

// Delete a blocked slot
export const deleteBlockedSlot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blockedSlot = await BlockedSlot.findByIdAndDelete(
      req.params.id
    );

    if (!blockedSlot) {
      return next(new AppError("Blocked slot not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Blocked slot removed successfully",
    });
  } catch (error) {
    return next(error);
  }
};