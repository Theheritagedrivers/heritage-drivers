"use client";

import Link from "next/link";
import { FileText, LogOut } from "lucide-react";

export default function SiteHeader({
  lang,
  setLang,
  tc,
  isLoggedIn,
  isAdmin,
  onLoginClick,
  onLogout,
}) {
  return (
    <header className="border-b border-[#2a2213]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-4">
          <img
            src="/logo.png"
            alt="The Heritage Drivers"
            className="h-10 w-10 object-contain"
          />

          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-[#b6924f]">
              The Heritage Drivers
            </div>
            <div className="text-sm text-[#a89c84]">
              Motor Cars & Culture
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-8 text-sm md:flex">
            <Link href="/society" className="transition hover:text-white">
              {tc("navSociety")}
            </Link>

            <Link href="/philosophy" className="transition hover:text-white">
              {tc("navPhilosophy")}
            </Link>

            <Link href="/membership" className="transition hover:text-white">
              {tc("navMembership")}
            </Link>

            {isAdmin && (
              <Link
                href="/admin/pages"
                className="inline-flex items-center gap-2 rounded-full border border-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#e8dcc0] transition hover:bg-[#b6924f] hover:text-black"
              >
                <FileText className="h-3.5 w-3.5" />
                {tc("navAdminPages")}
              </Link>
            )}

            {!isLoggedIn ? (
              <button
                onClick={onLoginClick}
                className="inline-flex rounded-full border border-[#3b311d] px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#e8dcc0] transition hover:border-[#b6924f] hover:text-white"
              >
                {tc("loginButton")}
              </button>
            ) : (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 rounded-full border border-[#3b311d] px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#e8dcc0] transition hover:border-[#b6924f] hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" />
                {lang === "en" ? "Sign Out" : "Abmelden"}
              </button>
            )}
          </nav>

          <button
            onClick={() => setLang(lang === "en" ? "de" : "en")}
            className="border border-[#b6924f] px-3 py-1 text-xs uppercase tracking-widest"
          >
            {lang === "en" ? "DE" : "EN"}
          </button>
        </div>
      </div>
    </header>
  );
}