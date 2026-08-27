const policies = [
  {
    title: "By appointment",
    text: "Lume Beauty Studio operates strictly by appointment. Walk-ins are not guaranteed.",
  },
  {
    title: "30-minute grace period",
    text: "Clients are given a 30-minute lateness grace period. Additional charges may apply after this period.",
  },
  {
    title: "Deposit required",
    text: "A deposit is required to secure your appointment. Your remaining balance is payable according to studio policy.",
  },
  {
    title: "Cancellation",
    text: "Late cancellations may result in the loss of your appointment deposit.",
  },
];

export default function PolicyCard() {
  return (
    <section className="bg-lume-cream px-6 py-24 text-lume-charcoal lg:px-10">

      <div className="mx-auto max-w-7xl">

        <div className="max-w-2xl">

          <p className="text-xs uppercase tracking-[0.3em] text-lume-grey">
            Studio Policy
          </p>

          <h2 className="mt-4 font-display text-4xl md:text-5xl">
            Before your appointment.
          </h2>

        </div>

        <div className="mt-12 grid gap-px overflow-hidden border border-lume-charcoal/10 bg-lume-charcoal/10 md:grid-cols-2">

          {policies.map((policy) => (
            <div
              key={policy.title}
              className="bg-lume-cream p-7 md:p-9"
            >

              <h3 className="font-display text-2xl">
                {policy.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-lume-grey">
                {policy.text}
              </p>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}