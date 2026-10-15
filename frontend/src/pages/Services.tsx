import { useEffect, useMemo, useState } from "react";
import ServiceCard from "../components/ServiceCard";
import {
  getApiBaseUrl, getServices, type ServiceItem,
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

const API_URL = getApiBaseUrl();

const resolveServiceImage = (
  service: ServiceItem
): string | undefined => {
  if (serviceImages[service.name]) {
    return serviceImages[service.name];
  }

  if (
    service.image?.startsWith("http://") ||
    service.image?.startsWith("https://") ||
    service.image?.startsWith("data:") ||
    service.image?.startsWith("/src/") ||
    service.image?.startsWith("/@fs/") ||
    service.image?.startsWith("/assets/")
  ) {
    return service.image;
  }

  if (service.image) {
    const cleaned = service.image.replace(/^\/+/, "");

    if (!API_URL) {
      return `/${cleaned}`;
    }

    return `${API_URL}/${cleaned}`;
  }

  return undefined;
};

const SERVICES_PER_PAGE = 6;

export default function Services() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getServices();
      setServices(data);
    } catch (err) {
      console.error(err);
      setError("We're having trouble loading our services. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

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
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading services" aria-busy="true">
            {Array.from({ length: SERVICES_PER_PAGE }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse border border-lume-charcoal/10 bg-white p-6"
              >
                <div className="mb-6 aspect-[5/3] w-full bg-[#efe6dc]" />
                <div className="mb-3 h-3 w-1/4 bg-[#efe6dc]" />
                <div className="mb-3 h-6 w-3/4 bg-[#efe6dc]" />
                <div className="mb-6 h-4 w-1/2 bg-[#efe6dc]" />
                <div className="mb-8 h-14 w-full bg-[#f7f2ee]" />
                <div className="h-8 border-t border-lume-charcoal/10 pt-4" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mt-14 border border-lume-charcoal/15 bg-white p-8" role="alert">
            <p className="max-w-xl text-sm leading-6 text-lume-grey">{error}</p>
            <button
              type="button"
              onClick={fetchServices}
              className="mt-5 border border-lume-charcoal bg-lume-charcoal px-5 py-3 text-xs font-medium uppercase tracking-wider text-lume-cream transition hover:bg-[#4a3028]"
            >
              Retry
            </button>
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
          serviceId={service._id}
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
        serviceId={service._id}
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