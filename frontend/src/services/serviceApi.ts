import {
  getAdminServices,
  createAdminService,
  updateAdminService,
} from "./adminApi";

import acrylicNails from "../assets/public/Acrylic nails.jpeg";
import browLamination from "../assets/public/Brow Lamination.jpeg";
import browShaping from "../assets/public/WhatsApp Image 2026-08-25 at 01.07.18 (1).jpeg";
import browWax from "../assets/public/Brow Waxing.jpeg";
import classicSet from "../assets/public/classic-set - .jpg";
import gelNails from "../assets/public/gel nails.jpeg";
import hybridSet from "../assets/public/hybrid-set.jpg";
import halfLeg from "../assets/public/Half leg.jpeg";
import fullLeg from "../assets/public/Full leg.jpeg";
import megaVolumeSet from "../assets/public/mega-volume-set.jpg";
import animeSet from "../assets/public/Anime buttom.jpeg";
import refill from "../assets/public/refill.jpeg";
import toeNails from "../assets/public/Toe nail.jpeg";
import underarm from "../assets/public/Underarm.jpeg";
import volumeSet from "../assets/public/volume-set.jpg";

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

const fallbackServiceImages: Record<string, string> = {
  "Classic Full Set": classicSet,
  "Hybrid Full Set": hybridSet,
  "Volume Full Set": volumeSet,
  "Mega Volume + Wispy Set": megaVolumeSet,
  "Anime Lash Set": animeSet,
  "Lash Infills": refill,
  "Gel Nails": gelNails,
  "Gel Toe Nails": toeNails,
  "Acrylic & Powder Set": acrylicNails,
  "Brow Lamination": browLamination,
  "Brow Shaping": browShaping,
  "Brow Wax": browWax,
  "Underarm Wax": underarm,
  "Half-Leg Wax": halfLeg,
  "Full-Leg Wax": fullLeg,
};

export const fallbackServices: ServiceItem[] = [
  {
    _id: "classic-full-set",
    name: "Classic Full Set",
    category: "Lashes",
    description: "A timeless and natural lash enhancement.",
    price: 15000,
    duration: 90,
    image: fallbackServiceImages["Classic Full Set"],
    isActive: true,
  },
  {
    _id: "hybrid-full-set",
    name: "Hybrid Full Set",
    category: "Lashes",
    description: "A balanced combination of classic and volume.",
    price: 20000,
    duration: 120,
    image: fallbackServiceImages["Hybrid Full Set"],
    isActive: true,
  },
  {
    _id: "volume-full-set",
    name: "Volume Full Set",
    category: "Lashes",
    description: "A fuller and more dramatic lash finish.",
    price: 25000,
    duration: 150,
    image: fallbackServiceImages["Volume Full Set"],
    isActive: true,
  },
  {
    _id: "mega-volume-wispy-set",
    name: "Mega Volume + Wispy Set",
    category: "Lashes",
    description: "Full volume fans layered with texture spikes for a bold, fluttery finish.",
    price: 35000,
    duration: 150,
    image: fallbackServiceImages["Mega Volume + Wispy Set"],
    isActive: true,
  },
  {
    _id: "anime-lash-set",
    name: "Anime Lash Set",
    category: "Lashes",
    description: "Distinct exaggerated spikes paired with a clean, spaced-out lash line.",
    price: 10000,
    duration: 30,
    image: fallbackServiceImages["Anime Lash Set"],
    isActive: true,
  },
  {
    _id: "lash-infills",
    name: "Lash Infills",
    category: "Lashes",
    description: "Refresh and maintain your existing lash set.",
    price: 15000,
    duration: 60,
    image: fallbackServiceImages["Lash Infills"],
    isActive: true,
  },
  {
    _id: "gel-nails",
    name: "Gel Nails",
    category: "Nails",
    description: "A long-lasting gel polish that provides high shine and chip-resistant wear.",
    price: 10000,
    duration: 60,
    image: fallbackServiceImages["Gel Nails"],
    isActive: true,
  },
  {
    _id: "gel-toe-nails",
    name: "Gel Toe Nails",
    category: "Nails",
    description: "Precise toe grooming and cuticle care finished with high-shine gel polish.",
    price: 8000,
    duration: 45,
    image: fallbackServiceImages["Gel Toe Nails"],
    isActive: true,
  },
  {
    _id: "acrylic-powder-set",
    name: "Acrylic & Powder Set",
    category: "Nails",
    description: "Durable nail extensions crafted with acrylic powder for strength and custom shapes.",
    price: 25000,
    duration: 120,
    image: fallbackServiceImages["Acrylic & Powder Set"],
    isActive: true,
  },
  {
    _id: "brow-lamination",
    name: "Brow Lamination",
    category: "Brows",
    description: "Softly lifted and defined brows.",
    price: 20000,
    duration: 45,
    image: fallbackServiceImages["Brow Lamination"],
    isActive: true,
  },
  {
    _id: "brow-shaping",
    name: "Brow Shaping",
    category: "Brows",
    description: "Clean, balanced shaping tailored to your features.",
    price: 10000,
    duration: 30,
    image: fallbackServiceImages["Brow Shaping"],
    isActive: true,
  },
  {
    _id: "brow-wax",
    name: "Brow Wax",
    category: "Waxing",
    description: "Precise brow waxing for a clean finish.",
    price: 5000,
    duration: 20,
    image: fallbackServiceImages["Brow Wax"],
    isActive: true,
  },
  {
    _id: "underarm-wax",
    name: "Underarm Wax",
    category: "Waxing",
    description: "Smooth and precise underarm waxing.",
    price: 8000,
    duration: 20,
    image: fallbackServiceImages["Underarm Wax"],
    isActive: true,
  },
  {
    _id: "half-leg-wax",
    name: "Half-Leg Wax",
    category: "Waxing",
    description: "Smooth, clean and comfortable half-leg waxing.",
    price: 15000,
    duration: 30,
    image: fallbackServiceImages["Half-Leg Wax"],
    isActive: true,
  },
  {
    _id: "full-leg-wax",
    name: "Full-Leg Wax",
    category: "Waxing",
    description: "Smooth, clean and comfortable full-leg waxing.",
    price: 30000,
    duration: 30,
    image: fallbackServiceImages["Full-Leg Wax"],
    isActive: true,
  },
];

export const getApiBaseUrl = () => {
  const baseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? "http://localhost:5000" : "");

  return baseUrl.replace(/\/+$/, "");
};

const API_URL = getApiBaseUrl();

export const getServices = async (timeout = 30000): Promise<ServiceItem[]> => {
  if (!API_URL) {
    return fallbackServices;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_URL}/api/services`, {
      signal: controller.signal,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load services.");
    }

    return Array.isArray(data?.data) ? data.data : fallbackServices;
  } catch (err: any) {
    console.warn("Using fallback services because the backend is unavailable.", err);
    return fallbackServices;
  } finally {
    clearTimeout(timer);
  }
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