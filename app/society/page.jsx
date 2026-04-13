import Link from "next/link";

export const metadata = {
  title: "Society | The Heritage Drivers",
};
export default function SocietyPage() {
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
          Society
        </h1>

        <div className="mt-10 rounded-[2rem] border border-[#2d2416] bg-[#111111] p-8">
          <p className="text-lg leading-8 text-[#bcb09a]">
            The Heritage Drivers is conceived as a private motoring society for
            individuals who value classic and distinguished motor cars not as
            decorative objects, but as living expressions of culture,
            craftsmanship and character.
          </p>

          <p className="mt-6 leading-8 text-[#a99c83]">
            It is intended as a refined circle rather than a crowded club. The
            emphasis lies not on display, volume or unnecessary ceremony, but on
            quiet quality, shared understanding and the pleasure of meaningful
            motoring in good company.
          </p>

          <p className="mt-6 leading-8 text-[#a99c83]">
            The society welcomes those who appreciate authenticity, mechanical
            sympathy, tasteful conduct and the enduring dignity of historic
            automobiles. Whether pre-war, post-war or later heritage vehicles,
            what matters most is not fashion, but substance.
          </p>

          <p className="mt-6 leading-8 text-[#a99c83]">
            Gatherings, drives and exchanges are intended to remain personal,
            elegant and well considered. The purpose is not merely to arrive
            somewhere, but to enjoy the manner in which one travels, the
            conversations along the way, and the values that make such company
            worthwhile.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-[#2d2416] bg-[#111111] p-6">
            <h2 className="text-lg text-[#f2e6cf]">Motoring</h2>
            <p className="mt-3 text-sm leading-7 text-[#a99c83]">
              Driving as it was meant to be: thoughtful, elegant and enjoyed for
              its own sake.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-[#2d2416] bg-[#111111] p-6">
            <h2 className="text-lg text-[#f2e6cf]">Culture</h2>
            <p className="mt-3 text-sm leading-7 text-[#a99c83]">
              A society shaped by attitude, conversation, restraint and mutual
              regard.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-[#2d2416] bg-[#111111] p-6">
            <h2 className="text-lg text-[#f2e6cf]">Craftsmanship</h2>
            <p className="mt-3 text-sm leading-7 text-[#a99c83]">
              Respect for engineering, preservation, maintenance and the stories
              carried by fine motor cars.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}