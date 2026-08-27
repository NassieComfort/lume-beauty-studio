import { Link } from "react-router-dom";

export default function BookingCTA() {
  return (
    <section className="bg-lume-charcoal px-6 py-28 text-center lg:px-10">

      <p className="text-xs uppercase tracking-[0.3em] text-lume-grey">
        Your appointment awaits
      </p>

      <h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl md:text-6xl">
        Ready for your Lume experience?
      </h2>

      <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-lume-cream/60">
        Choose your service, select an available time and
        secure your appointment in just a few steps.
      </p>

      <Link
        to="/booking"
        className="mt-9 inline-block rounded-full bg-lume-cream px-8 py-3.5 text-sm font-medium text-lume-charcoal transition hover:bg-white"
      >
        Book Appointment
      </Link>

    </section>
  );
}