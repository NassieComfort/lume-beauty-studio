const stats = [
  {
    label: "Today's appointments",
    value: "8",
  },
  {
    label: "Upcoming",
    value: "14",
  },
  {
    label: "Today's revenue",
    value: "₦185K",
  },
  {
    label: "Pending deposits",
    value: "3",
  },
];

const appointments = [
  {
    client: "Amara Johnson",
    service: "Hybrid Full Set",
    time: "10:00 AM",
    status: "Confirmed",
  },
  {
    client: "Tolu Ade",
    service: "Gel Manicure",
    time: "12:30 PM",
    status: "Pending",
  },
  {
    client: "Maya Cole",
    service: "Brow Lamination",
    time: "3:00 PM",
    status: "Confirmed",
  },
];

export default function Dashboard() {
  return (
    <section className="min-h-screen bg-lume-charcoal px-6 pb-24 pt-40 lg:px-10">

      <div className="mx-auto max-w-7xl">

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-lume-grey">
            Admin
          </p>

          <h1 className="mt-5 font-display text-5xl md:text-6xl">
            Good morning.
          </h1>

          <p className="mt-3 text-sm text-lume-grey">
            Here's what's happening at Lume today.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border border-white/10 bg-lume-espresso p-6"
            >

              <p className="text-xs uppercase tracking-wider text-lume-grey">
                {stat.label}
              </p>

              <p className="mt-4 font-display text-3xl">
                {stat.value}
              </p>

            </div>
          ))}

        </div>

        <div className="mt-12 border border-white/10 bg-lume-espresso">

          <div className="flex items-center justify-between border-b border-white/10 p-6">

            <div>
              <h2 className="font-display text-2xl">
                Today's appointments
              </h2>

              <p className="mt-1 text-xs text-lume-grey">
                Manage your studio schedule.
              </p>
            </div>

          </div>

          <div className="divide-y divide-white/10">

            {appointments.map((appointment) => (
              <div
                key={`${appointment.client}-${appointment.time}`}
                className="grid gap-3 p-6 md:grid-cols-4 md:items-center"
              >

                <div>
                  <p className="text-sm">
                    {appointment.client}
                  </p>

                  <p className="mt-1 text-xs text-lume-grey">
                    {appointment.service}
                  </p>
                </div>

                <p className="text-sm text-lume-grey">
                  {appointment.time}
                </p>

                <p className="text-xs uppercase tracking-wider">
                  {appointment.status}
                </p>

                <button className="text-left text-xs underline underline-offset-4 md:text-right">
                  View appointment
                </button>

              </div>
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}