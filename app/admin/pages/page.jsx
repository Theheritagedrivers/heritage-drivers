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
  Users,
  Mail,
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
  {
    slug: "society",
    label: "Gesellschaft",
    description: "Öffentliche Society-Seite",
  },
  {
    slug: "philosophy",
    label: "Philosophie",
    description: "Öffentliche Philosophy-Seite",
  },
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

  const [enquiries, setEnquiries] = useState([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);

  const [memberProfilesAdmin, setMemberProfilesAdmin] = useState([]);
  const [memberRoleDrafts, setMemberRoleDrafts] = useState({});
  const [authUsersAdmin, setAuthUsersAdmin] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

  const [status, setStatus] = useState({ type: "", message: "" });

  const selectedPage = useMemo(() => {
    return pages.find((page) => page.slug === selectedSlug) || null;
  }, [pages, selectedSlug]);

  const missingProfileUsers = authUsersAdmin.filter(
    (authUser) => !memberProfilesAdmin.some((member) => member.id === authUser.id)
  );

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

        await Promise.all([
          loadPages(),
          loadEnquiries(),
          loadMemberProfilesAdmin(),
          loadAuthUsersAdmin(),
        ]);
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

  async function loadEnquiries() {
    if (!supabase) return;

    setEnquiriesLoading(true);

    try {
      const { data, error } = await supabase
        .from("membership_enquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEnquiries(data || []);
    } catch (error) {
      setStatus({
        type: "error",
        message: error?.message || "Mitgliedsanfragen konnten nicht geladen werden.",
      });
    } finally {
      setEnquiriesLoading(false);
    }
  }

  async function loadMemberProfilesAdmin() {
    if (!supabase) return;

    setMembersLoading(true);

    try {
      const { data, error } = await supabase
        .from("member_profiles")
        .select("id, full_name, role, approved")
        .order("full_name", { ascending: true });

      if (error) throw error;

      setMemberProfilesAdmin(data || []);

      const drafts = {};
      (data || []).forEach((row) => {
        drafts[row.id] = row.role || "member";
      });

      setMemberRoleDrafts((prev) => ({
        ...drafts,
        ...prev,
      }));
    } catch (error) {
      setStatus({
        type: "error",
        message: error?.message || "Mitglieder konnten nicht geladen werden.",
      });
    } finally {
      setMembersLoading(false);
    }
  }

  async function loadAuthUsersAdmin() {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from("auth_users_overview")
        .select("id, email, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAuthUsersAdmin(data || []);
    } catch (error) {
      setAuthUsersAdmin([]);
    }
  }

  async function reloadAll() {
    resetStatus();
    await Promise.all([
      loadPages(),
      loadEnquiries(),
      loadMemberProfilesAdmin(),
      loadAuthUsersAdmin(),
    ]);
  }

  async function handleSavePage() {
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

  async function handleMarkEnquiryReviewed(enquiryId) {
    resetStatus();
    if (!supabase || !sessionUser?.id) return;

    try {
      const { error } = await supabase
        .from("membership_enquiries")
        .update({
          status: "reviewed",
          reviewed_at: new Date().toISOString(),
          reviewed_by: sessionUser.id,
        })
        .eq("id", enquiryId);

      if (error) throw error;

      setStatus({
        type: "success",
        message: "Anfrage als geprüft markiert.",
      });

      await loadEnquiries();
    } catch (error) {
      setStatus({
        type: "error",
        message: error?.message || "Anfrage konnte nicht aktualisiert werden.",
      });
    }
  }

  async function handleApproveMember(memberId) {
    resetStatus();
    if (!supabase) return;

    const selectedRole = memberRoleDrafts[memberId] || "member";

    try {
      const { error } = await supabase
        .from("member_profiles")
        .update({
          approved: true,
          role: selectedRole,
        })
        .eq("id", memberId);

      if (error) throw error;

      setStatus({
        type: "success",
        message: "Mitglied erfolgreich freigegeben.",
      });

      await loadMemberProfilesAdmin();
    } catch (error) {
      setStatus({
        type: "error",
        message: error?.message || "Freigabe fehlgeschlagen.",
      });
    }
  }

  async function handleUpdateMemberRole(memberId) {
    resetStatus();
    if (!supabase) return;

    const selectedRole = memberRoleDrafts[memberId] || "member";

    try {
      const { error } = await supabase
        .from("member_profiles")
        .update({ role: selectedRole })
        .eq("id", memberId);

      if (error) throw error;

      setStatus({
        type: "success",
        message: "Mitgliedsrolle erfolgreich aktualisiert.",
      });

      await loadMemberProfilesAdmin();
    } catch (error) {
      setStatus({
        type: "error",
        message: error?.message || "Rolle konnte nicht gespeichert werden.",
      });
    }
  }

  async function handleCreateProfile(userId, userEmail) {
    resetStatus();
    if (!supabase) return;

    const defaultName = userEmail
      ? userEmail.split("@")[0].replace(/[._-]/g, " ")
      : "Member";

    const selectedRole = memberRoleDrafts[userId] || "member";

    try {
      const { error } = await supabase.from("member_profiles").insert({
        id: userId,
        full_name: defaultName,
        role: selectedRole,
        approved: false,
      });

      if (error) throw error;

      setStatus({
        type: "success",
        message: "Profil erfolgreich erstellt.",
      });

      await loadMemberProfilesAdmin();
      await loadAuthUsersAdmin();
    } catch (error) {
      setStatus({
        type: "error",
        message: error?.message || "Profil konnte nicht erstellt werden.",
      });
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

  if (!authorized) return null;

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-12 text-[#e8dcc0]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#b6924f]">
              The Heritage Drivers
            </p>
            <h1 className="mt-4 text-4xl text-[#f2e6cf]">Admin Zentrale</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#bcb09a]">
              Zentrale Verwaltung von Seiteninhalten, Mitgliedsanfragen und
              Mitgliedern.
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
              onClick={reloadAll}
              disabled={loadingPages || enquiriesLoading || membersLoading}
              className="inline-flex items-center gap-2 rounded-full border border-[#b6924f] px-5 py-3 text-sm uppercase tracking-[0.2em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black disabled:opacity-70"
            >
              <RefreshCw className="h-4 w-4" />
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

          <div className="grid gap-6">
            <section className="rounded-[1.75rem] border border-[#2d2416] bg-[#111111] p-6">
              {!selectedPage ? (
                <div className="rounded-2xl border border-[#4b2a23] bg-[#1a1110] p-5 text-sm text-[#efc5bc]">
                  Für diesen `slug` wurde noch kein Eintrag in `site_pages`
                  gefunden.
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#b6924f]">
                      Seitenbearbeitung
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
                        rows={16}
                        className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none"
                      />
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={handleSavePage}
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

            <section className="rounded-[1.75rem] border border-[#2d2416] bg-[#111111] p-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#b6924f]" />
                <h2 className="text-2xl text-[#f2e6cf]">Mitgliedsanfragen</h2>
              </div>

              {enquiriesLoading ? (
                <p className="mt-6 text-sm text-[#b8ad96]">Lade Anfragen...</p>
              ) : enquiries.length === 0 ? (
                <p className="mt-6 text-sm text-[#b8ad96]">
                  Keine Anfragen vorhanden.
                </p>
              ) : (
                <div className="mt-6 grid gap-4">
                  {enquiries.map((enquiry) => (
                    <div
                      key={enquiry.id}
                      className="rounded-xl border border-[#2d2416] bg-[#131313] p-4"
                    >
                      <p className="text-sm text-[#f2e6cf]">{enquiry.full_name}</p>
                      <p className="mt-1 text-sm text-[#b8ad96]">
                        {enquiry.email}
                      </p>

                      {enquiry.interest_note && (
                        <p className="mt-3 text-sm leading-6 text-[#a99c83]">
                          {enquiry.interest_note}
                        </p>
                      )}

                      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[#8f836d]">
                        Status: {enquiry.status || "new"}
                      </p>

                      {enquiry.status !== "reviewed" && (
                        <button
                          onClick={() => handleMarkEnquiryReviewed(enquiry.id)}
                          className="mt-4 rounded-full border border-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black"
                        >
                          Als geprüft markieren
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-[1.75rem] border border-[#2d2416] bg-[#111111] p-6">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-[#b6924f]" />
                <h2 className="text-2xl text-[#f2e6cf]">Mitgliederverwaltung</h2>
              </div>

              {missingProfileUsers.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg text-[#f2e6cf]">Fehlende Profile</h3>
                  <div className="mt-4 space-y-4">
                    {missingProfileUsers.map((authUser) => (
                      <div
                        key={`missing-${authUser.id}`}
                        className="rounded-xl border border-[#5a4120] bg-[#17120d] p-4"
                      >
                        <p className="text-sm text-[#f2e6cf]">{authUser.email}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#b6924f]">
                          Noch kein Mitgliederprofil
                        </p>

                        <div className="mt-4 space-y-3">
                          <label className="block text-[11px] uppercase tracking-[0.18em] text-[#8f836d]">
                            Rolle
                          </label>
                          <select
                            value={memberRoleDrafts[authUser.id] || "member"}
                            onChange={(e) =>
                              setMemberRoleDrafts((prev) => ({
                                ...prev,
                                [authUser.id]: e.target.value,
                              }))
                            }
                            className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-3 text-[#efe2c5] outline-none"
                          >
                            <option value="member">member</option>
                            <option value="admin">admin</option>
                          </select>

                          <button
                            onClick={() =>
                              handleCreateProfile(authUser.id, authUser.email)
                            }
                            className="rounded-full bg-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-black transition hover:bg-[#c6a45d]"
                          >
                            Profil erstellen
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8">
                <h3 className="text-lg text-[#f2e6cf]">Registrierte Mitglieder</h3>

                {membersLoading ? (
                  <p className="mt-4 text-sm text-[#b8ad96]">Lade Mitglieder...</p>
                ) : memberProfilesAdmin.length === 0 ? (
                  <p className="mt-4 text-sm text-[#b8ad96]">
                    Keine Mitglieder gefunden.
                  </p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {memberProfilesAdmin.map((member) => (
                      <div
                        key={member.id}
                        className="rounded-xl border border-[#2d2416] bg-[#131313] p-4"
                      >
                        <p className="text-sm text-[#f2e6cf]">
                          {member.full_name || member.id}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#8f836d]">
                          {member.approved ? "Freigegeben" : "Ausstehend"}
                        </p>

                        <div className="mt-4 space-y-3">
                          <label className="block text-[11px] uppercase tracking-[0.18em] text-[#8f836d]">
                            Rolle
                          </label>
                          <select
                            value={
                              memberRoleDrafts[member.id] ||
                              member.role ||
                              "member"
                            }
                            onChange={(e) =>
                              setMemberRoleDrafts((prev) => ({
                                ...prev,
                                [member.id]: e.target.value,
                              }))
                            }
                            className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-3 text-[#efe2c5] outline-none"
                          >
                            <option value="member">member</option>
                            <option value="admin">admin</option>
                          </select>

                          <button
                            onClick={() => handleUpdateMemberRole(member.id)}
                            className="rounded-full border border-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black"
                          >
                            Rolle speichern
                          </button>
                        </div>

                        {!member.approved && (
                          <button
                            onClick={() => handleApproveMember(member.id)}
                            className="mt-4 rounded-full bg-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-black transition hover:bg-[#c6a45d]"
                          >
                            Mitglied freigeben
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}