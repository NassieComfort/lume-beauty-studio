import Service from "../models/Service";
import AppError from "../utils/AppError";

/**
 * Fetch all active beauty services
 */
export const getAllServices = async () => {
  return await Service.find({ isActive: true }).sort({ category: 1, name: 1 });
};

/**
 * Fetch a single beauty service by ID
 */
export const getServiceById = async (id: string) => {
  const service = await Service.findById(id);

  if (!service) {
    throw new AppError("Service not found", 404);
  }

  return service;
};

/**
 * Create a new beauty service
 */
export const createService = async (serviceData: any) => {
  return await Service.create(serviceData);
};

/**
 * Update an existing beauty service
 */
export const updateService = async (id: string, updateData: any) => {
  const service = await Service.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!service) {
    throw new AppError("Service not found", 404);
  }

  return service;
};

/**
 * Delete a service
 */
export const deleteService = async (id: string) => {
  const service = await Service.findByIdAndDelete(id);

  if (!service) {
    throw new AppError("Service not found", 404);
  }

  return service;
};