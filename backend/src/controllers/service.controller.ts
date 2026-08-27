import { RequestHandler } from "express";

import Service from "../models/Service";
import AppError from "../utils/AppError";
import asyncHandler from "../utils/asyncHandler";

export const getServices: RequestHandler = asyncHandler(async (_req, res) => {
  const services = await Service.find({ isActive: true }).sort({ name: 1 });
  res.json({ success: true, services });
});

export const getService: RequestHandler = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service || !service.isActive) throw new AppError("Service not found", 404);
  res.json({ success: true, service });
});

export const createService: RequestHandler = asyncHandler(async (req, res) => {
  const { name, description, duration, price, depositAmount } = req.body;
  if (!name || !description || duration === undefined || price === undefined) {
    throw new AppError("Name, description, duration and price are required", 400);
  }
  const service = await Service.create({ name, description, duration, price, depositAmount });
  res.status(201).json({ success: true, service });
});

export const updateService: RequestHandler = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!service) throw new AppError("Service not found", 404);
  res.json({ success: true, service });
});

export const deleteService: RequestHandler = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!service) throw new AppError("Service not found", 404);
  res.json({ success: true, message: "Service removed successfully" });
});