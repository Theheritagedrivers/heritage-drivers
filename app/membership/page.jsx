"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Lock,
  LogOut,
  Mail,
  User,
  FileText,
  Shield,
  Users,
  Save,
  Pencil,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabaseConfigured =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("YOUR_PROJECT") &&
  !SUPABASE_ANON_KEY.includes("YOUR_PUBLIC");

const supabase = supabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const fallbackContent = {
  en: {
    backHome: "← Back to Home",
    pageEyebrow: "The Heritage Drivers",
    pageTitle: "Membership",
    introTitle: "Membership",
    introText1:
      "Membership is intended to remain personal, selective and discreet. The Heritage Drivers is not designed as a volume-based organisation, but as a considered circle of individuals united by shared standards of conduct, taste and automotive appreciation.",
    introText2:
      "Prospective members are encouraged to approach the society with a genuine interest in heritage motoring, civilised company and the preservation of quality. Ownership of a particular marque is less important than the manner in which one participates.",
    introText3:
      "Admission may take place gradually and by personal contact. The aim is to maintain a welcoming yet coherent atmosphere in which the right people may meet, drive and contribute with ease.",
    conductTitle: "Terms of Conduct",
    conductText1:
      "Members are expected to conduct themselves with courtesy, discretion and respect toward fellow members, guests and the wider public.",
    conductText2:
      "The society values tasteful behaviour and does not seek noise, vanity, unnecessary rivalry or theatrical display.",
    conductText3:
      "Motor cars presented within the circle should be maintained in a manner consistent with safety, mechanical sympathy and respect for heritage.",
    conductText4:
      "Conversation, humour and differing views are welcome; arrogance, provocation and discourtesy are not.",
    conductText5:
      "Events, routes, private information and member details should be treated with appropriate discretion.",
    conductText6:
      "Participation in the society should support an atmosphere that is calm, well-mannered and enjoyable for all concerned.",
    conductText7:
      "The society reserves the right to decline or discontinue membership where conduct is inconsistent with its spirit and standards.",
    boardTitle: "Board Members",
    boardIntro:
      "The society is represented by a small and focused board, intended to keep administration personal, efficient and close to the spirit of the club.",
    boardMember1Name: "Simon Frieden",
    boardMember1Role: "Founder / Board",
    boardMember1Text:
      "Responsible for concept, culture, club direction and heritage motoring activities.",
    boardMember2Name: "Board Member",
    boardMember2Role: "Board",
    boardMember2Text:
      "Supporting club development, coordination and selected administrative matters.",
    boardMember3Name: "Board Member",
    boardMember3Role: "Board",
    boardMember3Text:
      "Contributing to continuity, member contact and discreet internal support.",
    enquiriesTitle: "Membership Enquiries",
    enquiriesText:
      "Enquiries may be submitted discreetly. Formal access and internal participation are subject to review and approval.",
    secureTitle: "Protected Members Area",
    secureSubtitle:
      "Reserved for approved members of the society.",
    internalTitle: "Internal Club Documents",
    internalText:
      "Approved members may access statutes, annual accounts and selected internal documents of the society.",
    statutesTitle: "Club Statutes",
    statutesText:
      "Founding principles, structure, standards and internal rules of the society.",
    statutesLinkLabel: "Open statutes",
    annualTitle: "Annual Accounts",
    annualText:
      "Selected annual figures and financial overview for internal member review.",
    annualLinkLabel: "Open annual accounts",
    internalNotesTitle: "Members Information",
    internalNotesText:
      "Internal notices, governance information and confidential member documents.",
    internalNotesLinkLabel: "Open internal documents",
    loginTitle: "Members Access",
    loginSubtitle: "Reserved for registered members of the society.",
    loginFullName: "Full name",
    loginEmail: "Email address",
    loginPassword: "Password",
    loginSubmit: "Sign In",
    signupSubmit: "Create Account",
    loginClose: "Close",
    switchToLogin: "Already registered? Sign in",
    switchToSignup: "New member? Create access",
    loginButton: "Member Login",
    loginForgot: "Password reset can be added via Supabase if desired.",
    loginNote: "Private access only.",
    approvalPendingTitle: "Membership Awaiting Approval",
    approvalPendingText:
      "Your account has been created successfully. Access to the private members area is granted manually once your membership has been reviewed and approved.",
    logout: "Sign Out",
    modify: "Modify",
    save: "Save",
    cancel: "Cancel",
  },
  de: {
    backHome: "← Zurück zur Startseite",
    pageEyebrow: "The Heritage Drivers",
    pageTitle: "Mitgliedschaft",
    introTitle: "Mitgliedschaft",
    introText1:
      "Die Mitgliedschaft soll persönlich, selektiv und diskret bleiben. The Heritage Drivers ist nicht als volumenorientierte Organisation gedacht, sondern als bewusst gewählter Kreis von Menschen mit gemeinsamen Massstäben in Haltung, Stil und automobilen Werten.",
    introText2:
      "Interessenten sind eingeladen, sich mit echtem Interesse an Heritage Motoring, kultivierter Gesellschaft und dem Erhalt automobiler Qualität an die Gesellschaft zu wenden. Nicht die Marke allein ist entscheidend, sondern die Art der Teilnahme.",
    introText3:
      "Die Aufnahme kann schrittweise und über persönlichen Kontakt erfolgen. Ziel ist eine einladende, aber stimmige Atmosphäre, in der sich die richtigen Menschen begegnen, fahren und ihren Beitrag leisten können.",
    conductTitle: "Grundsätze & Verhalten",
    conductText1:
      "Von Mitgliedern wird erwartet, dass sie sich gegenüber anderen Mitgliedern, Gästen und der Öffentlichkeit höflich, diskret und respektvoll verhalten.",
    conductText2:
      "Die Gesellschaft schätzt Stil und Haltung und sucht weder Lärm noch Eitelkeit, unnötige Rivalität oder theatralische Selbstdarstellung.",
    conductText3:
      "Fahrzeuge innerhalb des Kreises sollen in einer Weise unterhalten werden, die Sicherheit, mechanisches Verständnis und Respekt vor dem automobilen Erbe erkennen lässt.",
    conductText4:
      "Gespräche, Humor und unterschiedliche Ansichten sind willkommen; Arroganz, Provokation und Unhöflichkeit nicht.",
    conductText5:
      "Veranstaltungen, Routen, private Informationen und Mitgliederdaten sind mit angemessener Diskretion zu behandeln.",
    conductText6:
      "Die Teilnahme an der Gesellschaft soll eine ruhige, gepflegte und für alle angenehme Atmosphäre unterstützen.",
    conductText7:
      "Die Gesellschaft behält sich vor, eine Mitgliedschaft abzulehnen oder zu beenden, wenn das Verhalten nicht mit Geist und Standards des Kreises vereinbar ist.",
    boardTitle: "Vorstandsmitglieder",
    boardIntro:
      "Die Gesellschaft wird durch einen kleinen, fokussierten Vorstand getragen, um die Organisation persönlich, effizient und nahe am Geist des Clubs zu halten.",
    boardMember1Name: "Simon Frieden",
    boardMember1Role: "Gründer / Vorstand",
    boardMember1Text:
      "Verantwortlich für Konzept, Kultur, Clubausrichtung und die Heritage-Motoring-Aktivitäten.",
    boardMember2Name: "Vorstandsmitglied",
    boardMember2Role: "Vorstand",
    boardMember2Text:
      "Unterstützt die Weiterentwicklung des Clubs, die Koordination und ausgewählte administrative Belange.",
    boardMember3Name: "Vorstandsmitglied",
    boardMember3Role: "Vorstand",
    boardMember3Text:
      "Trägt zur Kontinuität, Mitgliederbetreuung und diskreten internen Unterstützung bei.",
    enquiriesTitle: "Mitgliedschaftsanfragen",
    enquiriesText:
      "Anfragen können diskret eingereicht werden. Formeller Zugang und interne Teilnahme erfolgen nach Prüfung und Freigabe.",
    secureTitle: "Geschützter Mitgliederbereich",
    secureSubtitle:
      "Ausschliesslich für freigegebene Mitglieder der Gesellschaft.",
    internalTitle: "Interne Club-Dokumente",
    internalText:
      "Freigegebene Mitglieder erhalten Zugang zu Statuten, Jahresrechnungen und ausgewählten internen Dokumenten der Gesellschaft.",
    statutesTitle: "Clubstatuten",
    statutesText:
      "Gründungsgrundsätze, Struktur, Standards und interne Regeln der Gesellschaft.",
    statutesLinkLabel: "Statuten öffnen",
    annualTitle: "Jahresabrechnung",
    annualText:
      "Ausgewählte Jahreszahlen und finanzieller Überblick zur internen Einsicht für Mitglieder.",
    annualLinkLabel: "Jahresabrechnung öffnen",
    internalNotesTitle: "Mitgliederinformationen",
    internalNotesText:
      "Interne Hinweise, Governance-Informationen und vertrauliche Dokumente für Mitglieder.",
    internalNotesLinkLabel: "Interne Dokumente öffnen",
    loginTitle: "Mitgliederbereich",
    loginSubtitle:
      "Ausschliesslich für registrierte Mitglieder der Gesellschaft.",
    loginFullName: "Vollständiger Name",
    loginEmail: "E-Mail-Adresse",
    loginPassword: "Passwort",
    loginSubmit: "Anmelden",
    signupSubmit: "Konto erstellen",
    loginClose: "Schliessen",
    switchToLogin: "Bereits registriert? Anmelden",
    switchToSignup: "Neues Mitglied? Zugang erstellen",
    loginButton: "Mitglieder-Login",
    loginForgot: "Passwort-Reset kann später über Supabase ergänzt werden.",
    loginNote: "Zugang nur für berechtigte Mitglieder.",
    approvalPendingTitle: "Mitgliedschaft in Prüfung",
    approvalPendingText:
      "Ihr Konto wurde erfolgreich erstellt. Der Zugang zum privaten Mitgliederbereich wird nach Prüfung und Freigabe Ihrer Mitgliedschaft manuell erteilt.",
    logout: "Abmelden",
    modify: "Ändern",
    save: "Speichern",
    cancel: "Abbrechen",
  },
};

