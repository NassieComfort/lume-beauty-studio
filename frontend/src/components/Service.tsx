import { useEffect, useState } from "react";
import SectionHeading from "./SectionHeading";
import ServiceCard from "./ServiceCard";
import { getServices, type ServiceItem as Service } from "../services/serviceApi";

function Services() {
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
    <section id="services" className="section-padding bg-lume-charcoal">
      <div className="container-lume">
        <SectionHeading
          eyebrow="Our Services"
          title="Curated beauty services."
          description="Every appointment is designed around precision, comfort and a finish that feels uniquely yours."
        />

        {loading && (
          <p className="mt-14 text-center text-white">
            Loading services...
          </p>
        )}

        {error && (
          <p className="mt-14 text-center text-red-400">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {services.map((service) => {
              // Ensure image URL resolves correctly whether it starts with a slash or not
              const imageUrl = service.image
                ? service.image.startsWith("http")
                  ? service.image
                  : `http://localhost:5000${service.image.startsWith("/") ? "" : "/"}${service.image}`
                : "";

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