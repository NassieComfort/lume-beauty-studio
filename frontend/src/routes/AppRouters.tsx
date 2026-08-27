import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "../components/Layout";
import Home from "../pages/Home";
import Services from "../pages/Services";
import About from "../pages/About";
import Booking from "../pages/Booking";
import Confirmation from "../pages/Confirmation";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<Layout />}>

          <Route path="/" element={<Home />} />

          <Route
            path="/services"
            element={<Services />}
          />
          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/booking"
            element={<Booking />}
          />

          <Route
            path="/confirmation"
            element={<Confirmation />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}