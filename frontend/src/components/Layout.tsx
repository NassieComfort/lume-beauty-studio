import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-screen bg-lume-charcoal text-lume-cream">

      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />

    </div>
  );
}