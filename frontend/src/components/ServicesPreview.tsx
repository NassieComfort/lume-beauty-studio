import ServiceCard from "./ServiceCard";
import classicSet from "../assets/public/classic-set - .jpg";
import hybridSet from "../assets/public/Acrylic nails.jpeg";
import volumeSet from "../assets/public/Brow Lamination.jpeg";

const featuredServices = [
  {
    name: "Classic Full Set",
    category: "Lashes",
    description: "A timeless, clean and naturally defined lash look.",
    duration: "1 hr 30 mins",
    price: "₦15,000",
    image: classicSet,
  },
  {
    name: "Acrylic Nails",
    category: "Nails",
    description: "A polished manicure with a long-lasting gel finish.",
    duration: "1 hr",
    price: "₦25,000",
    image: hybridSet,
  },
  {
    name: "Brow Lamination",
    category: "Brows",
    description: "Softly lifted and defined brows for an effortless finish.",
    duration: "45 mins",
    price: "₦20,000",
    image: volumeSet,
  },
];

export default function ServicesPreview() {
  return (
    <section className="bg-lume-cream px-6 py-24 text-lume-charcoal lg:px-10">

      <div className="mx-auto max-w-7xl">

        <div className="max-w-2xl">

          <p className="text-xs uppercase tracking-[0.3em] text-lume-grey">
            Services
          </p>

          <h2 className="mt-4 font-display text-4xl md:text-5xl">
            Beauty, from every angle.
          </h2>

          <p className="mt-5 text-sm leading-7 text-lume-grey md:text-base">
            Explore our carefully curated beauty services,
            created to complement your style and routine.
          </p>

        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">

          {featuredServices.map((service) => (
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