import { Request, Response, NextFunction } from "express";
import Service from "../models/Service";
import AppError from "../utils/AppError";
import router from "./studioSettings.route";

export const createService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const service = await Service.create(req.body);
    return res.status(201).json({ success: true, data: service });
  } catch (error) {
    return next(error);
  }
};

export const updateService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!service) return next(new AppError("Service not found", 404));
    return res.json({ success: true, data: service });
  } catch (error) {
    return next(error);
  }
};

export const deleteService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return next(new AppError("Service not found", 404));
    return res.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

export const toggleService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return next(new AppError("Service not found", 404));

    service.isActive = !service.isActive;
    await service.save();

    return res.json({ success: true, data: service });
  } catch (error) {
    return next(error);
  }
};

export default router;