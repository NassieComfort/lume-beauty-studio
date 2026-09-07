import { useEffect, useState } from "react";
import { Wallet, Clock, CreditCard } from "lucide-react";
import { getAdminAppointments } from "../../services/adminApi";
import StatCard from "./StatCard";

interface Appointment {
  _id: string;
  price?: number;
  depositAmount?: number;
  paymentStatus?: string;
  status?: string;
}

export default function AdminRevenue() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const response = await getAdminAppointments();
        const fetchedData = Array.isArray(response.data)
          ? response.data
          : response.data?.appointments || [];
        setAppointments(fetchedData);
      } catch (err) {
        console.error("Failed to load revenue data:", err);
        setError("Unable to load revenue metrics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const completedRevenue = appointments
    .filter((a) => a.status === "completed")
    .reduce((total, a) => total + (Number(a.price) || 0), 0);

  const deposits = appointments
    .filter((a) => a.paymentStatus === "paid")
    .reduce((total, a) => total + (Number(a.depositAmount) || 0), 0);

  const outstanding = appointments
    .filter((a) => a.status !== "cancelled" && a.paymentStatus !== "paid")
    .reduce((total, a) => {
      const price = Number(a.price) || 0;
      const deposit = Number(a.depositAmount) || 0;
      return total + (price - deposit);
    }, 0);

  if (loading) {
    return (
      <div className="p-8 lg:p-10 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-3 text-[#78716C] text-sm">
          <div className="w-5 h-5 border-2 border-[#C88A95] border-t-transparent rounded-full animate-spin"></div>
          <span>Loading revenue analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 lg:p-10">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-8 bg-[#FAF7F3] min-h-screen text-[#292524]">
      
      {/* Header */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#78716C] mb-1">
          Finance Overview
        </p>
        <h1 className="font-serif text-3xl font-semibold text-[#3D1E1A]">
          Revenue
        </h1>
      </div>

      {/* Reusable Stat Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          label="Completed Revenue"
          value={completedRevenue}
          icon={Wallet}
          badge="Settled"
          badgeColor="bg-[#DCFCE7] text-[#16A34A]"
        />
        <StatCard
          label="Deposits Received"
          value={deposits}
          icon={CreditCard}
          badge="In Escrow"
          badgeColor="bg-[#FEF3C7] text-[#D97706]"
        />
        <StatCard
          label="Outstanding Balance"
          value={outstanding}
          icon={Clock}
          badge="Pending"
          badgeColor="bg-[#FCE8E8] text-[#C88A95]"
        />
      </div>

      {/* Integration Notice */}
      <div className="bg-white border border-[#E8DFD8] p-6 rounded-2xl shadow-sm space-y-2">
        <h2 className="font-serif text-lg font-semibold text-[#292524]">
          Payment Gateway Status
        </h2>
        <p className="text-xs text-[#78716C] leading-relaxed max-w-2xl">
          Calculations reflect snapshot totals from completed appointments and initial deposits. Automated payment reconciliation will trigger automatically once full gateway integration is finalized.
        </p>
      </div>

    </div>
  );
}