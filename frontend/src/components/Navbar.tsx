import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/booking", label: "Book Appointment" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/50 backdrop-blur-md border-b border-white/10 transition-all">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        
<Link
  to="/"
  className="flex flex-col items-start focus:outline-none group py-1"
  onClick={closeMenu}
>
  <span className="font-serif text-2xl font-normal tracking-[0.2em] text-[#FDFBF7] leading-none group-hover:text-[#D4C3B5] transition-colors">
    LUME
  </span>
  <span className="text-[8px] font-sans tracking-[0.35em] text-[#D4C3B5] uppercase mt-1 opacity-90">
    Beauty Studio
  </span>
</Link>
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `$${isActive ? "text-lume-cream" : "text-lume-cream/70"} text-sm transition hover:text-lume-cream ${
                  item.to === "/booking"
                    ? "rounded-full border border-lume-cream/40 px-5 py-2.5 hover:bg-lume-cream hover:text-lume-charcoal"
                    : ""
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          className="flex flex-col gap-1.5 rounded-md border border-lume-cream/30 p-2 text-lume-cream md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className={`block h-0.5 w-5 rounded-full bg-current transition ${isMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-5 rounded-full bg-current transition ${isMenuOpen ? "opacity-0" : "opacity-100"}`} />
          <span className={`block h-0.5 w-5 rounded-full bg-current transition ${isMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-white/10 bg-lume-charcoal md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-6 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-3 text-base transition ${
                    isActive ? "bg-lume-cream/10 text-lume-cream" : "text-lume-cream/80 hover:bg-white/5"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}