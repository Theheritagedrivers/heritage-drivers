"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Loader2, AlertCircle } from "lucide-react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabaseConfigured =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("YOUR_PROJECT") &&
  !SUPABASE_ANON_KEY.includes("YOUR_PUBLIC");

const supabase = supabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export default function SocietyPage() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    if (!supabase) {
      setErrorMessage("Supabase ist nicht korrekt konfiguriert.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("site_pages")
      .select("title, content")
      .eq("slug", "society")
      .maybeSingle();

    if (error) {
      setErrorMessage(error.message || "Seite konnte nicht geladen werden.");
      setLoading(false);
      return;
    }

    setPage(data || null);
    setLoading(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-[#e8dcc0]">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-[#b6924f]" />
          <span>Gesellschaft wird geladen...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-20 text-[#e8dcc0]">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-block text-sm uppercase tracking-[0.25em] text-[#b6924f] transition hover:text-white"
        >
          ← Zurück
        </Link>

        {errorMessage ? (
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#4b2a23] bg-[#1a1110] p-4 text-sm text-[#efc5bc]">
            <AlertCircle className="mt-0.5 h-4 w-4" />
            <span>{errorMessage}</span>
          </div>
        ) : (
          <>
            <p className="mt-8 text-sm uppercase tracking-[0.35em] text-[#b6924f]">
              The Heritage Drivers
            </p>

            <h1 className="mt-6 text-5xl leading-tight text-[#f2e6cf]">
              {page?.title || "Die Gesellschaft"}
            </h1>

            <div className="mt-10 whitespace-pre-line text-lg leading-8 text-[#d8ccb3]">
              {page?.content || "Kein Inhalt vorhanden."}
            </div>
          </>
        )}
      </div>
    </main>
  );
}