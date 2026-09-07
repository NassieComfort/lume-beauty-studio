import { useEffect, useState } from "react";
import {
  getAdminAppointments,
  updateAppointmentStatus,
  updateAppointmentPayment,
  cancelAppointment,
} from "../../services/adminApi";

interface Appointment {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  price: number;
  depositAmount: number;
  paymentStatus: string;
  status: string;
  service?: {
    name: string;
    category: string;
    duration: number;
    price: number;
  };
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminAppointments();
      const fetchedData = Array.isArray(response.data)
        ? response.data
        : response.data?.appointments || [];

      setAppointments(fetchedData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateAppointmentStatus(id, status);
      setAppointments((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app))
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update appointment status."
      );
    }
  };

  const handlePaymentChange = async (id: string, paymentStatus: string) => {
    try {
      await updateAppointmentPayment(id, paymentStatus);
      setAppointments((prev) =>
        prev.map((app) => (app._id === id ? { ...app, paymentStatus } : app))
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update payment status."
      );
    }
  };

  const handleCancel = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );
    if (!confirmed) return;

    try {
      await cancelAppointment(id);
      setAppointments((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: "cancelled" } : app))
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to cancel appointment."
      );
    }
  };

  // Safe Date Formatting avoiding timezone offsets
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const parts = dateStr.split("T")[0].split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-[#FAF7F3] min-h-screen text-[#292524]">
      {/* Header */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#78716C] mb-1">
          Management
        </p>
        <h1 className="font-serif text-3xl font-semibold text-[#3D1E1A]">
          Appointments
        </h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white border border-[#E8DFD8] rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center items-center text-[#78716C] text-xs space-x-2">
            <div className="w-4 h-4 border-2 border-[#C88A95] border-t-transparent rounded-full animate-spin"></div>
            <span>Loading appointments...</span>
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-10 text-center text-[#78716C] text-xs">
            No appointments found in database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="border-b border-[#E8DFD8] bg-[#FAF7F3] text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Time</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E8DFD8] text-xs">
                {appointments.map((appointment) => (
                  <tr
                    key={appointment._id}
                    className="hover:bg-[#FAF7F3]/50 transition-colors"
                  >
                    {/* Customer */}
                    <td className="p-4">
                      <p className="font-semibold text-[#292524]">
                        {appointment.customerName}
                      </p>
                      <p className="text-[11px] text-[#78716C]">
                        {appointment.customerPhone}
                      </p>
                      <p className="text-[11px] text-[#78716C]">
                        {appointment.customerEmail}
                      </p>
                    </td>

                    {/* Service */}
                    <td className="p-4 font-medium text-[#292524]">
                      {appointment.service?.name || "Beauty Service"}
                    </td>

                    {/* Date */}
                    <td className="p-4 font-medium text-[#292524]">
                      {formatDate(appointment.appointmentDate)}
                    </td>

                    {/* Time */}
                    <td className="p-4 text-[#78716C]">
                      {appointment.startTime} - {appointment.endTime}
                    </td>

                    {/* Price */}
                    <td className="p-4 font-semibold text-[#292524]">
                      &#8358;{(appointment.price || 0).toLocaleString()}
                    </td>

                    {/* Payment Select */}
                    <td className="p-4">
                      <select
                        value={appointment.paymentStatus}
                        onChange={(e) =>
                          handlePaymentChange(appointment._id, e.target.value)
                        }
                        className="bg-[#FAF7F3] border border-[#E8DFD8] rounded-lg px-2.5 py-1.5 text-xs text-[#292524] focus:outline-none focus:border-[#C88A95] font-medium"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>

                    {/* Status Select */}
                    <td className="p-4">
                      <select
                        value={appointment.status}
                        onChange={(e) =>
                          handleStatusChange(appointment._id, e.target.value)
                        }
                        className="bg-[#FAF7F3] border border-[#E8DFD8] rounded-lg px-2.5 py-1.5 text-xs text-[#292524] focus:outline-none focus:border-[#C88A95] font-medium"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="no-show">No-show</option>
                        <option value="rescheduled">Rescheduled</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Action button */}
                    <td className="p-4 text-right">
                      {appointment.status !== "cancelled" ? (
                        <button
                          onClick={() => handleCancel(appointment._id)}
                          className="px-3 py-1.5 rounded-lg bg-[#FCE8E8] text-[#C88A95] hover:bg-rose-100 font-semibold text-[11px] transition-colors"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#78716C] italic">
                          Cancelled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}