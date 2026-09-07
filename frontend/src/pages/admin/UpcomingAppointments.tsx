interface Appointment {
  id: string;
  customer: string;
  service: string;
  time: string;
  amount: string;
}

const appointments: Appointment[] = [
  { id: "1", customer: "Ada Chikezie", service: "Classic Full Set", time: "09:00 - 10:30", amount: "₦15,000" },
  { id: "2", customer: "Sarah Johnson", service: "Gel Nails", time: "10:30 - 11:30", amount: "₦10,000" },
  { id: "3", customer: "Tolu Adebayo", service: "Brow Lamination", time: "12:00 - 12:45", amount: "₦20,000" },
  { id: "4", customer: "Peace Okafor", service: "Mega Volume + Wispy Set", time: "13:30 - 16:00", amount: "₦35,000" },
  { id: "5", customer: "Amaka Nwosu", service: "Full-Leg Wax", time: "16:30 - 17:00", amount: "₦30,000" },
];

const UpcomingAppointments = () => {
  return (
    <div className="rounded-2xl bg-lume-chocolate p-6 shadow-lume">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-xl text-lume-cream">
          Upcoming Appointments
        </h3>
        <button className="text-xs text-lume-cream/60 hover:text-lume-cream">
          View all
        </button>
      </div>

      <div className="flex flex-col divide-y divide-lume-cream/10">
        {appointments.map((a) => (
          <div key={a.id} className="flex items-center gap-3 py-3">
            <div className="h-9 w-9 shrink-0 rounded-full bg-lume-espresso" />
            <div className="flex-1">
              <p className="text-sm font-medium text-lume-cream">{a.customer}</p>
              <p className="text-xs text-lume-cream/50">{a.service}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-lume-cream/50">{a.time}</p>
              <p className="text-sm text-lume-cream">{a.amount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingAppointments;