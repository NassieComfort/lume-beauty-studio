import { useEffect, useState } from "react";
import ServiceCard from "../components/ServiceCard";
import { getServices, type ServiceItem as Service, } from "../services/serviceApi";

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

const serviceImages: Record<string, string> = {
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

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load services.");
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

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

        {loading && (
          <p className="mt-14 text-sm text-lume-grey">
            Loading services...
          </p>
        )}

        {error && (
          <p className="mt-14 text-sm text-red-500">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {services.map((service) => (
              <ServiceCard
                key={service._id}
                name={service.name}
                category={service.category}
                description={service.description}
                duration={
                  service.duration >= 60
                    ? `${Math.floor(service.duration / 60)} hr${
                        service.duration >= 120 ? "s" : ""
                      }${
                        service.duration % 60
                          ? ` ${service.duration % 60} mins`
                          : ""
                      }`
                    : `${service.duration} mins`
                }
                price={`₦${service.price.toLocaleString()}`}
                image={serviceImages[service.name]}
              />
            ))}

          </div>
        )}

      </div>
    </section>
  );
}