import SectionHeading from "./SectionHeading";
import ServiceCard from "./ServiceCard";
import classicSet from "../assets/public/classic-set - .jpg";
import hybridSet from "../assets/public/hybrid-set.jpg";
import volumeSet from "../assets/public/volume-set.jpg";
import megaVolumeSet from "../assets/public/mega-volume-set.jpg";

const services = [
  {
    name: "Classic Set",
    category: "Lashes",
    description:
      "A timeless, lightweight lash look designed to enhance your natural features.",
    price: "₦15,000",
    duration: "1 hr 30 mins",
    image: classicSet,
  },
  {
    name: "Hybrid Set",
    category: "Lashes",
    description:
      "The perfect balance between natural and dramatic for a fuller finish.",
    price: "₦20,000",
    duration: "2 hrs",
    image: hybridSet,
  },
  {
  name: "Hybrid + Animie Bottom Lashes",
  category: "Lashes",
  description: "A balanced, everyday set paired with bottom lashes for a clean, complete look.",
  price: "₦30,000",
  duration: "2 hrs",
  image: hybridSet,
},

  {
    name: "Volume Set",
    category: "Lashes",
    description:
      "A fuller, more dramatic lash look created for maximum impact.",
    price: "₦30,000",
    duration: "2 hrs 30 mins",
      image: volumeSet,
  },

    {
  name: "Volume Wispy Set",
  category: "Lashes",
  description: "Full volume fans layered with textured spikes for a bold, fluttery finish.",
  price: "₦35,500",
  duration: "2 hrs 30 mins",
  image: volumeSet,
},

  {
  name: "Mega Volume Set",
  category: "Lashes",
  description: "An ultra-dense, maximum-fullness lash look designed for high glamour and drama.",
  price: "₦35,000",
  duration: "3 hrs",
  image: megaVolumeSet,
},
];
   

function Services() {
  return (
    <section id="services" className="section-padding bg-lume-charcoal">
      <div className="container-lume">
        <SectionHeading
          eyebrow="Our Services"
          title="Curated beauty services."
          description="Every appointment is designed around precision, comfort and a finish that feels uniquely yours."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
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

export default Services;