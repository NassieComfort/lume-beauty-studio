import { useEffect, useMemo, useState } from "react";
import ServiceCard from "../components/ServiceCard";
import {
  getServices, type ServiceItem,
} from "../services/serviceApi";

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

const API_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000"
).replace(/\/+$/, "");

const resolveServiceImage = (
  service: ServiceItem
): string | undefined => {
  // Use the local Vite image first.
  // This ensures your existing service images work on Vercel.
  if (serviceImages[service.name]) {
    return serviceImages[service.name];
  }

  // If the admin/API provides an absolute image URL,
  // use it directly.
  if (
    service.image?.startsWith("http://") ||
    service.image?.startsWith("https://")
  ) {
    return service.image;
  }

  // If the API provides a relative Render image path.
  if (service.image) {
    return `${API_URL}/${service.image.replace(/^\/+/, "")}`;
  }

  return undefined;
};

const SERVICES_PER_PAGE = 6;

export default function Services() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");
      setHealthStatus(null);

      // timeout set to 10s to cover slower first-request times (Render cold start)
      const data = await getServices(10000);
      setServices(data);
    } catch (err: any) {
      console.error(err);
      // Prefer to show the underlying message when available (e.g. timeout message)
      setError(err?.message || "Unable to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const checkHealth = async () => {
    try {
      setCheckingHealth(true);
      setHealthStatus(null);

      const res = await fetch(`${API_URL}/api/health`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      setHealthStatus(json?.status ? `OK — ${json.status}` : "OK");
    } catch (err: any) {
      setHealthStatus(err?.message ? `Error: ${err.message}` : "Server unreachable");
    } finally {
      setCheckingHealth(false);
    }
  };

  const totalPages = Math.ceil(
    services.length / SERVICES_PER_PAGE
  );

  const currentServices = useMemo(() => {
    const startIndex =
      (currentPage - 1) * SERVICES_PER_PAGE;

    return services.slice(
      startIndex,
      startIndex + SERVICES_PER_PAGE
    );
  }, [services, currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: SERVICES_PER_PAGE }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded border border-lume-charcoal/10 bg-white p-6"
              >
                <div className="mb-5 h-40 w-full rounded bg-[#efe6dc]" />
                <div className="h-5 w-3/4 rounded bg-[#efe6dc] mb-3" />
                <div className="h-4 w-1/2 rounded bg-[#efe6dc] mb-4" />
                <div className="h-14 w-full rounded bg-[#f7f2ee]" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mt-14 space-y-4">
            <p className="text-sm text-red-500">{error}</p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={fetchServices}
                className="rounded-full border border-lume-charcoal/20 bg-lume-charcoal/80 px-4 py-2 text-sm text-lume-cream hover:opacity-90"
              >
                Retry
              </button>

              <button
                type="button"
                onClick={checkHealth}
                className="rounded-full border border-lume-charcoal/20 px-4 py-2 text-sm"
              >
                {checkingHealth ? "Checking…" : "Check server"}
              </button>

              {healthStatus && (
                <span className="text-sm text-lume-grey">{healthStatus}</span>
              )}
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mt-14">
  {/* Mobile carousel */}
  <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    {currentServices.map((service) => (
      <div
        key={service._id}
        className="min-w-[84%] snap-start"
      >
        <ServiceCard
          name={service.name}
          category={service.category}
          description={service.description}
          duration={
            service.duration
              ? `${service.duration} mins`
              : "Flexible"
          }
          price={`₦${service.price.toLocaleString()}`}
          image={resolveServiceImage(service)}
        />
      </div>
    ))}
  </div>

  {/* Tablet + desktop grid */}
  <div className="hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-3">
    {currentServices.map((service) => (
      <ServiceCard
        key={service._id}
        name={service.name}
        category={service.category}
        description={service.description}
        duration={
          service.duration
            ? `${service.duration} mins`
            : "Flexible"
        }
        price={`₦${service.price.toLocaleString()}`}
        image={resolveServiceImage(service)}
      />
    ))}
  </div>
</div>

            {totalPages > 1 && (
              <div className="mt-14 flex flex-col items-center gap-5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      goToPage(currentPage - 1)
                    }
                    disabled={currentPage === 1}
                    className="border border-lume-charcoal/20 px-4 py-2 text-xs uppercase tracking-[0.15em] transition hover:bg-lume-charcoal hover:text-lume-cream disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    ).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => goToPage(page)}
                        className={`h-9 w-9 border text-xs transition ${
                          currentPage === page
                            ? "border-lume-charcoal bg-lume-charcoal text-lume-cream"
                            : "border-lume-charcoal/20 hover:bg-lume-charcoal hover:text-lume-cream"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      goToPage(currentPage + 1)
                    }
                    disabled={
                      currentPage === totalPages
                    }
                    className="border border-lume-charcoal/20 px-4 py-2 text-xs uppercase tracking-[0.15em] transition hover:bg-lume-charcoal hover:text-lume-cream disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Next
                  </button>
                </div>

                <p className="text-xs text-lume-grey">
                  Showing{" "}
                  {(currentPage - 1) *
                    SERVICES_PER_PAGE +
                    1}{" "}
                  –{" "}
                  {Math.min(
                    currentPage * SERVICES_PER_PAGE,
                    services.length
                  )}{" "}
                  of {services.length} services
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}