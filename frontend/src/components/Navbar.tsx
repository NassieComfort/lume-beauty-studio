import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="border-b border-lume-gold/20 bg-lume-black">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="font-display text-2xl tracking-wide text-lume-gold">
          Lume
        </Link>
        <div className="flex gap-8 text-sm uppercase tracking-widest text-lume-cream/80">
          <Link to="/" className="hover:text-lume-gold transition-colors">Home</Link>
          <Link to="/booking" className="hover:text-lume-gold transition-colors">Book</Link>
        </div>
      </nav>
    </header>
  );
}
