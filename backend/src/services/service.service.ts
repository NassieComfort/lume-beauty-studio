import Service from "../models/Service";
import AppError from "../utils/AppError";

export const getAllServices = async () => {
  return Service.find({ isActive: true }).sort({
    category: 1,
    name: 1,
  });
};

export const getServiceById = async (id: string) => {
  const service = await Service.findById(id);

  if (!service) {
    throw new AppError("Service not found", 404);
  }

  return service;
};

export const createService = async (data: {
  name: string;
  category: "Lashes" | "Nails" | "Brows" | "Waxing";
  description: string;
  price: number;
  duration: number;
  image?: string;
}) => {
  return Service.create(data);
};

export const updateService = async (
  id: string,
  data: Partial<{
    name: string;
    category: "Lashes" | "Nails" | "Brows" | "Waxing";
    description: string;
    price: number;
    duration: number;
    image: string;
    isActive: boolean;
  }>
) => {
  const service = await Service.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!service) {
    throw new AppError("Service not found", 404);
  }

  return service;
};

export const deleteService = async (id: string) => {
  const service = await Service.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!service) {
    throw new AppError("Service not found", 404);
  }

  return service;
};