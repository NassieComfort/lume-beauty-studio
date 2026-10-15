import { useEffect, useState } from "react";
import SectionHeading from "./SectionHeading";
import ServiceCard from "./ServiceCard";
import {
  getApiBaseUrl,
  getServices,
  type ServiceItem as Service,
} from "../services/serviceApi";

const API_URL = getApiBaseUrl();

function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadServices = async () => {
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

    loadServices();
  }, [retryCount]);

  return (
    <section id="services" className="section-padding bg-lume-charcoal">
      <div className="container-lume">
        <SectionHeading
          eyebrow="Our Services"
          title="Curated beauty services."
          description="Every appointment is designed around precision, comfort and a finish that feels uniquely yours."
        />

        {loading && (
          <div className="mt-14 grid gap-6 md:grid-cols-3" aria-label="Loading services" aria-busy="true">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="animate-pulse border border-white/10 bg-white/5 p-7">
                <div className="mb-6 aspect-[5/3] bg-white/10" />
                <div className="mb-3 h-3 w-1/4 bg-white/10" />
                <div className="mb-3 h-6 w-3/4 bg-white/10" />
                <div className="mb-6 h-4 w-1/2 bg-white/10" />
                <div className="mb-8 h-14 bg-white/5" />
                <div className="h-8 border-t border-white/10 pt-4" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mt-14 text-center" role="alert">
            <p className="text-sm text-red-300">{error}</p>
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-5 border border-white/30 px-5 py-3 text-xs uppercase tracking-wider text-white transition hover:bg-white hover:text-lume-charcoal"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {services.map((service) => {
              const imageUrl = (() => {
                if (!service.image) return "";

                if (service.image.startsWith("http://") || service.image.startsWith("https://")) {
                  return service.image;
                }

                const normalized = service.image.replace(/^\/+/, "");

                return API_URL ? `${API_URL}/${normalized}` : `/${normalized}`;
              })();

              return (
                <ServiceCard
                  key={service._id}
                  name={service.name}
                  category={service.category}
                  description={service.description}
                  price={`₦${service.price.toLocaleString()}`}
                  duration={`${Math.floor(service.duration / 60)} hr${
                    service.duration >= 120 ? "s" : ""
                  }${
                    service.duration % 60
                      ? ` ${service.duration % 60} mins`
                      : ""
                  }`}
                  image={imageUrl}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Services;