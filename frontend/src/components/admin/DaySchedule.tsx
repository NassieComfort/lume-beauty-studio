const schedule = [
  { time: "09:00", service: "Classic Full Set", customer: "Amaka Eze", status: "Confirmed" },
  { time: "11:00", service: "Brow Lamination", customer: "Tolu Ade", status: "Confirmed" },
  { time: "14:00", service: "Hybrid Full Set", customer: "Mariam Bello", status: "Pending" },
  { time: "16:00", service: "Gel Nails", customer: "Sade James", status: "Confirmed" },
];

export default function DaySchedule() {
  return (
    <section className="rounded-2xl border border-white/10 bg-lume-chocolate p-6 shadow-lume">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-lume-grey">Today</p>
          <h2 className="mt-1 font-display text-xl text-lume-cream">Daily schedule</h2>
        </div>
        <span className="text-xs text-lume-grey">{schedule.length} appointments</span>
      </div>
      <div className="divide-y divide-white/10">
        {schedule.map((item) => (
          <div key={`${item.time}-${item.customer}`} className="grid grid-cols-[64px_1fr_auto] gap-4 py-4">
            <span className="text-sm text-lume-grey">{item.time}</span>
            <div>
              <p className="text-sm text-lume-cream">{item.service}</p>
              <p className="mt-1 text-xs text-lume-grey">{item.customer}</p>
            </div>
            <span className="text-xs text-lume-cream/60">{item.status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
