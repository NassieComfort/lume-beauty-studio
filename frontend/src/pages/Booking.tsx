import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const services = [
  {
    id: "classic-lashes",
    name: "Classic Full Set",
    category: "Lashes",
    duration: 90,
    price: 15000,
  },
  {
    id: "hybrid-lashes",
    name: "Hybrid Wispy Full Set",
    category: "Lashes",
    duration: 120,
    price: 20000,
  },
  {
    id: "volume-lashes",
    name: "Volume Full Set",
    category: "Lashes",
    duration: 150,
    price: 25000,
  },
  {
    id: "lash-infill",
    name: "Lash Infills",
    category: "Lashes",
    duration: 60,
    price: 15000,
  },
  {
    id: "gel-toe-nails",
    name: "Gel Manicure",
    category: "Nails",
    duration: 60,
    price: 15000,
  },
  {
    id: "nail-extension",
    name: "Nail Extensions",
    category: "Nails",
    duration: 120,
    price: 30000,
  },
  {
    id: "brow-lamination",
    name: "Brow Lamination",
    category: "Brows",
    duration: 45,
    price: 20000,
  },
  {
    id: "brow-shaping",
    name: "Brow Shaping",
    category: "Brows",
    duration: 30,
    price: 10000,
  },
  {
    id: "brow-wax",
    name: "Brow Wax",
    category: "Waxing",
    duration: 20,
    price: 15000,
  },
  {
    id: "underarm-wax",
    name: "Underarm Wax",
    category: "Waxing",
    duration: 20,
    price: 8000,
  },
];

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const DEPOSIT_PERCENTAGE = 30;

export default function Booking() {
  const [formData, setFormData] = useState({
    serviceId: "",
    date: "",
    time: "",
    name: "",
    email: "",
    phone: "",
  });

  const selectedService = useMemo(
    () =>
      services.find(
        (service) => service.id === formData.serviceId
      ),
    [formData.serviceId]
  );

  const depositAmount = selectedService
    ? selectedService.price * (DEPOSIT_PERCENTAGE / 100)
    : 0;

  const balanceAmount = selectedService
    ? selectedService.price - depositAmount
    : 0;

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    console.log({
      ...formData,
      selectedService,
      depositAmount,
      balanceAmount,
    });
  };

  return (
    <section className="min-h-screen bg-lume-charcoal px-6 pb-24 pt-40 lg:px-10">

      <div className="mx-auto max-w-6xl">

        <div className="max-w-3xl">

          <p className="text-xs uppercase tracking-[0.3em] text-lume-grey">
            Appointments
          </p>

          <h1 className="mt-5 font-display text-5xl md:text-7xl">
            Book your Lume experience.
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-lume-cream/60 md:text-base">
            Choose your service, preferred date and available
            time. No account is required to request an appointment.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-14 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]"
        >

          <div className="border border-white/10 bg-lume-espresso p-6 md:p-10">

            <div className="space-y-7">

              {/* SERVICE */}

              <div>
                <label
                  htmlFor="serviceId"
                  className="mb-2 block text-xs uppercase tracking-wider text-lume-grey"
                >
                  Select service
                </label>

                <select
                  id="serviceId"
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleChange}
                  required
                  className="w-full border border-white/10 bg-lume-charcoal px-4 py-3.5 text-sm outline-none focus:border-lume-cream/40"
                >
                  <option value="">
                    Choose a service
                  </option>

                  {services.map((service) => (
                    <option
                      key={service.id}
                      value={service.id}
                    >
                      {service.name} — ₦
                      {service.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* DATE */}

              <div>
                <label
                  htmlFor="date"
                  className="mb-2 block text-xs uppercase tracking-wider text-lume-grey"
                >
                  Preferred date
                </label>

                <input
                  id="date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full border border-white/10 bg-lume-charcoal px-4 py-3.5 text-sm outline-none"
                />
              </div>

              {/* TIME */}

              <div>
                <label className="mb-3 block text-xs uppercase tracking-wider text-lume-grey">
                  Preferred time
                </label>

                <div className="grid grid-cols-3 gap-2">

                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() =>
                        setFormData((previous) => ({
                          ...previous,
                          time,
                        }))
                      }
                      className={`border px-3 py-3 text-sm transition ${
                        formData.time === time
                          ? "border-lume-cream bg-lume-cream text-lume-charcoal"
                          : "border-white/10 bg-lume-charcoal text-lume-cream/70 hover:border-white/30"
                      }`}
                    >
                      {time}
                    </button>
                  ))}

                </div>

                <input
                  type="hidden"
                  name="time"
                  value={formData.time}
                  required
                  readOnly
                />
              </div>

              {/* CUSTOMER DETAILS */}

              <div className="border-t border-white/10 pt-7">

                <h2 className="font-display text-2xl">
                  Your details
                </h2>

                <div className="mt-6 space-y-5">

                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-xs uppercase tracking-wider text-lume-grey"
                    >
                      Full name
                    </label>

                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="w-full border border-white/10 bg-lume-charcoal px-4 py-3.5 text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-xs uppercase tracking-wider text-lume-grey"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full border border-white/10 bg-lume-charcoal px-4 py-3.5 text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-xs uppercase tracking-wider text-lume-grey"
                    >
                      Phone number
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+234"
                      className="w-full border border-white/10 bg-lume-charcoal px-4 py-3.5 text-sm outline-none"
                    />
                  </div>

                </div>

              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-lume-cream px-6 py-4 text-sm font-medium text-lume-charcoal transition hover:bg-white"
              >
                Request Appointment
              </button>

            </div>

          </div>

          {/* SUMMARY */}

          <aside className="h-fit border border-white/10 bg-lume-cream p-7 text-lume-charcoal lg:sticky lg:top-32">

            <p className="text-xs uppercase tracking-[0.25em] text-lume-grey">
              Booking summary
            </p>

            <h2 className="mt-4 font-display text-3xl">
              Your appointment
            </h2>

            {selectedService ? (
              <div className="mt-8 space-y-5">

                <div>
                  <p className="text-xs text-lume-grey">
                    Service
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedService.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-lume-grey">
                    Duration
                  </p>

                  <p className="mt-1">
                    {selectedService.duration} minutes
                  </p>
                </div>

                <div className="border-t border-lume-charcoal/10 pt-5">

                  <div className="flex justify-between text-sm">
                    <span>Service</span>
                    <span>
                      ₦{selectedService.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-3 flex justify-between text-sm">
                    <span>
                      Deposit ({DEPOSIT_PERCENTAGE}%)
                    </span>
                    <span>
                      ₦{depositAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-3 flex justify-between text-sm text-lume-grey">
                    <span>Balance</span>
                    <span>
                      ₦{balanceAmount.toLocaleString()}
                    </span>
                  </div>

                </div>

              </div>
            ) : (
              <p className="mt-8 text-sm leading-7 text-lume-grey">
                Select a service to see your appointment
                summary and deposit information.
              </p>
            )}

            <div className="mt-8 border-t border-lume-charcoal/10 pt-6">

              <p className="text-xs uppercase tracking-wider text-lume-grey">
                Important
              </p>

              <p className="mt-3 text-sm leading-6 text-lume-grey">
                A 30% deposit is required to secure your
                appointment. A 30-minute grace period applies
                to lateness.
              </p>

            </div>

            <Link
              to="/services"
              className="mt-7 inline-block text-xs uppercase tracking-wider underline underline-offset-4"
            >
              View all services
            </Link>

          </aside>

        </form>

      </div>

    </section>
  );
}