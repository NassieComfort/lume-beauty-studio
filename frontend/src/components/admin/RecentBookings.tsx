const bookings = [
  { name: "Amaka Eze", service: "Classic Full Set", amount: "₦35,000", status: "Confirmed" },
  { name: "Tolu Ade", service: "Brow Lamination", amount: "₦18,000", status: "Confirmed" },
  { name: "Mariam Bello", service: "Hybrid Full Set", amount: "₦45,000", status: "Pending" },
  { name: "Sade James", service: "Gel Nails", amount: "₦22,000", status: "Confirmed" },
];

export default function RecentBookings() {
  return (
    <section className="rounded-2xl border border-white/10 bg-lume-chocolate p-6 shadow-lume">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl text-lume-cream">Recent bookings</h2>
        <span className="text-xs text-lume-grey">Latest activity</span>
      </div>
      <div className="divide-y divide-white/10">
        {bookings.map((booking) => (
          <div key={`${booking.name}-${booking.service}`} className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-sm text-lume-cream">{booking.name}</p>
              <p className="mt-1 text-xs text-lume-grey">{booking.service}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-lume-cream">{booking.amount}</p>
              <p className="mt-1 text-xs text-lume-grey">{booking.status}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
