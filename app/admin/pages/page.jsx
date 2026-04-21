"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  FileText,
  Save,
  RefreshCw,
  Shield,
  Home,
} from "lucide-react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabaseConfigured =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("YOUR_PROJECT") &&
  !SUPABASE_ANON_KEY.includes("YOUR_PUBLIC");

const supabase = supabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const PAGE_OPTIONS = [
  { slug: "society", label: "Gesellschaft", description: "Öffentliche Society-Seite" },
  { slug: "philosophy", label: "Philosophie", description: "Öffentliche Philosophy-Seite" },
];

export default function AdminPagesPage() {
  const router = useRouter();

  const [initializing, setInitializing] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [sessionUser, setSessionUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [pages, setPages] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState("society");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loadingPages, setLoadingPages] = useState(false);
  const [saving, setSaving] = useState(false);

  const [status, setStatus] = useState({ type: "", message: "" });

  const selectedPage = useMemo(() => {
    return pages.find((page) => page.slug === selectedSlug) || null;
  }, [pages, selectedSlug]);

  const resetStatus = () => setStatus({ type: "", message: "" });

  useEffect(() => {
    const init = async () => {
      if (!supabaseConfigured || !supabase) {
        setStatus({
          type: "error",
          message:
            "Supabase ist nicht korrekt konfiguriert. Bitte ENV-Variablen prüfen.",
        });
        setInitializing(false);
        return;
      }

      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session?.user) {
          router.replace("/");
          return;
        }

        setSessionUser(session.user);

        const { data: profileData, error: profileError } = await supabase
          .from("member_profiles")
          .select("id, full_name, role, approved")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profileData || profileData.role !== "admin") {
          router.replace("/");
          return;
        }

        setProfile(profileData);
        setAuthorized(true);

        await loadPages();
      } catch (error) {
        setStatus({
          type: "error",
          message: error?.message || "Fehler bei der Initialisierung.",
        });
      } finally {
        setInitializing(false);
      }
    };

    init();
  }, [router]);

  useEffect(() => {
    if (selectedPage) {
      setTitle(selectedPage.title || "");
      setContent(selectedPage.content || "");
    } else {
      setTitle("");
      setContent("");
    }
  }, [selectedPage]);

  async function loadPages() {
    if (!supabase) return;

    setLoadingPages(true);
    resetStatus();

    try {
      const { data, error } = await supabase
        .from("site_pages")
        .select("id, slug, title, content, updated_at, updated_by")
        .order("slug", { ascending: true });

      if (error) throw error;

      setPages(data || []);
    } catch (error) {
      setStatus({
        type: "error",
        message: error?.message || "Seiten konnten nicht geladen werden.",
      });
    } finally {
      setLoadingPages(false);
    }
  }

  async function handleSave() {
    resetStatus();

    if (!supabase || !selectedPage || !sessionUser?.id) return;

    if (!title.trim()) {
      setStatus({ type: "error", message: "Bitte einen Titel eingeben." });
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from("site_pages")
        .update({
          title: title.trim(),
          content: content.trim(),
          updated_at: new Date().toISOString(),
          updated_by: sessionUser.id,
        })
        .eq("id", selectedPage.id);

      if (error) throw error;

      await loadPages();

      setStatus({
        type: "success",
        message: "Seiteninhalt erfolgreich gespeichert.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error?.message || "Speichern fehlgeschlagen.",
      });
    } finally {
      setSaving(false);
    }
  }

  const StatusBanner = () =>
    status.message ? (
      <div
        className={`mb-6 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
          status.type === "success"
            ? "border-[#3f4d29] bg-[#161d10] text-[#d9e8bb]"
            : "border-[#4b2a23] bg-[#1a1110] text-[#efc5bc]"
        }`}
      >
        {status.type === "success" ? (
          <CheckCircle2 className="mt-0.5 h-4 w-4" />
        ) : (
          <AlertCircle className="mt-0.5 h-4 w-4" />
        )}
        <span>{status.message}</span>
      </div>
    ) : null;

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-[#e8dcc0]">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-[#b6924f]" />
          <span>Admin-Bereich wird geladen...</span>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-12 text-[#e8dcc0]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#b6924f]">
              The Heritage Drivers
            </p>
            <h1 className="mt-4 text-4xl text-[#f2e6cf]">Admin Inhalte</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#bcb09a]">
              Zentrale Verwaltung der öffentlichen Seiteninhalte. Aktuell für
              Gesellschaft und Philosophie vorbereitet.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-[#3b311d] px-5 py-3 text-sm uppercase tracking-[0.2em] text-[#f2e6cf] transition hover:border-[#b6924f]"
            >
              <Home className="h-4 w-4" />
              Startseite
            </Link>

            <button
              onClick={loadPages}
              disabled={loadingPages}
              className="inline-flex items-center gap-2 rounded-full border border-[#b6924f] px-5 py-3 text-sm uppercase tracking-[0.2em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black disabled:opacity-70"
            >
              {loadingPages ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Neu laden
            </button>
          </div>
        </div>

        <StatusBanner />

        <div className="mb-8 rounded-[1.5rem] border border-[#2d2416] bg-[#111111] p-6">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-[#b6924f]" />
            <div>
              <p className="text-sm text-[#f2e6cf]">
                Angemeldet als {profile?.full_name || "Admin"}
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-[#8f836d]">
                Rolle: {profile?.role || "unknown"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-[1.75rem] border border-[#2d2416] bg-[#111111] p-6">
            <div className="mb-5 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#b6924f]" />
              <h2 className="text-lg text-[#f2e6cf]">Seiten</h2>
            </div>

            <div className="space-y-3">
              {PAGE_OPTIONS.map((item) => {
                const exists = pages.some((page) => page.slug === item.slug);
                const active = item.slug === selectedSlug;

                return (
                  <button
                    key={item.slug}
                    onClick={() => setSelectedSlug(item.slug)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      active
                        ? "border-[#b6924f] bg-[#17120d]"
                        : "border-[#2d2416] bg-[#0f0f0f] hover:border-[#5c4a28]"
                    }`}
                  >
                    <p className="text-sm text-[#f2e6cf]">{item.label}</p>
                    <p className="mt-1 text-xs text-[#a99c83]">
                      {item.description}
                    </p>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-[#8f836d]">
                      {exists ? "Datensatz vorhanden" : "Noch nicht vorhanden"}
                    </p>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="rounded-[1.75rem] border border-[#2d2416] bg-[#111111] p-6">
            {!selectedPage ? (
              <div className="rounded-2xl border border-[#4b2a23] bg-[#1a1110] p-5 text-sm text-[#efc5bc]">
                Für diesen `slug` wurde noch kein Eintrag in `site_pages`
                gefunden. Bitte zuerst den Datensatz in Supabase anlegen.
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#b6924f]">
                    Bearbeitung
                  </p>
                  <h2 className="mt-3 text-3xl text-[#f2e6cf]">
                    {selectedPage.slug}
                  </h2>
                </div>

                <div className="grid gap-6">
                  <div>
                    <label className="mb-2 block text-sm text-[#d9ccb1]">
                      Titel
                    </label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-[#d9ccb1]">
                      Inhalt
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={18}
                      className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-full bg-[#b6924f] px-5 py-3 text-sm uppercase tracking-[0.22em] text-black transition hover:bg-[#c6a45d] disabled:opacity-70"
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Speichern
                    </button>

                    <button
                      onClick={() => {
                        setTitle(selectedPage.title || "");
                        setContent(selectedPage.content || "");
                        resetStatus();
                      }}
                      className="rounded-full border border-[#3b311d] px-5 py-3 text-sm uppercase tracking-[0.2em] text-[#f2e6cf] transition hover:border-[#b6924f]"
                    >
                      Änderungen verwerfen
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}