const uiMessages = {
  en: {
    loginSuccess: "Login successful.",
    signupSuccess:
      "Account created. Please check your email to confirm your registration.",
    logoutSuccess: "You have been signed out.",
    genericError:
      "Something went wrong. Please review the configuration and try again.",
    notAuthorized: "Not authorized to perform this action.",
    setupTitle: "Supabase setup required",
    setupText:
      "Replace the placeholder Supabase URL and anon key in the code to activate real authentication, password protection and database-backed user accounts.",
    contentUpdateSuccess: "Content updated successfully.",
  },
  de: {
    loginSuccess: "Anmeldung erfolgreich.",
    signupSuccess:
      "Konto erstellt. Bitte bestätigen Sie Ihre Registrierung über die E-Mail.",
    logoutSuccess: "Sie wurden abgemeldet.",
    genericError:
      "Etwas ist schiefgelaufen. Bitte prüfen Sie die Konfiguration und versuchen Sie es erneut.",
    notAuthorized: "Keine Berechtigung für diese Aktion.",
    setupTitle: "Supabase-Einrichtung erforderlich",
    setupText:
      "Ersetzen Sie die Platzhalter für Supabase URL und Anon Key im Code, damit echte Authentifizierung, Passwortschutz und datenbankgestützte Benutzerkonten aktiv werden.",
    contentUpdateSuccess: "Inhalt erfolgreich aktualisiert.",
  },
};

