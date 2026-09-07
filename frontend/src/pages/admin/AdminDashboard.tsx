import { Users, Clock, CheckCircle2, Wallet } from "lucide-react";
import StatCard from "../../components/admin/StatCard";
import DaySchedule from "../../components/admin/DaySchedule";
import UpcomingAppointments from "../../components/admin/UpcomingAppointments";
import RevenueChart from "./RevenueChart";
import RecentBookings from "../../components/admin/RecentBookings";

const AdminDashboard = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Today's Appointments" value={6} sublabel="↑ 12% from yesterday" />
        <StatCard icon={Clock} label="Pending Requests" value={2} sublabel="Needs your attention" />
        <StatCard icon={CheckCircle2} label="Confirmed Today" value={4} sublabel="Ready to go" />
        <StatCard icon={Wallet} label="Revenue (This Month)" value="₦185,000" sublabel="↑ 18% from last month" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DaySchedule />
        </div>
        <UpcomingAppointments />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart />
        <RecentBookings />
      </div>
    </div>
  );
};

export default AdminDashboard;