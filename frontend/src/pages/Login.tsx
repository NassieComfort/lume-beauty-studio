export default function Login() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-lume-charcoal px-6">

      <div className="w-full max-w-md">

        <p className="text-center text-xs uppercase tracking-[0.3em] text-lume-grey">
          Lume Beauty Studio
        </p>

        <h1 className="mt-5 text-center font-display text-4xl">
          Welcome back.
        </h1>

        <p className="mt-3 text-center text-sm text-lume-grey">
          Admin access
        </p>

        <form className="mt-10 space-y-5 border border-white/10 bg-lume-espresso p-7">

          <div>

            <label className="mb-2 block text-xs text-lume-grey">
              Email
            </label>

            <input
              type="email"
              className="w-full bg-lume-charcoal px-4 py-3.5 text-sm outline-none focus:ring-1 focus:ring-lume-cream/30"
              placeholder="admin@example.com"
            />

          </div>

          <div>

            <label className="mb-2 block text-xs text-lume-grey">
              Password
            </label>

            <input
              type="password"
              className="w-full bg-lume-charcoal px-4 py-3.5 text-sm outline-none focus:ring-1 focus:ring-lume-cream/30"
              placeholder="••••••••"
            />

          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-lume-cream px-5 py-3.5 text-sm text-lume-charcoal"
          >
            Login
          </button>

        </form>

      </div>

    </section>
  );
}