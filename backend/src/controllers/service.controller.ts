import { Request, Response, NextFunction } from "express";
import Service from "../models/Service";

// Custom error handling helper (adjust path if needed)
class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

// 1. Get all active public services
export const getServices = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get single service by ID
export const getServiceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return next(new AppError("Service not found", 404));
    }

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// 3. Get all services for Admin (includes inactive)
export const getAllServicesAdmin = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

// 4. Create a new service
export const createService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, category, description, price, duration, image } = req.body;

    if (!name || !category || !description || price === undefined || !duration || !image) {
      return next(new AppError("Please provide all required fields", 400));
    }

    const newService = await Service.create({
      name,
      category,
      description,
      price,
      duration,
      image,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      data: newService,
    });
  } catch (error) {
    next(error);
  }
};

// 5. Update existing service details
export const updateService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return next(new AppError("Service not found", 404));
    }

    return res.status(200).json({
      success: true,
      data: updatedService,
    });
  } catch (error) {
    next(error);
  }
};

// 6. Toggle active/inactive status
export const toggleService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return next(new AppError("Service not found", 404));
    }

    service.isActive = !service.isActive;
    await service.save();

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// 7. Delete / Deactivate service
export const deleteService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return next(new AppError("Service not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};