import ServiceCard from "../components/ServiceCard";
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

const services = [
  {
    name: "Classic Full Set",
    category: "Lashes",
    description: "A timeless and natural lash enhancement.",
    duration: "1 hr 30 mins",
    price: "₦15,000",
    image: classicSet,
  },
  {
    name: "Hybrid Full Set",
    category: "Lashes",
    description: "A balanced combination of classic and volume.",
    duration: "2 hrs",
    price: "₦20,000",
    image: hybridSet,
  },
  {
    name: "Volume Full Set",
    category: "Lashes",
    description: "A fuller and more dramatic lash finish.",
    duration: "2 hrs 30 mins",
    price: "₦25,000",
    image: volumeSet,
  },
  {
    name: "Mega Volume + Wispy Set",
    category: "Lashes",
    description: "Full volume fans layeref withntexture spikes for a bold, fluttery finish",
    duration: "2 hrs 30 mins",
    price: "35,000",
    image: megaVolumeSet,
  },{
    name: "Anime Lash Set",
    category: "Lashes",
    description: "Inspired by doll-eye trends, feauturing distinct exaggerated spikes paired with a clean, spaced-out lash line.",
    duration: "30 mins",
    price: "₦10,000",
    image: animeSet,
  },

  {
    name: "Lash Infills",
    category: "Lashes",
    description: "Refresh and maintain your existing lash set.",
    duration: "1 hr",
    price: "₦15,000",
    image: refill,
  },
  {
    name: "Gel Nails",
    category: "Nails",
    description: "A Long-lasting gel polish that provides high shine and chip-resistant wear for weeks.",
    duration: "1 hr",
    price: "₦10,000",
    image: gelNails,
  },
  {
    name: "Gel Toe Nails",
    category: "Nails",
    description: "Precise toe grooming and cuticle care finished with high-shine, long-lasting gel polish.",
    duration: "45 mins",
    price: "₦8,000",
    image: toeNails,
  },
  {
    name: "Acrylic & Powder Set",
    category: "Nails",
    description: "Durable lenght extension crafted with acrylic powder for maximum strenght and custom shapes.",
    duration: "2 hrs",
    price: "₦25,000",
    image: acrylicNails,
  },
  {
    name: "Brow Lamination",
    category: "Brows",
    description: "Softly lifted and defined brows.",
    duration: "45 mins",
    price: "₦20,000",
    image: browLamination,
  },
  {
    name: "Brow Shaping",
    category: "Brows",
    description: "Clean, balanced shaping tailored to your features.",
    duration: "30 mins",
    price: "₦10,000",
    image: browShaping,
  },
  {
    name: "Brow Wax",
    category: "Waxing",
    description: "Precise brow waxing for a clean finish.",
    duration: "20 mins",
    price: "₦5,000",
    image: browWax,
  },
  {
    name: "Underarm Wax",
    category: "Waxing",
    description: "Smooth and precise underarm waxing.",
    duration: "20 mins",
    price: "₦8,000",
    image: underarm,
  },
  {
    name: "Half-Leg Wax",
    category: "Waxing",
    description: "Smooth, clean and comfortable half-leg waxing.",
    duration: "30 mins",
    price: "₦15,000",
    image: halfLeg,
  },
{
    name: "Full-Leg Wax",
    category: "Waxing",
    description: "Smooth, clean and comfortable full-leg waxing.",
    duration: "30 mins",
    price: "₦30,000",
    image: fullLeg,
  },
];

export default function Services() {
  return (
    <section className="min-h-screen bg-lume-cream px-6 pb-24 pt-40 text-lume-charcoal lg:px-10">

      <div className="mx-auto max-w-7xl">

        <p className="text-xs uppercase tracking-[0.3em] text-lume-grey">
          Our Services
        </p>

        <h1 className="mt-5 max-w-4xl font-display text-5xl md:text-7xl">
          Beauty, curated for you.
        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-7 text-lume-grey md:text-base">
          From signature lash sets to nails, brows and waxing,
          discover the services available at Lume Beauty Studio.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {services.map((service) => (
            <ServiceCard
              key={service.name}
              {...service}
            />
          ))}

        </div>

      </div>

    </section>
  );
}