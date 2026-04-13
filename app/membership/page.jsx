import Link from "next/link";

export default function MembershipPage() {
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
          Membership
        </h1>

        <div className="mt-10 rounded-[2rem] border border-[#2d2416] bg-[#111111] p-8">
          <p className="text-lg leading-8 text-[#bcb09a]">
            Membership is intended to remain personal, selective and discreet.
            The Heritage Drivers is not designed as a volume-based organisation,
            but as a considered circle of individuals united by shared standards
            of conduct, taste and automotive appreciation.
          </p>

          <p className="mt-6 leading-8 text-[#a99c83]">
            Prospective members are encouraged to approach the society with a
            genuine interest in heritage motoring, civilised company and the
            preservation of quality. Ownership of a particular marque is less
            important than the manner in which one participates.
          </p>

          <p className="mt-6 leading-8 text-[#a99c83]">
            Admission may take place gradually and by personal contact. The aim
            is to maintain a welcoming yet coherent atmosphere in which the right
            people may meet, drive and contribute with ease.
          </p>
        </div>

        <div className="mt-10 rounded-[2rem] border border-[#2d2416] bg-[#111111] p-8">
          <h2 className="text-2xl text-[#f2e6cf]">Terms of Conduct</h2>

          <div className="mt-6 space-y-5 text-[#a99c83]">
            <p>
              Members are expected to conduct themselves with courtesy,
              discretion and respect toward fellow members, guests and the wider
              public.
            </p>

            <p>
              The society values tasteful behaviour and does not seek noise,
              vanity, unnecessary rivalry or theatrical display.
            </p>

            <p>
              Motor cars presented within the circle should be maintained in a
              manner consistent with safety, mechanical sympathy and respect for
              heritage.
            </p>

            <p>
              Conversation, humour and differing views are welcome; arrogance,
              provocation and discourtesy are not.
            </p>

            <p>
              Events, routes, private information and member details should be
              treated with appropriate discretion.
            </p>

            <p>
              Participation in the society should support an atmosphere that is
              calm, well-mannered and enjoyable for all concerned.
            </p>

            <p>
              The society reserves the right to decline or discontinue membership
              where conduct is inconsistent with its spirit and standards.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-[1.5rem] border border-[#2d2416] bg-[#111111] p-6">
          <h2 className="text-lg text-[#f2e6cf]">Membership Enquiries</h2>
          <p className="mt-3 text-sm leading-7 text-[#a99c83]">
            Enquiries may be submitted discreetly. Formal access and internal
            participation are subject to review and approval.
          </p>
        </div>
      </div>
    </main>
  );
}