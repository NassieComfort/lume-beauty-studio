import { Request, Response, NextFunction } from "express";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../services/service.service";

export const getServices = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const services = await getAllServices();

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const service = await getServiceById(req.params.id);

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

export const createNewService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const service = await createService(req.body);

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

export const editService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const service = await updateService(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

export const removeService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteService(req.params.id);

    res.status(200).json({
      success: true,
      message: "Service removed successfully",
    });
  } catch (error) {
    next(error);
  }
};