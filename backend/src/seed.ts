import dotenv from "dotenv";
import mongoose from "mongoose";
import Service from "./models/Service";

dotenv.config();

const services = [
  // =========================
  // LASHES
  // =========================

  {
    name: "Classic Full Set",
    category: "Lashes",
    description: "A timeless and natural lash enhancement.",
    price: 15000,
    duration: 90,
    image: "/images/services/classic-set.jpg",
    isActive: true,
  },
  {
    name: "Hybrid Full Set",
    category: "Lashes",
    description: "A balanced combination of classic and volume.",
    price: 20000,
    duration: 120,
    image: "/images/services/hybrid-set.jpg",
    isActive: true,
  },
  {
    name: "Volume Full Set",
    category: "Lashes",
    description: "A fuller and more dramatic lash finish.",
    price: 25000,
    duration: 150,
    image: "/images/services/volume-set.jpg",
    isActive: true,
  },
  {
    name: "Mega Volume + Wispy Set",
    category: "Lashes",
    description:
      "Full volume fans layered with texture spikes for a bold, fluttery finish.",
    price: 35000,
    duration: 150,
    image: "/images/services/mega-volume-set.jpg",
    isActive: true,
  },
  {
    name: "Anime Lash Set",
    category: "Lashes",
    description:
      "Distinct exaggerated spikes paired with a clean, spaced-out lash line.",
    price: 10000,
    duration: 30,
    image: "/images/services/anime-lash-set.jpg",
    isActive: true,
  },
  {
    name: "Lash Infills",
    category: "Lashes",
    description: "Refresh and maintain your existing lash set.",
    price: 15000,
    duration: 60,
    image: "/images/services/refill.jpg",
    isActive: true,
  },

  // =========================
  // NAILS
  // =========================

  {
    name: "Gel Nails",
    category: "Nails",
    description:
      "A long-lasting gel polish that provides high shine and chip-resistant wear.",
    price: 10000,
    duration: 60,
    image: "/images/services/gel-nails.jpg",
    isActive: true,
  },
  {
    name: "Gel Toe Nails",
    category: "Nails",
    description:
      "Precise toe grooming and cuticle care finished with high-shine gel polish.",
    price: 8000,
    duration: 45,
    image: "/images/services/gel-toe-nails.jpg",
    isActive: true,
  },
  {
    name: "Acrylic & Powder Set",
    category: "Nails",
    description:
      "Durable nail extensions crafted with acrylic powder for strength and custom shapes.",
    price: 25000,
    duration: 120,
    image: "/images/services/acrylic-powder-set.jpg",
    isActive: true,
  },

  // =========================
  // BROWS
  // =========================

  {
    name: "Brow Lamination",
    category: "Brows",
    description: "Softly lifted and defined brows.",
    price: 20000,
    duration: 45,
    image: "/images/services/brow-lamination.jpg",
    isActive: true,
  },
  {
    name: "Brow Shaping",
    category: "Brows",
    description:
      "Clean, balanced shaping tailored to your features.",
    price: 10000,
    duration: 30,
    image: "/images/services/brow-shaping.jpg",
    isActive: true,
  },

  // =========================
  // WAXING
  // =========================

  {
    name: "Brow Wax",
    category: "Waxing",
    description: "Precise brow waxing for a clean finish.",
    price: 5000,
    duration: 20,
    image: "/images/services/brow-wax.jpg",
    isActive: true,
  },
  {
    name: "Underarm Wax",
    category: "Waxing",
    description: "Smooth and precise underarm waxing.",
    price: 8000,
    duration: 20,
    image: "/images/services/underarm.jpg",
    isActive: true,
  },
  {
    name: "Half-Leg Wax",
    category: "Waxing",
    description:
      "Smooth, clean and comfortable half-leg waxing.",
    price: 15000,
    duration: 30,
    image: "/images/services/half-leg.jpg",
    isActive: true,
  },
  {
    name: "Full-Leg Wax",
    category: "Waxing",
    description:
      "Smooth, clean and comfortable full-leg waxing.",
    price: 30000,
    duration: 30,
    image: "/images/services/full-leg.jpg",
    isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    console.log("MongoDB connected");

    await Service.deleteMany({});

    await Service.insertMany(services);

    console.log("Services seeded successfully");

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);

    process.exit(1);
  }
};

seedDatabase();