type Status = "Confirmed" | "Pending" | "Completed";

interface Booking {
  id: string;
  customer: string;
  service: string;
  date: string;
  status: Status;
  amount: string;
}

const bookings: Booking[] = [
  { id: "1", customer: "Emily Johnson", service: "Classic Full Set", date: "Sep 13, 2026", status: "Confirmed", amount: "₦15,000" },
  { id: "2", customer: "Olivia Smith", service: "Gel Nails", date: "Sep 13, 2026", status: "Pending", amount: "₦10,000" },
  { id: "3", customer: "Liam Miller", service: "Brow Shaping", date: "Sep 12, 2026", status: "Completed", amount: "₦10,000" },
];

const statusStyles: Record<Status, string> = {
  Confirmed: "bg-lume-cream text-lume-charcoal",
  Pending: "border border-lume-cream/40 text-lume-cream/80",
  Completed: "bg-lume-espresso text-lume-cream/70",
};

const RecentBookings = () => {
  return (
    <div className="rounded-2xl bg-lume-chocolate p-6 shadow-lume">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-xl text-lume-cream">Recent Bookings</h3>
        <button className="text-xs text-lume-cream/60 hover:text-lume-cream">
          View all
        </button>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wider text-lume-cream/40">
            <th className="pb-3 font-normal">Customer</th>
            <th className="pb-3 font-normal">Service</th>
            <th className="pb-3 font-normal">Date</th>
            <th className="pb-3 font-normal">Status</th>
            <th className="pb-3 text-right font-normal">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-lume-cream/10">
          {bookings.map((b) => (
            <tr key={b.id} className="text-lume-cream">
              <td className="py-3">{b.customer}</td>
              <td className="py-3 text-lume-cream/70">{b.service}</td>
              <td className="py-3 text-lume-cream/70">{b.date}</td>
              <td className="py-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs ${statusStyles[b.status]}`}
                >
                  {b.status}
                </span>
              </td>
              <td className="py-3 text-right">{b.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentBookings;