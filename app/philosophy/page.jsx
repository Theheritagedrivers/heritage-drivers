import Link from "next/link";

export default function PhilosophyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-20 text-[#e8dcc0]">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-block text-sm uppercase tracking-[0.25em] text-[#b6924f] transition hover:text-white"
        >
          ← Back to Home
        </Link>

        <p className="mt-8 text-sm uppercase tracking-[0.35em] text-[#b6924f]">
          The Heritage Drivers
        </p>

        <h1 className="mt-6 text-5xl leading-tight text-[#f2e6cf]">
          Philosophy
        </h1>

        <div className="mt-10 rounded-[2rem] border border-[#2d2416] bg-[#111111] p-8">
          <p className="text-lg leading-8 text-[#bcb09a]">
            Not every motor car needs explanation. Some are understood through
            proportion, craftsmanship, restraint and the quiet confidence with
            which they were built.
          </p>

          <p className="mt-6 leading-8 text-[#a99c83]">
            The Heritage Drivers is guided by the belief that classic motoring is
            at its best when it remains sincere. We value authenticity over
            fashion, depth over display, and presence over noise. A well-kept
            motor car is not merely an object of admiration, but a bearer of
            memory, skill and continuity.
          </p>

          <p className="mt-6 leading-8 text-[#a99c83]">
            Mechanical appreciation is central to this philosophy. A motor car
            should be understood, maintained and used with sympathy. Patina may
            be honoured, restoration may be admired, but both must serve the
            integrity of the machine rather than vanity.
          </p>

          <p className="mt-6 leading-8 text-[#a99c83]">
            We believe good company matters as much as good automobiles. Conduct,
            modesty, humour and discretion form part of the road as surely as
            petrol, oil and weather. The experience should remain civilised, warm
            and free of pretence.
          </p>

          <p className="mt-6 leading-8 text-[#a99c83]">
            To preserve motoring heritage is not simply to keep old vehicles in
            motion. It is to preserve a standard of behaviour, a culture of care
            and a way of moving through the world with a little more grace.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-[1.5rem] border border-[#2d2416] bg-[#111111] p-6">
            <h2 className="text-lg text-[#f2e6cf]">Authenticity</h2>
            <p className="mt-3 text-sm leading-7 text-[#a99c83]">
              Respect for originality, honest restoration and mechanical truth.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-[#2d2416] bg-[#111111] p-6">
            <h2 className="text-lg text-[#f2e6cf]">Conduct</h2>
            <p className="mt-3 text-sm leading-7 text-[#a99c83]">
              Courtesy, discretion and good judgement remain part of the journey.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}