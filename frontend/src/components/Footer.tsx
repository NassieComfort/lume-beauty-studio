import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-lume-charcoal px-6 py-14 lg:px-10">

      <div className="mx-auto max-w-7xl">

        <div className="grid gap-10 md:grid-cols-3">

          <div>
            <h2 className="font-display text-3xl">
              Lume
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-7 text-lume-grey">
              Elevated beauty experiences designed with
              precision, intention and care.
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.25em]">
              Explore
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-lume-grey">

              <Link to="/">
                Home
              </Link>

              <Link to="/services">
                Services
              </Link>

              <Link to="/about">
                About
              </Link>

              <Link to="/booking">
                Book Appointment
              </Link>

            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.25em]">
              Studio
            </h3>

            <div className="mt-5 space-y-3 text-sm text-lume-grey">
              <p>Lagos, Nigeria</p>
              <p>By appointment only</p>
              <p>Mon — Sat</p>
              <p>9AM — 7PM</p>
            </div>
          </div>

        </div>

        <div className="mt-14 border-t border-white/10 pt-6 text-xs text-lume-grey">
          © {new Date().getFullYear()} Lume Beauty Studio.
          All rights reserved.
        </div>

      </div>

    </footer>
  );
}