import { RequestHandler } from "express";

import BlockedSlot from "../models/BlockedSlot";
import AppError from "../utils/AppError";
import asyncHandler from "../utils/asyncHandler";

export const getBlockedSlots: RequestHandler = asyncHandler(async (_req, res) => {
  const blockedSlots = await BlockedSlot.find({ isActive: true }).sort({ date: 1 });
  res.json({ success: true, blockedSlots });
});

export const createBlockedSlot: RequestHandler = asyncHandler(async (req, res) => {
  const { date, startTime, endTime } = req.body;
  if (!date || !startTime || !endTime) {
    throw new AppError("Date, start time and end time are required", 400);
  }
  const blockedSlot = await BlockedSlot.create({ date, startTime, endTime });
  res.status(201).json({ success: true, blockedSlot });
});

export const deleteBlockedSlot: RequestHandler = asyncHandler(async (req, res) => {
  const blockedSlot = await BlockedSlot.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!blockedSlot) throw new AppError("Blocked slot not found", 404);
  res.json({ success: true, message: "Blocked slot removed successfully" });
});