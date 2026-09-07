import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminAppointments from "./src/pages/admin/AdminAppointments";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/appointments" element={<AdminAppointments />} />
        
        {/* Fallback or other routes */}
      </Routes>
    </BrowserRouter>
  );
}