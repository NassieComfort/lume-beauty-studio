import aboutLume from "../assets/public/about -lume.jpg";

export default function About() {
  return (
    <section className="min-h-screen bg-lume-charcoal px-6 pb-24 pt-40 lg:px-10">

      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center">

        <p className="text-xs uppercase tracking-[0.3em] text-lume-grey">
          About Lume
        </p>

        <h1 className="mt-5 font-display text-5xl leading-tight md:text-7xl">
          A beauty studio where every detail matters.
        </h1>

        <div className="space-y-7 text-base leading-8 text-lume-cream/70">

          <p>
            Lume Beauty Studio was created around one simple
            idea: beauty appointments should feel personal,
            intentional and effortless.
          </p>

          <p>
            From lashes and nails to brows and waxing, each
            service is designed to enhance your natural beauty
            while giving you a calm and considered experience.
          </p>

          <p>
            Appointments are scheduled in advance so every
            client receives dedicated time and attention.
          </p>

        </div>

        <img
          src={aboutLume}
          alt="Lume Beauty Studio"
          className="h-[520px] w-full object-cover"
        />

      </div>

    </section>
  );
}