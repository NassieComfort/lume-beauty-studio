import { Link } from "react-router-dom";
import heroLashes from "../assets/public/hero-lashes.jpg";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">

      <div className="absolute inset-0">

        <img
          src={heroLashes}
          alt="Lash beauty treatment"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-lume-charcoal/65" />

        <div className="absolute inset-0 bg-gradient-to-t from-lume-charcoal via-transparent to-lume-charcoal/30" />

      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 pt-24 lg:px-10">

        <div className="max-w-4xl">

          <p className="mb-6 text-xs uppercase tracking-[0.35em] text-lume-cream/70">
            Lume Beauty Studio
          </p>

          <h1 className="font-display text-5xl leading-[1.02] md:text-7xl lg:text-8xl">
            Beauty,
            <br />
            intentionally
            <br />
            done.
          </h1>

          <p className="mt-8 max-w-xl text-base leading-7 text-lume-cream/70 md:text-lg">
            A modern beauty studio offering carefully curated
            lash, nail, brow and waxing experiences.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <Link
              to="/booking"
              className="rounded-full bg-lume-cream px-7 py-3.5 text-sm font-medium text-lume-charcoal transition hover:bg-white"
            >
              Book Appointment
            </Link>

            <Link
              to="/services"
              className="rounded-full border border-lume-cream/40 px-7 py-3.5 text-sm transition hover:bg-lume-cream hover:text-lume-charcoal"
            >
              Explore Services
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}