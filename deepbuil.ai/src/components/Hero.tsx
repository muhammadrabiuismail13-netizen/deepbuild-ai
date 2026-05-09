export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Starfield */}
      <div className="absolute inset-0 bg-stars" />

      {/* Single brand-blue glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[var(--db-blue)]/20 blur-[120px]" />
      </div>

      {/* Page title */}
      <div className="relative z-10 px-6 pt-14 sm:pt-20">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Discover
        </h2>
      </div>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-16 pb-8 sm:pt-24">
        <h1 className="font-mono-display text-glow text-center text-[2.4rem] font-semibold leading-[1.05] text-white sm:text-6xl md:text-7xl">
          Build Your Future
          <br />
          <span className="text-[var(--db-blue-soft)]">with AI</span>
        </h1>

        {/* AI orb visual */}
        <div className="relative mt-10 h-72 w-72 sm:h-96 sm:w-96">
          <div className="absolute inset-0 rounded-full border border-white/10" />
          <div className="absolute inset-6 rounded-full border border-[var(--db-blue)]/25" />
          <div className="absolute inset-12 rounded-full border border-white/5" />

          <div className="glow-blue absolute inset-6 overflow-hidden rounded-full">
            <img
              src="/images/ai-hero.jpg"
              alt="AI neural sphere"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-0 mix-blend-color bg-[var(--db-blue)]/15" />
          </div>
        </div>
      </div>
    </section>
  );
}
