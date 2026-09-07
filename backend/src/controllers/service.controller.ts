import { Request, Response, NextFunction } from "express";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../services/service.service";

// Fetch all active beauty services
export const getServices = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const services = await getAllServices();

    return res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    return next(error);
  }
};

// Fetch single service details by ID
export const getSingleService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const service = await getServiceById(req.params.id);

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    return next(error);
  }
};

// Create a new service (Admin)
export const createNewService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const service = await createService(req.body);

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    return next(error);
  }
};

// Edit service details (Admin)
export const editService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const service = await updateService(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: service,
    });
  } catch (error) {
    return next(error);
  }
};

// Remove a service (Admin)
export const removeService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Service removed successfully",
    });
  } catch (error) {
    return next(error);
  }
};