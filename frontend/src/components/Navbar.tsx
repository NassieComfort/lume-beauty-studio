import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-lume-charcoal/85 backdrop-blur-md">

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">

        <Link
          to="/"
          className="font-display text-2xl tracking-wide"
        >
          Lume
        </Link>

        <div className="hidden items-center gap-8 md:flex">

          <NavLink
            to="/"
            className="text-sm text-lume-cream/70 transition hover:text-lume-cream"
          >
            Home
          </NavLink>

          <NavLink
            to="/services"
            className="text-sm text-lume-cream/70 transition hover:text-lume-cream"
          >
            Services
            </NavLink>

          <NavLink
            to="/about"
            className="text-sm text-lume-cream/70 transition hover:text-lume-cream"
          >
            About
          </NavLink>

          <NavLink
            to="/booking"
            className="rounded-full border border-lume-cream/40 px-5 py-2.5 text-sm transition hover:bg-lume-cream hover:text-lume-charcoal"
          >
            Book Appointment
          </NavLink>

        </div>

        <button
          className="text-sm md:hidden"
          aria-label="Open menu"
        >
          Menu
        </button>

      </nav>

    </header>
  );
}