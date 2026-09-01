import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getServices, type Service } from "../services/serviceApi";

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
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [serviceError, setServiceError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    serviceId: "",
    date: "",
    time: "",
    name: "",
    email: "",
    phone: "",
  });

  /*
   * Today's date
   */
  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  /*
   * Load services from backend
   */
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoadingServices(true);
        setServiceError("");

        const data = await getServices();

        setServices(data);
      } catch (error) {
        console.error("Failed to load services:", error);
        setServiceError("Unable to load services.");
      } finally {
        setLoadingServices(false);
      }
    };

    loadServices();
  }, []);

  /*
   * Find selected service
   */
  const selectedService = useMemo(
    () =>
      services.find(
        (service) => service._id === formData.serviceId
      ),
    [services, formData.serviceId]
  );

  /*
   * Deposit calculation
   */
  const depositAmount = selectedService
    ? selectedService.price * (DEPOSIT_PERCENTAGE / 100)
    : 0;

  const balanceAmount = selectedService
    ? selectedService.price - depositAmount
    : 0;

  /*
   * Handle input changes
   */
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

    // Remove previous error while user is correcting the form
    if (submitError) {
      setSubmitError("");
    }
  };

  /*
   * Handle time selection
   */
  const handleTimeSelect = (time: string) => {
    setFormData((previous) => ({
      ...previous,
      time,
    }));

    if (submitError) {
      setSubmitError("");
    }
  };

  /*
   * Submit booking
   */
  const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  setSubmitError("");
  setSubmitSuccess(false);

  // Get the values directly from our React state
  const serviceId = formData.serviceId.trim();
  const date = formData.date.trim();
  const startTime = formData.time.trim();
  const name = formData.name.trim();
  const email = formData.email.trim();
  const phone = formData.phone.trim();

  // Validate required fields
  if (!serviceId) {
    setSubmitError("Please select a service.");
    return;
  }

  if (!date) {
    setSubmitError("Please select a date.");
    return;
  }

  if (!startTime) {
    setSubmitError("Please select a preferred time slot.");
    return;
  }

  if (!name) {
    setSubmitError("Please enter your full name.");
    return;
  }

  if (!email) {
    setSubmitError("Please enter your email address.");
    return;
  }

  if (!phone) {
    setSubmitError("Please enter your phone number.");
    return;
  }

  // Validate email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setSubmitError("Please enter a valid email address.");
    return;
  }

  // Validate date
  const selectedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(selectedDate.getTime())) {
    setSubmitError("Please select a valid appointment date.");
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    setSubmitError(
      "Please select a future date for your appointment."
    );
    return;
  }

  setSubmitting(true);

  try {
    const response = await fetch(
      "http://localhost:5000/api/appointments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId,
          date,
          startTime,
          guestName: name,
          guestEmail: email,
          guestPhone: phone,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to process booking request."
      );
    }

    setSubmitSuccess(true);

    setFormData({
      serviceId: "",
      date: "",
      time: "",
      name: "",
      email: "",
      phone: "",
    });
  } catch (error) {
    console.error("Booking error:", error);

    setSubmitError(
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again."
    );
  } finally {
    setSubmitting(false);
  }
};

  return (
    <section className="min-h-screen bg-lume-charcoal px-6 pb-24 pt-40 lg:px-10">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-lume-grey">
            Appointments
          </p>

          <h1 className="mt-5 font-display text-5xl text-lume-cream md:text-7xl">
            Book your Lume experience.
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-lume-cream/60 md:text-base">
            Choose your service, preferred date and available
            time. No account is required to request an appointment.
          </p>
        </div>

        {/* SUCCESS */}
        {submitSuccess ? (
          <div className="mt-14 border border-emerald-500/30 bg-emerald-950/20 p-8 text-center text-emerald-200">
            <h2 className="font-display text-3xl">
              Request Received!
            </h2>

            <p className="mt-3 text-sm leading-6">
              Your appointment request has been successfully
              submitted. We will review it and confirm shortly.
            </p>

            <button
              type="button"
              onClick={() => setSubmitSuccess(false)}
              className="mt-6 rounded-full bg-lume-cream px-6 py-3 text-xs font-semibold uppercase tracking-wider text-lume-charcoal hover:bg-white"
            >
              Book Another Appointment
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-14 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]"
          >

            {/* LEFT SIDE */}
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
                    disabled={loadingServices}
                    className="w-full border border-white/10 bg-lume-charcoal px-4 py-3.5 text-sm text-lume-cream outline-none focus:border-lume-cream/40 disabled:opacity-50"
                  >
                    <option value="">
                      {loadingServices
                        ? "Loading services..."
                        : "Choose a service"}
                    </option>

                    {services.map((service) => (
                      <option
                        key={service._id}
                        value={service._id}
                      >
                        {service.name} — ₦
                        {service.price.toLocaleString()}
                      </option>
                    ))}
                  </select>

                  {serviceError && (
                    <p className="mt-2 text-xs text-red-400">
                      {serviceError}
                    </p>
                  )}
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
                    min={todayString}
                    required
                    className="w-full border border-white/10 bg-lume-charcoal px-4 py-3.5 text-sm text-lume-cream outline-none"
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
                        onClick={() => handleTimeSelect(time)}
                        className={`border px-3 py-3 text-sm transition ${
                          formData.time === time
                            ? "border-lume-cream bg-lume-cream font-semibold text-lume-charcoal"
                            : "border-white/10 bg-lume-charcoal text-lume-cream/70 hover:border-white/30"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  {!formData.time && submitError && (
                    <p className="mt-2 text-xs text-red-400">
                      Please select a preferred time.
                    </p>
                  )}
                </div>

                {/* CUSTOMER DETAILS */}
                <div className="border-t border-white/10 pt-7">
                  <h2 className="font-display text-2xl text-lume-cream">
                    Your details
                  </h2>

                  <div className="mt-6 space-y-5">

                    {/* NAME */}
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
                        className="w-full border border-white/10 bg-lume-charcoal px-4 py-3.5 text-sm text-lume-cream outline-none placeholder:text-lume-cream/30"
                      />
                    </div>

                    {/* EMAIL */}
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
                        className="w-full border border-white/10 bg-lume-charcoal px-4 py-3.5 text-sm text-lume-cream outline-none placeholder:text-lume-cream/30"
                      />
                    </div>

                    {/* PHONE */}
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
                        className="w-full border border-white/10 bg-lume-charcoal px-4 py-3.5 text-sm text-lume-cream outline-none placeholder:text-lume-cream/30"
                      />
                    </div>

                  </div>
                </div>

                {/* ERROR */}
                {submitError && (
                  <div className="border border-red-500/20 bg-red-950/20 p-4">
                    <p className="text-xs leading-5 text-red-400">
                      {submitError}
                    </p>
                  </div>
                )}

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={
                    loadingServices ||
                    submitting ||
                    !selectedService
                  }
                  className="w-full rounded-full bg-lume-cream px-6 py-4 text-sm font-medium text-lume-charcoal transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? "Submitting Request..."
                    : "Request Appointment"}
                </button>

              </div>
            </div>

            {/* SUMMARY */}
            <aside className="h-fit border border-white/10 bg-lume-espresso p-7 text-lume-cream lg:sticky lg:top-32">

              <p className="text-xs uppercase tracking-[0.25em] text-lume-grey">
                Booking summary
              </p>

              <h2 className="mt-4 font-display text-3xl text-lume-cream">
                Your appointment
              </h2>

              {selectedService ? (
                <div className="mt-8 space-y-5">

                  <div>
                    <p className="text-xs text-lume-grey">
                      Service
                    </p>

                    <p className="mt-1 font-medium text-lume-cream">
                      {selectedService.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-lume-grey">
                      Duration
                    </p>

                    <p className="mt-1 text-lume-cream/90">
                      {selectedService.duration} minutes
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-lume-grey">
                      Date
                    </p>

                    <p className="mt-1 text-lume-cream/90">
                      {formData.date || "Not selected"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-lume-grey">
                      Time
                    </p>

                    <p className="mt-1 text-lume-cream/90">
                      {formData.time || "Not selected"}
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-5">

                    <div className="flex justify-between text-sm text-lume-cream/90">
                      <span>Service</span>

                      <span className="font-medium text-lume-cream">
                        ₦{selectedService.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="mt-3 flex justify-between text-sm text-lume-cream/90">
                      <span>
                        Deposit ({DEPOSIT_PERCENTAGE}%)
                      </span>

                      <span className="font-medium text-lume-cream">
                        ₦{depositAmount.toLocaleString()}
                      </span>
                    </div>

                    <div className="mt-3 flex justify-between text-sm text-lume-grey">
                      <span>Balance</span>

                      <span className="font-medium text-lume-cream/90">
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

              {/* POLICIES */}
              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-xs uppercase tracking-wider text-lume-grey">
                  Important
                </p>

                <p className="mt-3 text-sm leading-6 text-lume-cream/70">
                  A 30% deposit is required to secure your
                  appointment. A 30-minute grace period applies
                  to lateness.
                </p>
              </div>

              <Link
                to="/services"
                className="mt-7 inline-block text-xs uppercase tracking-wider text-lume-cream underline underline-offset-4 hover:text-white"
              >
                View all services
              </Link>

            </aside>

          </form>
        )}
      </div>
    </section>
  );
}