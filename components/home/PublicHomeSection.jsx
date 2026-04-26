"use client";

import Link from "next/link";

export default function PublicHomeSection({
  tc,
  isAdmin,
  saveContentField,
  onLoginClick,
}) {
  return (
    <section>
      {/* LOGO */}
      <div className="mb-10 flex justify-center">
       
      </div>

      {/* HERO */}
      <p className="text-sm uppercase tracking-[0.4em] text-[#b6924f]">
        {tc("heroTag")}
      </p>

      <h1 className="mt-6 text-5xl leading-tight text-[#f2e6cf] whitespace-pre-line">
        {tc("heroTitle")}
      </h1>

      <p className="mt-6 max-w-xl text-lg text-[#bcb09a]">
        {tc("heroText")}
      </p>

      {/* CTA */}
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/membership"
          className="bg-[#b6924f] px-6 py-3 text-black"
        >
          {tc("cta1")}
        </Link>

        <Link
          href="/society"
          className="border border-[#b6924f] px-6 py-3"
        >
          {tc("cta2")}
        </Link>

        <button
          onClick={onLoginClick}
          className="border border-[#3b311d] px-6 py-3 text-[#e8dcc0]"
        >
          {tc("loginButton")}
        </button>
      </div>

      {/* TAGS */}
      <div className="mt-10 flex flex-wrap gap-6 text-sm uppercase text-[#8b7e65]">
        {[tc("tag1"), tc("tag2"), tc("tag3"), tc("tag4")].map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      {/* PHILOSOPHY PREVIEW */}
      <div className="mt-24 grid gap-6 lg:grid-cols-2">
        <h2 className="text-3xl text-[#f0e3c6]">
          {tc("philosophyTitle")}
        </h2>

        <div className="rounded-[2rem] border border-[#2d2416] bg-[#111111] p-8">
          <p className="text-sm text-[#b9ad95]">
            {tc("loginSubtitle")}
          </p>

          <button
            onClick={onLoginClick}
            className="mt-6 rounded-full border border-[#b6924f] px-5 py-3 text-sm uppercase tracking-[0.24em] text-[#f0e3c6] transition hover:bg-[#b6924f] hover:text-black"
          >
            {tc("loginButton")}
          </button>
        </div>
      </div>
    </section>
  );
}