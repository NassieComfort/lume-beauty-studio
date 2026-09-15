import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./src/pages/Home";
import About from "./src/pages/About";
import Services from "./src/pages/Services";
import Booking from "./src/pages/Booking";
import Confirmation from "./src/pages/Confirmation";
import Login from "./src/pages/Login";
import Dashboard from "./src/pages/Dashboard";

// Admin
import AdminLogin from "./src/pages/admin/AdminLogin";
import AdminDashboard from "./src/pages/admin/AdminDashboard";
import AdminAppointments from "./src/pages/admin/AdminAppointments";
import AdminServices from "./src/pages/admin/AdminServices";
import AdminAvailability from "./src/pages/admin/AdminAvailability";
import AdminRevenue from "./src/pages/admin/AdminRevenue";
import AdminSettings from "./src/pages/admin/AdminSettings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/services" element={<Services />} />

        <Route path="/booking" element={<Booking />} />

        <Route path="/confirmation" element={<Confirmation />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />


        {/* =========================
            ADMIN ROUTES
        ========================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/appointments"
          element={<AdminAppointments />}
        />

        <Route
          path="/admin/services"
          element={<AdminServices />}
        />

        <Route
          path="/admin/availability"
          element={<AdminAvailability />}
        />

        <Route
          path="/admin/revenue"
          element={<AdminRevenue />}
        />

        <Route
          path="/admin/settings"
          element={<AdminSettings />}
        />

      </Routes>
    </BrowserRouter>
  );
}