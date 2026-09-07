const appointments = [
  { time: "Tomorrow, 10:00", name: "Nneka Okafor", service: "Volume Full Set" },
  { time: "Tomorrow, 13:00", name: "Adaobi Obi", service: "Full-Leg Wax" },
  { time: "Wed, 09:00", name: "Kemi Yusuf", service: "Acrylic & Powder Set" },
];

export default function UpcomingAppointments() {
  return (
    <section className="rounded-2xl border border-white/10 bg-lume-chocolate p-6 shadow-lume">
      <p className="text-xs uppercase tracking-[0.2em] text-lume-grey">Next up</p>
      <h2 className="mt-1 font-display text-xl text-lume-cream">Upcoming appointments</h2>
      <div className="mt-5 space-y-4">
        {appointments.map((appointment) => (
          <div key={`${appointment.time}-${appointment.name}`} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
            <p className="text-xs text-lume-grey">{appointment.time}</p>
            <p className="mt-1 text-sm text-lume-cream">{appointment.name}</p>
            <p className="mt-1 text-xs text-lume-grey">{appointment.service}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
