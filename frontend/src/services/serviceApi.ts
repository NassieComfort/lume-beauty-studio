import {
  getAdminServices,
  createAdminService,
  updateAdminService,
} from "./adminApi";

export interface ServiceItem {
  _id?: string;
  name: string;
  category: "Lashes" | "Nails" | "Brows" | "Waxing";
  description: string;
  price: number;
  duration: number;
  image: string;
  isActive?: boolean;
}

// Fetch public active services (used by public catalog/Services.tsx)
  const API_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000"
).replace(/\/+$/, "");

export const getServices = async (): Promise<ServiceItem[]> => {
  const response = await fetch(
    `${API_URL}/api/services`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to load services."
    );
  }

  return data.data;
};

// Fetch all services for admin panel
export const fetchAdminServices = async (): Promise<ServiceItem[]> => {
  const response = await getAdminServices();
  return response.data;
};

// Create new service
export const createService = async (
  data: Omit<ServiceItem, "_id">
): Promise<ServiceItem> => {
  const response = await createAdminService(data);
  return response.data;
};

// Update service
export const updateService = async (
  id: string,
  data: Partial<ServiceItem>
): Promise<ServiceItem> => {
  const response = await updateAdminService(id, data);
  return response.data;
};

// Toggle active status
export const toggleServiceStatus = async (
  id: string,
  currentStatus: boolean
): Promise<ServiceItem> => {
  const response = await updateAdminService(id, { isActive: !currentStatus });
  return response.data;
};