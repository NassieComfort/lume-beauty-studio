import { Link } from "react-router-dom";

export default function Confirmation() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-lume-charcoal px-6">

      <div className="max-w-xl text-center">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-lume-cream/20">
          ✓
        </div>

        <p className="mt-8 text-xs uppercase tracking-[0.3em] text-lume-grey">
          Lume Beauty Studio
        </p>

        <h1 className="mt-5 font-display text-5xl md:text-6xl">
          Appointment received.
        </h1>

        <p className="mt-6 text-sm leading-7 text-lume-cream/60">
          Thank you for choosing Lume. Your appointment request
          has been received and will be confirmed shortly.
        </p>

        <div className="mt-10 border border-white/10 bg-lume-espresso p-7 text-left">

          <div className="flex justify-between border-b border-white/10 pb-4 text-sm">
            <span className="text-lume-grey">
              Booking reference
            </span>

            <span>
              LUME-XXXXXX
            </span>
          </div>

          <div className="mt-4 flex justify-between text-sm">
            <span className="text-lume-grey">
              Status
            </span>

            <span>
              Pending confirmation
            </span>
          </div>

        </div>

        <Link
          to="/"
          className="mt-9 inline-block rounded-full bg-lume-cream px-7 py-3.5 text-sm text-lume-charcoal"
        >
          Back to Home
        </Link>

      </div>

    </section>
  );
}