function TextEditorControls({
  isAdmin,
  isEditing,
  onModify,
  onSave,
  onCancel,
  modifyLabel,
  saveLabel,
  cancelLabel,
}) {
  if (!isAdmin) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {!isEditing ? (
        <button
          type="button"
          onClick={onModify}
          className="inline-flex items-center gap-2 rounded-full border border-[#b6924f] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#f2e6cf]"
        >
          <Pencil className="h-3 w-3" />
          {modifyLabel}
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={onSave}
            className="rounded-full bg-[#b6924f] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-black"
          >
            {saveLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[#3b311d] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#f2e6cf]"
          >
            {cancelLabel}
          </button>
        </>
      )}
    </div>
  );
}

function EditableText({
  isAdmin,
  value,
  onSave,
  multiline = false,
  className = "",
  as = "div",
  modifyLabel,
  saveLabel,
  cancelLabel,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");
  const Tag = as;

  useEffect(() => {
    if (!isEditing) setDraft(value || "");
  }, [value, isEditing]);

  return (
    <div>
      {!isEditing ? (
        <Tag className={className}>
          {multiline
            ? (value || "").split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))
            : value}
        </Tag>
      ) : multiline ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="min-h-[110px] w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none"
        />
      ) : (
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-3 text-[#efe2c5] outline-none"
        />
      )}

      <TextEditorControls
        isAdmin={isAdmin}
        isEditing={isEditing}
        onModify={() => setIsEditing(true)}
        onSave={async () => {
          await onSave(draft);
          setIsEditing(false);
        }}
        onCancel={() => {
          setDraft(value || "");
          setIsEditing(false);
        }}
        modifyLabel={modifyLabel}
        saveLabel={saveLabel}
        cancelLabel={cancelLabel}
      />
    </div>
  );
}

