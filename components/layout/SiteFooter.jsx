"use client";

import Link from "next/link";

export default function SiteFooter({ tc }) {
  return (
    <footer className="border-t border-[#2a2213] bg-[#0b0b0b]">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-3">
        <div>
          <h4 className="text-sm uppercase tracking-[0.3em] text-[#b6924f]">
            {tc("footerImprintTitle")}
          </h4>
          <p className="mt-4 text-sm leading-6 text-[#a99c83]">
            {tc("footerImprintText")}
          </p>
          <Link
            href="/impressum"
            className="mt-4 inline-block text-sm text-[#d7bf8a] underline underline-offset-4"
          >
            {tc("footerImprintLink")}
          </Link>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-[0.3em] text-[#b6924f]">
            {tc("footerAffiliationTitle")}
          </h4>
          <p className="mt-4 text-sm leading-6 text-[#a99c83]">
            {tc("footerAffiliationText")}
          </p>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-[0.3em] text-[#b6924f]">
            {tc("footerSponsorsTitle")}
          </h4>
          <p className="mt-4 text-sm leading-6 text-[#a99c83]">
            {tc("footerSponsorsText")}
          </p>
        </div>
      </div>

      <div className="border-t border-[#1e1a12] px-6 py-4 text-center text-xs uppercase tracking-[0.25em] text-[#7f735c]">
        {tc("footerBottomLine")}
      </div>
    </footer>
  );
}