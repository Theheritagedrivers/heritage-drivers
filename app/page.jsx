"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Lock,
  LogOut,
  Mail,
  Shield,
  User,
  UserPlus,
  Wrench,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabaseConfigured =
  SUPABASE_URL.startsWith("https://") && !SUPABASE_URL.includes("YOUR_PROJECT") && !SUPABASE_ANON_KEY.includes("YOUR_PUBLIC");

const supabase = supabaseConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

export default function TheHeritageDriversLandingPage() {
  const [lang, setLang] = useState("en");
  const [showLogin, setShowLogin] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [status, setStatus] = useState({ type: "", message: "" });

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const t = {
    en: {
      nav: ["Society", "Philosophy", "Membership", "Members", "Contact"],
      heroTag: "A Private Drivers Society",
      heroTitle: "Heritage motoring,\nquietly understood.",
      heroText:
        "The Heritage Drivers is a refined circle for those who appreciate the culture, craftsmanship and enduring presence of distinguished motor cars.",
      cta1: "Request Access",
      cta2: "Discover More",
      tags: ["Motor Cars", "Culture", "Craftsmanship", "Taste"],
      philosophyTitle: "Not every motor car needs explanation.",
      membershipTitle: "Admission is intended to be considered, not crowded.",
      membershipText:
        "Membership enquiries may be submitted discreetly. The society is envisioned as selective, personal and founded on shared standards of taste, conduct and mechanical appreciation.",
      form: {
        name: "Name",
        email: "Email",
        message: "A brief note about your interest",
        submit: "Submit Enquiry",
      },
      login: {
        button: "Member Login",
        title: "Members Access",
        subtitle: "Reserved for registered members of the society.",
        email: "Email address",
        password: "Password",
        fullName: "Full name",
        submit: "Sign In",
        signUp: "Create Account",
        note: "Private access only.",
        close: "Close",
        switchToLogin: "Already registered? Sign in",
        switchToSignup: "New member? Create access",
        forgot: "Use password reset via Supabase later if desired.",
      },
      members: {
        label: "Members",
        title: "Private Members Area",
        subtitle: "A discreet section for members, events and society information.",
        welcome: "Welcome back",
        intro:
          "Your account is now protected by Supabase authentication. Member data can be extended with events, directories and protected content.",
        eventTitle: "Upcoming Drive",
        eventText: "Season Opening · 18.04.2026 · Private confirmation required.",
        registryTitle: "Members Notes",
        registryText: "Discreet updates, club notices and society correspondence.",
        atelierTitle: "Technical Circle",
        atelierText: "Selected workshop evenings, heritage discussions and mechanical exchange.",
        secure: "Protected access",
        signOut: "Sign Out",
        preview: "Preview access",
        signedInAs: "Signed in as",
      },
      setup: {
        title: "Supabase setup required",
        text:
          "Replace the placeholder Supabase URL and anon key in the code to activate real authentication, password protection and database-backed user accounts.",
      },
      messages: {
        loginSuccess: "Login successful.",
        signupSuccess: "Account created. Please check your email to confirm your registration.",
        logoutSuccess: "You have been signed out.",
        genericError: "Something went wrong. Please review the configuration and try again.",
      },
    },
    de: {
      nav: ["Gesellschaft", "Philosophie", "Mitgliedschaft", "Mitglieder", "Kontakt"],
      heroTag: "Eine private Fahrergesellschaft",
      heroTitle: "Automobile Kultur,\nstill verstanden.",
      heroText:
        "The Heritage Drivers ist ein erlesener Kreis für jene, die Kultur, Handwerkskunst und die zeitlose Präsenz aussergewöhnlicher Automobile zu schätzen wissen.",
      cta1: "Anfrage stellen",
      cta2: "Mehr erfahren",
      tags: ["Automobile", "Kultur", "Handwerk", "Stil"],
      philosophyTitle: "Nicht jedes Automobil bedarf einer Erklärung.",
      membershipTitle: "Zugang ist bewusst gewählt – nicht breit verteilt.",
      membershipText:
        "Mitgliedsanfragen können diskret eingereicht werden. Die Gesellschaft ist selektiv, persönlich und basiert auf gemeinsamen Werten wie Stil, Haltung und technischem Verständnis.",
      form: {
        name: "Name",
        email: "E-Mail",
        message: "Kurze Beschreibung Ihres Interesses",
        submit: "Anfrage senden",
      },
      login: {
        button: "Mitglieder-Login",
        title: "Mitgliederbereich",
        subtitle: "Ausschliesslich für registrierte Mitglieder der Gesellschaft.",
        email: "E-Mail-Adresse",
        password: "Passwort",
        fullName: "Vollständiger Name",
        submit: "Anmelden",
        signUp: "Konto erstellen",
        note: "Zugang nur für berechtigte Mitglieder.",
        close: "Schliessen",
        switchToLogin: "Bereits registriert? Anmelden",
        switchToSignup: "Neues Mitglied? Zugang erstellen",
        forgot: "Passwort-Reset kann später über Supabase ergänzt werden.",
      },
      members: {
        label: "Mitglieder",
        title: "Privater Mitgliederbereich",
        subtitle: "Ein diskreter Bereich für Mitglieder, Veranstaltungen und Gesellschaftsinformationen.",
        welcome: "Willkommen zurück",
        intro:
          "Ihr Konto ist nun über Supabase-Authentifizierung geschützt. Mitgliederdaten können später um Events, Verzeichnisse und geschützte Inhalte erweitert werden.",
        eventTitle: "Nächste Ausfahrt",
        eventText: "Season Opening · 18.04.2026 · Teilnahme nur nach Bestätigung.",
        registryTitle: "Mitteilungen",
        registryText: "Diskrete Updates, Club-Hinweise und Korrespondenz der Gesellschaft.",
        atelierTitle: "Technischer Zirkel",
        atelierText: "Ausgewählte Werkstattabende, Heritage-Gespräche und mechanischer Austausch.",
        secure: "Geschützter Zugang",
        signOut: "Abmelden",
        preview: "Vorschauzugang",
        signedInAs: "Angemeldet als",
      },
      setup: {
        title: "Supabase-Einrichtung erforderlich",
        text:
          "Ersetzen Sie die Platzhalter für Supabase URL und Anon Key im Code, damit echte Authentifizierung, Passwortschutz und datenbankgestützte Benutzerkonten aktiv werden.",
      },
      messages: {
        loginSuccess: "Anmeldung erfolgreich.",
        signupSuccess: "Konto erstellt. Bitte bestätigen Sie Ihre Registrierung über die E-Mail.",
        logoutSuccess: "Sie wurden abgemeldet.",
        genericError: "Etwas ist schiefgelaufen. Bitte prüfen Sie die Konfiguration und versuchen Sie es erneut.",
      },
    },
  };

  const content = t[lang];
  const isLoggedIn = !!session;

  const memberName = useMemo(() => {
    if (profile?.full_name) return profile.full_name;
    const sessionEmail = session?.user?.email || email;
    if (!sessionEmail) return lang === "en" ? "Member" : "Mitglied";
    return sessionEmail.split("@")[0].replace(/[._-]/g, " ");
  }, [profile, session, email, lang]);

  useEffect(() => {
    if (!supabase) {
      setInitializing(false);
      return;
    }

    let mounted = true;

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;
      setSession(session);

      if (session?.user) {
        await loadProfile(session.user.id);
      }

      setInitializing(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!mounted) return;
      setSession(currentSession);
      if (currentSession?.user) {
        await loadProfile(currentSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId) => {
    if (!supabase || !userId) return;

    const { data, error } = await supabase.from("member_profiles").select("id, full_name, role").eq("id", userId).single();

    if (!error && data) {
      setProfile(data);
    }
  };

  const resetStatus = () => setStatus({ type: "", message: "" });

  const handleLogin = async () => {
    resetStatus();
    if (!supabase) {
      setStatus({ type: "error", message: content.setup.text });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setStatus({ type: "error", message: error.message || content.messages.genericError });
      return;
    }

    setStatus({ type: "success", message: content.messages.loginSuccess });
    setShowLogin(false);
    setPassword("");
  };

  const handleSignup = async () => {
    resetStatus();
    if (!supabase) {
      setStatus({ type: "error", message: content.setup.text });
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setLoading(false);
      setStatus({ type: "error", message: error.message || content.messages.genericError });
      return;
    }

    if (data.user?.id) {
      await supabase.from("member_profiles").upsert({
        id: data.user.id,
        full_name: fullName,
        role: "member",
      });
    }

    setLoading(false);
    setStatus({ type: "success", message: content.messages.signupSuccess });
    setAuthMode("login");
    setPassword("");
  };

  const handleLogout = async () => {
    resetStatus();
    if (!supabase) {
      setSession(null);
      setProfile(null);
      return;
    }

    await supabase.auth.signOut();
    setProfile(null);
    setPassword("");
    setStatus({ type: "success", message: content.messages.logoutSuccess });
  };

  const StatusBanner = () =>
    status.message ? (
      <div
        className={`mb-8 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
          status.type === "success"
            ? "border-[#3f4d29] bg-[#161d10] text-[#d9e8bb]"
            : "border-[#4b2a23] bg-[#1a1110] text-[#efc5bc]"
        }`}
      >
        {status.type === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4" /> : <AlertCircle className="mt-0.5 h-4 w-4" />}
        <span>{status.message}</span>
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8dcc0]">
      <header className="border-b border-[#2a2213]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="The Heritage Drivers" className="h-10 w-10 object-contain" />
            <div>
              <div className="text-xs uppercase tracking-[0.4em] text-[#b6924f]">The Heritage Drivers</div>
              <div className="text-sm text-[#a89c84]">Motor Cars & Culture</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden items-center gap-8 text-sm md:flex">
              {content.nav.map((n) => (
                <span key={n}>{n}</span>
              ))}
              {!isLoggedIn ? (
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setShowLogin(true);
                  }}
                  className="hidden rounded-full border border-[#3b311d] px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#e8dcc0] transition hover:border-[#b6924f] hover:text-white md:inline-flex"
                >
                  {content.login.button}
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="hidden items-center gap-2 rounded-full border border-[#3b311d] px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#e8dcc0] transition hover:border-[#b6924f] hover:text-white md:inline-flex"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  {content.members.signOut}
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

      <main className="mx-auto max-w-7xl px-6 py-20">
        <StatusBanner />

        {!supabaseConfigured && (
          <div className="mb-10 rounded-[1.75rem] border border-[#4b2f20] bg-[#16100d] p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[#b6924f]">{content.setup.title}</p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#cfbea3]">{content.setup.text}</p>
          </div>
        )}

        <section>
          <div className="mb-10 flex justify-center">
            <img src="/logo.png" alt="The Heritage Drivers" className="h-40 object-contain" />
          </div>
          <p className="text-sm uppercase tracking-[0.4em] text-[#b6924f]">{content.heroTag}</p>

          <h1 className="mt-6 text-5xl leading-tight text-[#f2e6cf]">
            {content.heroTitle.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </h1>

          <p className="mt-6 max-w-xl text-lg text-[#bcb09a]">{content.heroText}</p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button className="bg-[#b6924f] px-6 py-3 text-black">{content.cta1}</button>
            <button className="border border-[#b6924f] px-6 py-3">{content.cta2}</button>
            {!isLoggedIn && (
              <button
                onClick={() => {
                  setAuthMode("login");
                  setShowLogin(true);
                }}
                className="border border-[#3b311d] px-6 py-3 text-[#e8dcc0]"
              >
                {content.login.button}
              </button>
            )}
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm uppercase text-[#8b7e65]">
            {content.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </section>

        <section className="mt-24 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl text-[#f0e3c6]">{content.philosophyTitle}</h2>
          </div>
          <div className="rounded-[2rem] border border-[#2d2416] bg-[#111111] p-8">
            <div className="flex items-center gap-3">
              <div className="rounded-full border border-[#3a2f1c] p-3">
                <User className="h-5 w-5 text-[#b6924f]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#b6924f]">{content.members.label}</p>
                <p className="mt-2 text-sm text-[#b9ad95]">{content.login.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setAuthMode("login");
                setShowLogin(true);
              }}
              className="mt-6 rounded-full border border-[#b6924f] px-5 py-3 text-sm uppercase tracking-[0.24em] text-[#f0e3c6] transition hover:bg-[#b6924f] hover:text-black"
            >
              {content.login.button}
            </button>
          </div>
        </section>

        <section className="mt-24">
          <h2 className="text-3xl text-[#f0e3c6]">{content.membershipTitle}</h2>
          <p className="mt-6 max-w-xl text-[#bcb09a]">{content.membershipText}</p>

          <div className="mt-10 max-w-md space-y-4">
            <input placeholder={content.form.name} className="w-full border border-[#342a1a] bg-black p-3 text-[#efe2c5]" />
            <input placeholder={content.form.email} className="w-full border border-[#342a1a] bg-black p-3 text-[#efe2c5]" />
            <textarea placeholder={content.form.message} className="w-full border border-[#342a1a] bg-black p-3 text-[#efe2c5]" />
            <button className="w-full bg-[#b6924f] px-6 py-3 text-black">{content.form.submit}</button>
          </div>
        </section>

        <section className="mt-24" id="members">
          <div className="rounded-[2rem] border border-[#2c2415] bg-[#0f0f0f] p-8 shadow-2xl shadow-black/30">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#b6924f]">{content.members.secure}</p>
                <h2 className="mt-4 text-3xl text-[#f2e6cf]">{content.members.title}</h2>
                <p className="mt-4 max-w-2xl text-[#b8ad96]">{content.members.subtitle}</p>
              </div>
              <div className="flex gap-3">
                {!isLoggedIn ? (
                  <button
                    onClick={() => {
                      setAuthMode("login");
                      setShowLogin(true);
                    }}
                    className="rounded-full border border-[#b6924f] px-5 py-3 text-sm uppercase tracking-[0.22em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black"
                  >
                    {content.login.button}
                  </button>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="rounded-full border border-[#3b311d] px-5 py-3 text-sm uppercase tracking-[0.22em] text-[#f2e6cf] transition hover:border-[#b6924f]"
                  >
                    {content.members.signOut}
                  </button>
                )}
              </div>
            </div>

            {initializing ? (
              <div className="mt-8 flex items-center gap-3 text-[#b8ad96]">
                <Loader2 className="h-5 w-5 animate-spin text-[#b6924f]" />
                <span>Loading member access...</span>
              </div>
            ) : !isLoggedIn ? (
              <div className="mt-8 grid gap-6 lg:grid-cols-3">
                {[
                  { icon: Shield, title: content.members.preview, text: content.members.intro },
                  { icon: Calendar, title: content.members.eventTitle, text: content.members.eventText },
                  { icon: Wrench, title: content.members.atelierTitle, text: content.members.atelierText },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-[1.5rem] border border-[#2d2416] bg-[#131313] p-6">
                      <Icon className="h-5 w-5 text-[#b6924f]" />
                      <h3 className="mt-4 text-lg text-[#f2e6cf]">{item.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-[#a99c83]">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[1.75rem] border border-[#2d2416] bg-[#131313] p-8">
                  <p className="text-xs uppercase tracking-[0.35em] text-[#b6924f]">{content.members.welcome}</p>
                  <h3 className="mt-4 text-2xl text-[#f2e6cf]">{memberName}</h3>
                  <p className="mt-2 text-sm text-[#9f927b]">
                    {content.members.signedInAs}: {session?.user?.email}
                  </p>
                  <p className="mt-4 max-w-2xl text-[#b8ad96]">{content.members.intro}</p>
                </div>

                <div className="grid gap-6">
                  {[
                    { icon: Calendar, title: content.members.eventTitle, text: content.members.eventText },
                    { icon: Mail, title: content.members.registryTitle, text: content.members.registryText },
                    { icon: Wrench, title: content.members.atelierTitle, text: content.members.atelierText },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="rounded-[1.5rem] border border-[#2d2416] bg-[#131313] p-6">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-[#b6924f]" />
                          <h3 className="text-lg text-[#f2e6cf]">{item.title}</h3>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-[#a99c83]">{item.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {showLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[2rem] border border-[#3a2f1b] bg-[#0d0d0d] p-8 shadow-2xl shadow-black/40">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#b6924f]">The Heritage Drivers</p>
                  <h3 className="mt-3 text-2xl text-[#f0e3c6]">{content.login.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#ad9f86]">{content.login.subtitle}</p>
                </div>
                <button
                  onClick={() => setShowLogin(false)}
                  className="rounded-full border border-[#332818] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#b7aa90] hover:border-[#b6924f] hover:text-white"
                >
                  {content.login.close}
                </button>
              </div>

              <div className="mt-8 space-y-4">
                {authMode === "signup" && (
                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c7e65]" />
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={content.login.fullName}
                      className="w-full rounded-2xl border border-[#342a1a] bg-black/60 py-4 pl-11 pr-4 text-[#efe2c5] outline-none placeholder:text-[#796c56] focus:border-[#b6924f]"
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c7e65]" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={content.login.email}
                    className="w-full rounded-2xl border border-[#342a1a] bg-black/60 py-4 pl-11 pr-4 text-[#efe2c5] outline-none placeholder:text-[#796c56] focus:border-[#b6924f]"
                  />
                </div>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c7e65]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={content.login.password}
                    className="w-full rounded-2xl border border-[#342a1a] bg-black/60 py-4 pl-11 pr-4 text-[#efe2c5] outline-none placeholder:text-[#796c56] focus:border-[#b6924f]"
                  />
                </div>

                <button
                  onClick={authMode === "login" ? handleLogin : handleSignup}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#b6924f] px-6 py-4 text-sm uppercase tracking-[0.28em] text-black transition hover:bg-[#c6a45d] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {authMode === "login" ? content.login.submit : content.login.signUp}
                </button>

                <button
                  onClick={() => {
                    resetStatus();
                    setAuthMode(authMode === "login" ? "signup" : "login");
                  }}
                  className="w-full text-sm text-[#cdbd9f] underline underline-offset-4 hover:text-white"
                >
                  {authMode === "login" ? content.login.switchToSignup : content.login.switchToLogin}
                </button>

                <p className="text-center text-xs text-[#7f735c]">{content.login.forgot}</p>
                <p className="text-center text-xs uppercase tracking-[0.25em] text-[#7f735c]">{content.login.note}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