export default function MembershipPage() {
  const [lang, setLang] = useState("de");
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [websiteContent, setWebsiteContent] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [initializing, setInitializing] = useState(true);

  const [showLogin, setShowLogin] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const messages = uiMessages[lang];
  const isLoggedIn = !!session;
  const isAdmin = profile?.role === "admin";
  const isApproved = profile?.approved === true;
  const hasMemberAccess = isLoggedIn && (isApproved || isAdmin);

  const tc = (key) => {
    const saved = websiteContent?.[lang]?.[key];
    const fallback = fallbackContent?.[lang]?.[key];
    return saved || fallback || "";
  };

  const resetStatus = () => setStatus({ type: "", message: "" });

  const saveContentField = async (key, value) => {
    if (!supabase || !session?.user || !isAdmin) return;

    const { error } = await supabase.from("website_content").upsert(
      {
        content_key: `membership_${key}`,
        lang,
        content_value: value,
        updated_by: session.user.id,
      },
      { onConflict: "content_key,lang" }
    );

    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }

    setWebsiteContent((prev) => ({
      ...prev,
      [lang]: {
        ...(prev[lang] || {}),
        [key]: value,
      },
    }));

    setStatus({ type: "success", message: messages.contentUpdateSuccess });
  };

  const loadWebsiteContent = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("website_content")
      .select("content_key, lang, content_value")
      .like("content_key", "membership_%");

    if (error || !data) return;

    const next = {};
    for (const row of data) {
      const cleanKey = row.content_key.replace(/^membership_/, "");
      if (!next[row.lang]) next[row.lang] = {};
      next[row.lang][cleanKey] = row.content_value;
    }
    setWebsiteContent(next);
  };

  const loadProfile = async (userId) => {
    if (!supabase || !userId) {
      setProfile(null);
      setProfileLoaded(true);
      return null;
    }

    const { data, error } = await supabase
      .from("member_profiles")
      .select("id, full_name, role, approved")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      setProfile(null);
      setProfileLoaded(true);
      return null;
    }

    setProfile(data || null);
    setProfileLoaded(true);
    return data || null;
  };

  useEffect(() => {
    if (!supabase) {
      setInitializing(false);
      return;
    }

    let mounted = true;

    const init = async () => {
      await loadWebsiteContent();

      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (currentSession?.user && currentUser) {
        const mergedSession = {
          ...currentSession,
          user: currentUser,
        };
        setSession(mergedSession);
        await loadProfile(mergedSession.user.id);
      } else {
        setSession(null);
        setProfile(null);
        setProfileLoaded(true);
      }

      if (mounted) setInitializing(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!mounted) return;

      if (currentSession?.user) {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        const mergedSession = currentUser
          ? { ...currentSession, user: currentUser }
          : currentSession;

        setSession(mergedSession);
        setProfileLoaded(false);
        await loadProfile(mergedSession.user.id);
      } else {
        setSession(null);
        setProfile(null);
        setProfileLoaded(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    resetStatus();

    if (!supabase) {
      setStatus({ type: "error", message: messages.setupText });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      setStatus({
        type: "error",
        message: error.message || messages.genericError,
      });
      return;
    }

    setStatus({ type: "success", message: messages.loginSuccess });
    setShowLogin(false);
    setPassword("");
  };

  const handleSignup = async () => {
    resetStatus();

    if (!supabase) {
      setStatus({ type: "error", message: messages.setupText });
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() },
      },
    });

    if (error) {
      setLoading(false);
      setStatus({
        type: "error",
        message: error.message || messages.genericError,
      });
      return;
    }

    if (data.user?.id) {
      await supabase.from("member_profiles").insert({
        id: data.user.id,
        full_name: fullName.trim(),
        role: "member",
        approved: false,
      });
    }

    setLoading(false);
    setStatus({ type: "success", message: messages.signupSuccess });
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

    const { error } = await supabase.auth.signOut();

    if (error) {
      setStatus({
        type: "error",
        message: error.message || messages.genericError,
      });
      return;
    }

    setSession(null);
    setProfile(null);
    setStatus({ type: "success", message: messages.logoutSuccess });
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
          <span>{lang === "de" ? "Initialisierung..." : "Initializing..."}</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-20 text-[#e8dcc0]">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-block text-sm uppercase tracking-[0.25em] text-[#b6924f] transition hover:text-white"
          >
            {tc("backHome")}
          </Link>

          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              <button
                onClick={() => {
                  resetStatus();
                  setAuthMode("login");
                  setShowLogin(true);
                }}
                className="rounded-full border border-[#3b311d] px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#e8dcc0] transition hover:border-[#b6924f] hover:text-white"
              >
                {tc("loginButton")}
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-[#3b311d] px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#e8dcc0] transition hover:border-[#b6924f] hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" />
                {tc("logout")}
              </button>
            )}

            <button
              onClick={() => setLang(lang === "en" ? "de" : "en")}
              className="border border-[#b6924f] px-3 py-1 text-xs uppercase tracking-widest"
            >
              {lang === "en" ? "DE" : "EN"}
            </button>
          </div>
        </div>

        <StatusBanner />

        {!supabaseConfigured && (
          <div className="mb-10 mt-8 rounded-[1.75rem] border border-[#4b2f20] bg-[#16100d] p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[#b6924f]">
              {messages.setupTitle}
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#cfbea3]">
              {messages.setupText}
            </p>
          </div>
        )}

        <p className="mt-8 text-sm uppercase tracking-[0.35em] text-[#b6924f]">
          {tc("pageEyebrow")}
        </p>

        <EditableText
          isAdmin={isAdmin}
          value={tc("pageTitle")}
          onSave={(v) => saveContentField("pageTitle", v)}
          className="mt-6 text-5xl leading-tight text-[#f2e6cf]"
          as="h1"
          modifyLabel={tc("modify")}
          saveLabel={tc("save")}
          cancelLabel={tc("cancel")}
        />

        <div className="mt-10 rounded-[2rem] border border-[#2d2416] bg-[#111111] p-8">
          <EditableText
            isAdmin={isAdmin}
            value={tc("introTitle")}
            onSave={(v) => saveContentField("introTitle", v)}
            className="text-2xl text-[#f2e6cf]"
            as="h2"
            modifyLabel={tc("modify")}
            saveLabel={tc("save")}
            cancelLabel={tc("cancel")}
          />
          <EditableText
            isAdmin={isAdmin}
            value={tc("introText1")}
            onSave={(v) => saveContentField("introText1", v)}
            className="mt-6 text-lg leading-8 text-[#bcb09a]"
            as="p"
            multiline
            modifyLabel={tc("modify")}
            saveLabel={tc("save")}
            cancelLabel={tc("cancel")}
          />
          <EditableText
            isAdmin={isAdmin}
            value={tc("introText2")}
            onSave={(v) => saveContentField("introText2", v)}
            className="mt-6 leading-8 text-[#a99c83]"
            as="p"
            multiline
            modifyLabel={tc("modify")}
            saveLabel={tc("save")}
            cancelLabel={tc("cancel")}
          />
          <EditableText
            isAdmin={isAdmin}
            value={tc("introText3")}
            onSave={(v) => saveContentField("introText3", v)}
            className="mt-6 leading-8 text-[#a99c83]"
            as="p"
            multiline
            modifyLabel={tc("modify")}
            saveLabel={tc("save")}
            cancelLabel={tc("cancel")}
          />
        </div>

        <div className="mt-10 rounded-[2rem] border border-[#2d2416] bg-[#111111] p-8">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-[#b6924f]" />
            <EditableText
              isAdmin={isAdmin}
              value={tc("conductTitle")}
              onSave={(v) => saveContentField("conductTitle", v)}
              className="text-2xl text-[#f2e6cf]"
              as="h2"
              modifyLabel={tc("modify")}
              saveLabel={tc("save")}
              cancelLabel={tc("cancel")}
            />
          </div>

          <div className="mt-6 space-y-5 text-[#a99c83]">
            {[
              "conductText1",
              "conductText2",
              "conductText3",
              "conductText4",
              "conductText5",
              "conductText6",
              "conductText7",
            ].map((key) => (
              <EditableText
                key={key}
                isAdmin={isAdmin}
                value={tc(key)}
                onSave={(v) => saveContentField(key, v)}
                className="leading-8"
                as="p"
                multiline
                modifyLabel={tc("modify")}
                saveLabel={tc("save")}
                cancelLabel={tc("cancel")}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] border border-[#2d2416] bg-[#111111] p-8">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-[#b6924f]" />
            <EditableText
              isAdmin={isAdmin}
              value={tc("boardTitle")}
              onSave={(v) => saveContentField("boardTitle", v)}
              className="text-2xl text-[#f2e6cf]"
              as="h2"
              modifyLabel={tc("modify")}
              saveLabel={tc("save")}
              cancelLabel={tc("cancel")}
            />
          </div>

          <EditableText
            isAdmin={isAdmin}
            value={tc("boardIntro")}
            onSave={(v) => saveContentField("boardIntro", v)}
            className="mt-6 leading-8 text-[#a99c83]"
            as="p"
            multiline
            modifyLabel={tc("modify")}
            saveLabel={tc("save")}
            cancelLabel={tc("cancel")}
          />

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="rounded-[1.5rem] border border-[#2d2416] bg-[#0f0f0f] p-6"
              >
                <EditableText
                  isAdmin={isAdmin}
                  value={tc(`boardMember${index}Name`)}
                  onSave={(v) => saveContentField(`boardMember${index}Name`, v)}
                  className="text-lg text-[#f2e6cf]"
                  as="h3"
                  modifyLabel={tc("modify")}
                  saveLabel={tc("save")}
                  cancelLabel={tc("cancel")}
                />
                <EditableText
                  isAdmin={isAdmin}
                  value={tc(`boardMember${index}Role`)}
                  onSave={(v) => saveContentField(`boardMember${index}Role`, v)}
                  className="mt-2 text-xs uppercase tracking-[0.2em] text-[#b6924f]"
                  as="p"
                  modifyLabel={tc("modify")}
                  saveLabel={tc("save")}
                  cancelLabel={tc("cancel")}
                />
                <EditableText
                  isAdmin={isAdmin}
                  value={tc(`boardMember${index}Text`)}
                  onSave={(v) => saveContentField(`boardMember${index}Text`, v)}
                  className="mt-4 text-sm leading-7 text-[#a99c83]"
                  as="p"
                  multiline
                  modifyLabel={tc("modify")}
                  saveLabel={tc("save")}
                  cancelLabel={tc("cancel")}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-[1.5rem] border border-[#2d2416] bg-[#111111] p-6">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-[#b6924f]" />
            <EditableText
              isAdmin={isAdmin}
              value={tc("enquiriesTitle")}
              onSave={(v) => saveContentField("enquiriesTitle", v)}
              className="text-lg text-[#f2e6cf]"
              as="h2"
              modifyLabel={tc("modify")}
              saveLabel={tc("save")}
              cancelLabel={tc("cancel")}
            />
          </div>
          <EditableText
            isAdmin={isAdmin}
            value={tc("enquiriesText")}
            onSave={(v) => saveContentField("enquiriesText", v)}
            className="mt-3 text-sm leading-7 text-[#a99c83]"
            as="p"
            multiline
            modifyLabel={tc("modify")}
            saveLabel={tc("save")}
            cancelLabel={tc("cancel")}
          />
        </div>

        {isLoggedIn && profileLoaded && profile && !hasMemberAccess && (
          <div className="mt-10 rounded-[2rem] border border-[#4b2f20] bg-[#16100d] p-8">
            <EditableText
              isAdmin={isAdmin}
              value={tc("approvalPendingTitle")}
              onSave={(v) => saveContentField("approvalPendingTitle", v)}
              className="text-2xl text-[#f2e6cf]"
              as="h2"
              modifyLabel={tc("modify")}
              saveLabel={tc("save")}
              cancelLabel={tc("cancel")}
            />
            <EditableText
              isAdmin={isAdmin}
              value={tc("approvalPendingText")}
              onSave={(v) => saveContentField("approvalPendingText", v)}
              className="mt-4 max-w-2xl text-[#cfbea3]"
              as="p"
              multiline
              modifyLabel={tc("modify")}
              saveLabel={tc("save")}
              cancelLabel={tc("cancel")}
            />
          </div>
        )}

        {hasMemberAccess && (
          <div className="mt-10 rounded-[2rem] border border-[#2d2416] bg-[#111111] p-8">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-[#b6924f]" />
              <div>
                <EditableText
                  isAdmin={isAdmin}
                  value={tc("secureTitle")}
                  onSave={(v) => saveContentField("secureTitle", v)}
                  className="text-2xl text-[#f2e6cf]"
                  as="h2"
                  modifyLabel={tc("modify")}
                  saveLabel={tc("save")}
                  cancelLabel={tc("cancel")}
                />
                <EditableText
                  isAdmin={isAdmin}
                  value={tc("secureSubtitle")}
                  onSave={(v) => saveContentField("secureSubtitle", v)}
                  className="mt-2 text-sm text-[#a99c83]"
                  as="p"
                  multiline
                  modifyLabel={tc("modify")}
                  saveLabel={tc("save")}
                  cancelLabel={tc("cancel")}
                />
              </div>
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-[#2d2416] bg-[#0f0f0f] p-6">
              <EditableText
                isAdmin={isAdmin}
                value={tc("internalTitle")}
                onSave={(v) => saveContentField("internalTitle", v)}
                className="text-xl text-[#f2e6cf]"
                as="h3"
                modifyLabel={tc("modify")}
                saveLabel={tc("save")}
                cancelLabel={tc("cancel")}
              />
              <EditableText
                isAdmin={isAdmin}
                value={tc("internalText")}
                onSave={(v) => saveContentField("internalText", v)}
                className="mt-4 text-sm leading-7 text-[#a99c83]"
                as="p"
                multiline
                modifyLabel={tc("modify")}
                saveLabel={tc("save")}
                cancelLabel={tc("cancel")}
              />

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                <div className="rounded-[1.25rem] border border-[#2d2416] bg-[#131313] p-5">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#b6924f]" />
                    <EditableText
                      isAdmin={isAdmin}
                      value={tc("statutesTitle")}
                      onSave={(v) => saveContentField("statutesTitle", v)}
                      className="text-lg text-[#f2e6cf]"
                      as="h4"
                      modifyLabel={tc("modify")}
                      saveLabel={tc("save")}
                      cancelLabel={tc("cancel")}
                    />
                  </div>
                  <EditableText
                    isAdmin={isAdmin}
                    value={tc("statutesText")}
                    onSave={(v) => saveContentField("statutesText", v)}
                    className="mt-3 text-sm leading-7 text-[#a99c83]"
                    as="p"
                    multiline
                    modifyLabel={tc("modify")}
                    saveLabel={tc("save")}
                    cancelLabel={tc("cancel")}
                  />
                  <div className="mt-4 text-sm text-[#d7bf8a] underline underline-offset-4">
                    {tc("statutesLinkLabel")}
                  </div>
                </div>

                <div className="rounded-[1.25rem] border border-[#2d2416] bg-[#131313] p-5">
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4 text-[#b6924f]" />
                    <EditableText
                      isAdmin={isAdmin}
                      value={tc("annualTitle")}
                      onSave={(v) => saveContentField("annualTitle", v)}
                      className="text-lg text-[#f2e6cf]"
                      as="h4"
                      modifyLabel={tc("modify")}
                      saveLabel={tc("save")}
                      cancelLabel={tc("cancel")}
                    />
                  </div>
                  <EditableText
                    isAdmin={isAdmin}
                    value={tc("annualText")}
                    onSave={(v) => saveContentField("annualText", v)}
                    className="mt-3 text-sm leading-7 text-[#a99c83]"
                    as="p"
                    multiline
                    modifyLabel={tc("modify")}
                    saveLabel={tc("save")}
                    cancelLabel={tc("cancel")}
                  />
                  <div className="mt-4 text-sm text-[#d7bf8a] underline underline-offset-4">
                    {tc("annualLinkLabel")}
                  </div>
                </div>

                <div className="rounded-[1.25rem] border border-[#2d2416] bg-[#131313] p-5">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#b6924f]" />
                    <EditableText
                      isAdmin={isAdmin}
                      value={tc("internalNotesTitle")}
                      onSave={(v) => saveContentField("internalNotesTitle", v)}
                      className="text-lg text-[#f2e6cf]"
                      as="h4"
                      modifyLabel={tc("modify")}
                      saveLabel={tc("save")}
                      cancelLabel={tc("cancel")}
                    />
                  </div>
                  <EditableText
                    isAdmin={isAdmin}
                    value={tc("internalNotesText")}
                    onSave={(v) => saveContentField("internalNotesText", v)}
                    className="mt-3 text-sm leading-7 text-[#a99c83]"
                    as="p"
                    multiline
                    modifyLabel={tc("modify")}
                    saveLabel={tc("save")}
                    cancelLabel={tc("cancel")}
                  />
                  <div className="mt-4 text-sm text-[#d7bf8a] underline underline-offset-4">
                    {tc("internalNotesLinkLabel")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[2rem] border border-[#3a2f1b] bg-[#0d0d0d] p-8 shadow-2xl shadow-black/40">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#b6924f]">
                    The Heritage Drivers
                  </p>
                  <h3 className="mt-3 text-2xl text-[#f0e3c6]">
                    {tc("loginTitle")}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#ad9f86]">
                    {tc("loginSubtitle")}
                  </p>
                </div>

                <button
                  onClick={() => setShowLogin(false)}
                  className="rounded-full border border-[#332818] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#b7aa90] hover:border-[#b6924f] hover:text-white"
                >
                  {tc("loginClose")}
                </button>
              </div>

              <div className="mt-8 space-y-4">
                {authMode === "signup" && (
                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c7e65]" />
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={tc("loginFullName")}
                      className="w-full rounded-2xl border border-[#342a1a] bg-black/60 py-4 pl-11 pr-4 text-[#efe2c5] outline-none placeholder:text-[#796c56] focus:border-[#b6924f]"
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c7e65]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={tc("loginEmail")}
                    className="w-full rounded-2xl border border-[#342a1a] bg-black/60 py-4 pl-11 pr-4 text-[#efe2c5] outline-none placeholder:text-[#796c56] focus:border-[#b6924f]"
                  />
                </div>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c7e65]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={tc("loginPassword")}
                    className="w-full rounded-2xl border border-[#342a1a] bg-black/60 py-4 pl-11 pr-4 text-[#efe2c5] outline-none placeholder:text-[#796c56] focus:border-[#b6924f]"
                  />
                </div>

                <button
                  onClick={authMode === "login" ? handleLogin : handleSignup}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#b6924f] px-6 py-4 text-sm uppercase tracking-[0.28em] text-black transition hover:bg-[#c6a45d] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {authMode === "login" ? tc("loginSubmit") : tc("signupSubmit")}
                </button>

                <button
                  onClick={() => {
                    resetStatus();
                    setAuthMode(authMode === "login" ? "signup" : "login");
                  }}
                  className="w-full text-sm text-[#cdbd9f] underline underline-offset-4 hover:text-white"
                >
                  {authMode === "login"
                    ? tc("switchToSignup")
                    : tc("switchToLogin")}
                </button>

                <p className="text-center text-xs text-[#7f735c]">
                  {tc("loginForgot")}
                </p>
                <p className="text-center text-xs uppercase tracking-[0.25em] text-[#7f735c]">
                  {tc("loginNote")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}