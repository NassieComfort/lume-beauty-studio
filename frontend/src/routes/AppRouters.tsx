import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminAppointments from "../pages/admin/AdminAppointments";
import AdminServices from "../pages/admin/AdminServices";
import AdminAvailability from "../pages/admin/AdminAvailability";
import AdminRevenue from "../pages/admin/AdminRevenue";
import AdminSettings from "../pages/admin/AdminSettings";
import AdminRoute from "../components/admin/AdminRoute";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Services from "../pages/Services";
import About from "../pages/About";
import Booking from "../pages/Booking";
import AdminShell from "../pages/admin/Admin.Layout";

export default function AppRouters() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/booking" element={<Booking />} />
        </Route>

        {/* ================================================
            ADMIN LOGIN
           ================================================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* ================================================
            ADMIN APPLICATION
           ================================================= */}

        <Route element={<AdminRoute />}>
          <Route element={<AdminShell />}>
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
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}