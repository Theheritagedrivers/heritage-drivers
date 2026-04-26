"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Lock,
  LogOut,
  Mail,
  User,
  Wrench,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Archive,
  Image as ImageIcon,
  Paperclip,
  Save,
  Pencil,
  FileText,
} from "lucide-react";
import { supabase, supabaseConfigured } from "@/lib/supabaseClient";

const emptyEventForm = {
  title: "",
  short_description: "",
  long_description: "",
  event_date: "",
  location: "",
  max_participants: "",
  image_url: "",
  attachment_name: "",
  attachment_url: "",
};

const fallbackContent = {
  en: {
    navSociety: "Society",
    navPhilosophy: "Philosophy",
    navMembership: "Membership",
    navAdminPages: "Admin Pages",
    heroTag: "A Private Drivers Society",
    heroTitle: "Heritage motoring,\nquietly understood.",
    heroText:
      "The Heritage Drivers is a refined circle for those who appreciate the culture, craftsmanship and enduring presence of distinguished motor cars.",
    cta1: "Request Access",
    cta2: "Discover More",
    tag1: "Motor Cars",
    tag2: "Culture",
    tag3: "Craftsmanship",
    tag4: "Taste",
    philosophyTitle: "Not every motor car needs explanation.",
    membershipTitle: "Admission is intended to be considered, not crowded.",
    membershipText:
      "Membership enquiries may be submitted discreetly. The society is envisioned as selective, personal and founded on shared standards of taste, conduct and mechanical appreciation.",
    enquiryName: "Name",
    enquiryEmail: "Email",
    enquiryMessage: "A brief note about your interest",
    enquirySubmit: "Submit Enquiry",
    loginButton: "Member Login",
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
    loginForgot: "Password reset can be added via Supabase if desired.",
    loginNote: "Private access only.",
    secureAccess: "Protected access",
    welcome: "Welcome back",
    membersIntro:
      "Your account is protected by Supabase authentication. Member data, events and protected content can be maintained securely.",
    eventCardTitle: "Upcoming Drive",
    eventCardText:
      "Season Opening · 19.04.2026 · Private confirmation required.",
    notesTitle: "Members Notes",
    notesText: "Discreet updates, club notices and society correspondence.",
    atelierTitle: "Technical Circle",
    atelierText:
      "Selected workshop evenings, heritage discussions and mechanical exchange.",
    accountTitle: "Account Settings",
    accountSubtitle: "Maintain your member details and access credentials.",
    accountDisplayName: "Display name",
    accountEmail: "Email address",
    accountNewPassword: "New password",
    accountConfirmPassword: "Confirm new password",
    accountSaveName: "Save Name",
    accountSaveEmail: "Save Email",
    accountSavePassword: "Save Password",
    eventsSectionTitle: "Upcoming Events & Attendance",
    eventsSectionText:
      "Manage upcoming drives, review attendance and maintain event details for the society.",
    eventLoading: "Loading events...",
    eventEmpty: "No events available yet.",
    eventAttend: "Attend this event",
    eventParticipants: "Participants",
    eventClose: "Close",
    eventModify: "Modify Event",
    eventCreate: "Create Event",
    eventCancelEdit: "Cancel Edit",
    eventTitleLabel: "Event title",
    eventDateLabel: "Event date",
    eventLocationLabel: "Location",
    eventMaxParticipantsLabel: "Max participants",
    eventShortDescriptionLabel: "Short description",
    eventLongDescriptionLabel: "Detailed description",
    eventImageLabel: "Event image",
    eventAttachmentLabel: "Event attachment",
    eventSaveChanges: "Save Changes",
    eventNoParticipants: "No participants registered yet.",
    eventUpcoming: "Upcoming Event",
    eventOpenAttachment: "Open attachment",
    eventDelete: "Delete Event",
    eventArchive: "Archive Event",
    archivedEventsTitle: "Archived Events",
    archivedEventsEmpty: "No archived events yet.",
    archivedAt: "Archived on",
    approvalPendingTitle: "Membership Awaiting Approval",
    approvalPendingText:
      "Your account has been created successfully. Access to the private members area is granted manually once your membership has been reviewed and approved.",
    modify: "Modify",
    save: "Save",
    cancel: "Cancel",
    adminTitle: "Admin Panel",
    adminSubtitle: "Review enquiries and approve registered members.",
    adminEnquiries: "Membership Enquiries",
    adminMembers: "Registered Members",
    adminNoEnquiries: "No enquiries available.",
    adminNoMembers: "No members found.",
    adminApprove: "Approve Member",
    adminMarkReviewed: "Mark Reviewed",
    adminApproved: "Approved",
    adminPending: "Pending",
    adminReviewed: "Reviewed",
    adminNew: "New",
    adminSaveRole: "Save Role",
    adminRole: "Role",
    adminCreateProfile: "Create Profile",
    adminMissingProfile: "No member profile yet",
    footerImprintTitle: "Imprint",
    footerImprintText: "Legal notice and contact details.",
    footerAffiliationTitle: "Affiliation",
    footerAffiliationText:
      "The Heritage Drivers is a private motoring society.",
    footerSponsorsTitle: "Sponsors",
    footerSponsorsText: "Selected partners and supporting houses.",
    footerBottomLine: "The Heritage Drivers",
    footerImprintLink: "View imprint",
  },
  de: {
    navSociety: "Gesellschaft",
    navPhilosophy: "Philosophie",
    navMembership: "Mitgliedschaft",
    navAdminPages: "Admin Inhalte",
    heroTag: "Eine private Fahrergesellschaft",
    heroTitle: "Automobile Kultur,\nstill verstanden.",
    heroText:
      "The Heritage Drivers ist ein erlesener Kreis für jene, die Kultur, Handwerkskunst und die zeitlose Präsenz aussergewöhnlicher Automobile zu schätzen wissen.",
    cta1: "Anfrage stellen",
    cta2: "Mehr erfahren",
    tag1: "Automobile",
    tag2: "Kultur",
    tag3: "Handwerk",
    tag4: "Stil",
    philosophyTitle: "Nicht jedes Automobil bedarf einer Erklärung.",
    membershipTitle: "Zugang ist bewusst gewählt – nicht breit verteilt.",
    membershipText:
      "Mitgliedsanfragen können diskret eingereicht werden. Die Gesellschaft ist selektiv, persönlich und basiert auf gemeinsamen Werten wie Stil, Haltung und technischem Verständnis.",
    enquiryName: "Name",
    enquiryEmail: "E-Mail",
    enquiryMessage: "Kurze Beschreibung Ihres Interesses",
    enquirySubmit: "Anfrage senden",
    loginButton: "Mitglieder-Login",
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
    loginForgot: "Passwort-Reset kann später über Supabase ergänzt werden.",
    loginNote: "Zugang nur für berechtigte Mitglieder.",
    secureAccess: "Geschützter Zugang",
    welcome: "Willkommen zurück",
    membersIntro:
      "Ihr Konto ist über Supabase-Authentifizierung geschützt. Mitgliederdaten, Events und geschützte Inhalte können sicher gepflegt werden.",
    eventCardTitle: "Nächste Ausfahrt",
    eventCardText:
      "Season Opening · 19.04.2026 · Teilnahme nur nach Bestätigung.",
    notesTitle: "Mitteilungen",
    notesText:
      "Diskrete Updates, Club-Hinweise und Korrespondenz der Gesellschaft.",
    atelierTitle: "Technischer Zirkel",
    atelierText:
      "Ausgewählte Werkstattabende, Heritage-Gespräche und mechanischer Austausch.",
    accountTitle: "Kontoeinstellungen",
    accountSubtitle:
      "Pflegen Sie Ihre Mitgliederdaten und Zugangsinformationen.",
    accountDisplayName: "Anzeigename",
    accountEmail: "E-Mail-Adresse",
    accountNewPassword: "Neues Passwort",
    accountConfirmPassword: "Neues Passwort bestätigen",
    accountSaveName: "Name speichern",
    accountSaveEmail: "E-Mail speichern",
    accountSavePassword: "Passwort speichern",
    eventsSectionTitle: "Anstehende Events & Teilnahme",
    eventsSectionText:
      "Verwalten Sie Ausfahrten, prüfen Sie Anmeldungen und pflegen Sie die Event-Daten der Gesellschaft.",
    eventLoading: "Events werden geladen...",
    eventEmpty: "Noch keine Events vorhanden.",
    eventAttend: "An diesem Event teilnehmen",
    eventParticipants: "Teilnehmer",
    eventClose: "Schliessen",
    eventModify: "Event bearbeiten",
    eventCreate: "Event erstellen",
    eventCancelEdit: "Bearbeitung abbrechen",
    eventTitleLabel: "Event-Titel",
    eventDateLabel: "Event-Datum",
    eventLocationLabel: "Ort",
    eventMaxParticipantsLabel: "Max. Teilnehmer",
    eventShortDescriptionLabel: "Kurzbeschreibung",
    eventLongDescriptionLabel: "Ausführliche Beschreibung",
    eventImageLabel: "Event-Bild",
    eventAttachmentLabel: "Event-Anhang",
    eventSaveChanges: "Änderungen speichern",
    eventNoParticipants: "Noch keine Teilnehmer angemeldet.",
    eventUpcoming: "Anstehendes Event",
    eventOpenAttachment: "Anhang öffnen",
    eventDelete: "Event löschen",
    eventArchive: "Event archivieren",
    archivedEventsTitle: "Archivierte Events",
    archivedEventsEmpty: "Noch keine archivierten Events vorhanden.",
    archivedAt: "Archiviert am",
    approvalPendingTitle: "Mitgliedschaft in Prüfung",
    approvalPendingText:
      "Ihr Konto wurde erfolgreich erstellt. Der Zugang zum privaten Mitgliederbereich wird nach Prüfung und Freigabe Ihrer Mitgliedschaft manuell erteilt.",
    modify: "Ändern",
    save: "Speichern",
    cancel: "Abbrechen",
    adminTitle: "Admin Panel",
    adminSubtitle: "Anfragen prüfen und registrierte Benutzer freigeben.",
    adminEnquiries: "Mitgliedsanfragen",
    adminMembers: "Registrierte Mitglieder",
    adminNoEnquiries: "Keine Anfragen vorhanden.",
    adminNoMembers: "Keine Mitglieder gefunden.",
    adminApprove: "Mitglied freigeben",
    adminMarkReviewed: "Als geprüft markieren",
    adminApproved: "Freigegeben",
    adminPending: "Ausstehend",
    adminReviewed: "Geprüft",
    adminNew: "Neu",
    adminSaveRole: "Rolle speichern",
    adminRole: "Rolle",
    adminCreateProfile: "Profil erstellen",
    adminMissingProfile: "Noch kein Mitgliederprofil",
    footerImprintTitle: "Impressum",
    footerImprintText: "Rechtliche Hinweise und Kontaktangaben.",
    footerAffiliationTitle: "Zugehörigkeit",
    footerAffiliationText:
      "The Heritage Drivers ist eine private Fahrergesellschaft.",
    footerSponsorsTitle: "Sponsoren",
    footerSponsorsText: "Ausgewählte Partner und unterstützende Häuser.",
    footerBottomLine: "The Heritage Drivers",
    footerImprintLink: "Zum Impressum",
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
    eventCreateError: "Could not save event.",
    eventCreateSuccess: "Event created successfully.",
    eventUpdateSuccess: "Event updated successfully.",
    eventDeleteSuccess: "Event deleted successfully.",
    eventArchiveSuccess: "Event archived successfully.",
    eventDeleteConfirm: "Do you really want to delete this event?",
    eventArchiveConfirm: "Do you really want to archive this event?",
    profileUpdateSuccess: "Profile name updated successfully.",
    emailUpdateSuccess:
      "Email update requested. Please confirm via the email sent by Supabase.",
    passwordUpdateSuccess: "Password updated successfully.",
    passwordMismatch: "The new passwords do not match.",
    passwordTooShort: "Please use a password with at least 8 characters.",
    participantUpdateSuccess: "Attendance updated successfully.",
    uploadError: "File upload failed.",
    enquirySuccess: "Your enquiry has been submitted successfully.",
    enquiryError: "Your enquiry could not be submitted.",
    enquiryMissingFields:
      "Please provide at least your name and email address.",
    setupTitle: "Supabase setup required",
    setupText:
      "Replace the placeholder Supabase URL and anon key in the code to activate real authentication, password protection and database-backed user accounts.",
    approvalSuccess: "Member approved successfully.",
    enquiryReviewedSuccess: "Enquiry marked as reviewed.",
    roleUpdateSuccess: "Member role updated successfully.",
    contentUpdateSuccess: "Content updated successfully.",
    createProfileSuccess: "Profile created successfully.",
  },
  de: {
    loginSuccess: "Anmeldung erfolgreich.",
    signupSuccess:
      "Konto erstellt. Bitte bestätigen Sie Ihre Registrierung über die E-Mail.",
    logoutSuccess: "Sie wurden abgemeldet.",
    genericError:
      "Etwas ist schiefgelaufen. Bitte prüfen Sie die Konfiguration und versuchen Sie es erneut.",
    notAuthorized: "Keine Berechtigung für diese Aktion.",
    eventCreateError: "Event konnte nicht gespeichert werden.",
    eventCreateSuccess: "Event erfolgreich erstellt.",
    eventUpdateSuccess: "Event erfolgreich aktualisiert.",
    eventDeleteSuccess: "Event erfolgreich gelöscht.",
    eventArchiveSuccess: "Event erfolgreich archiviert.",
    eventDeleteConfirm: "Soll dieses Event wirklich gelöscht werden?",
    eventArchiveConfirm: "Soll dieses Event wirklich archiviert werden?",
    profileUpdateSuccess: "Anzeigename erfolgreich aktualisiert.",
    emailUpdateSuccess:
      "Änderung der E-Mail angestossen. Bitte die Bestätigungs-E-Mail von Supabase prüfen.",
    passwordUpdateSuccess: "Passwort erfolgreich aktualisiert.",
    passwordMismatch: "Die neuen Passwörter stimmen nicht überein.",
    passwordTooShort:
      "Bitte verwenden Sie ein Passwort mit mindestens 8 Zeichen.",
    participantUpdateSuccess: "Teilnahme erfolgreich aktualisiert.",
    uploadError: "Datei-Upload fehlgeschlagen.",
    enquirySuccess: "Ihre Anfrage wurde erfolgreich übermittelt.",
    enquiryError: "Ihre Anfrage konnte nicht übermittelt werden.",
    enquiryMissingFields:
      "Bitte geben Sie mindestens Ihren Namen und Ihre E-Mail-Adresse an.",
    setupTitle: "Supabase-Einrichtung erforderlich",
    setupText:
      "Ersetzen Sie die Platzhalter für Supabase URL und Anon Key im Code, damit echte Authentifizierung, Passwortschutz und datenbankgestützte Benutzerkonten aktiv werden.",
    approvalSuccess: "Mitglied erfolgreich freigegeben.",
    enquiryReviewedSuccess: "Anfrage als geprüft markiert.",
    roleUpdateSuccess: "Mitgliedsrolle erfolgreich aktualisiert.",
    contentUpdateSuccess: "Inhalt erfolgreich aktualisiert.",
    createProfileSuccess: "Profil erfolgreich erstellt.",
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

function EditablePlaceholderField({
  value,
  inputType = "input",
  fieldValue,
  onFieldChange,
  className = "",
  extraProps = {},
}) {
  return (
    <div>
      {inputType === "textarea" ? (
        <textarea
          value={fieldValue}
          onChange={onFieldChange}
          placeholder={value}
          className={className}
          {...extraProps}
        />
      ) : (
        <input
          value={fieldValue}
          onChange={onFieldChange}
          placeholder={value}
          className={className}
          {...extraProps}
        />
      )}
    </div>
  );
}

function formatDateSafe(dateValue, lang = "en") {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;

  return new Intl.DateTimeFormat(lang === "de" ? "de-CH" : "en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export default function TheHeritageDriversLandingPage() {
  const [lang, setLang] = useState("de");
  const [showLogin, setShowLogin] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [websiteContent, setWebsiteContent] = useState({});

  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [status, setStatus] = useState({ type: "", message: "" });

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [events, setEvents] = useState([]);
  const [archivedEvents, setArchivedEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  const [participants, setParticipants] = useState([]);
  const [participantsView, setParticipantsView] = useState(null);

  const [eventForm, setEventForm] = useState(emptyEventForm);
  const [eventImageFile, setEventImageFile] = useState(null);
  const [eventAttachmentFile, setEventAttachmentFile] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventSaving, setEventSaving] = useState(false);

  const [accountName, setAccountName] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [accountPasswordConfirm, setAccountPasswordConfirm] = useState("");
  const [accountLoading, setAccountLoading] = useState(false);

  const [enquiryForm, setEnquiryForm] = useState({
    full_name: "",
    email: "",
    interest_note: "",
  });
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [memberProfilesAdmin, setMemberProfilesAdmin] = useState([]);
  const [memberRoleDrafts, setMemberRoleDrafts] = useState({});
  const [authUsersAdmin, setAuthUsersAdmin] = useState([]);

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

  const memberName = useMemo(() => {
    if (profile?.full_name) return profile.full_name;
    const sessionEmail = session?.user?.email || email;
    if (!sessionEmail) return lang === "en" ? "Member" : "Mitglied";
    return sessionEmail.split("@")[0].replace(/[._-]/g, " ");
  }, [profile, session, email, lang]);

  const resetStatus = () => setStatus({ type: "", message: "" });

  const clearAppState = () => {
    setSession(null);
    setProfile(null);
    setProfileLoaded(false);
    setEvents([]);
    setArchivedEvents([]);
    setParticipants([]);
    setParticipantsView(null);
    setEditingEventId(null);
    setEventForm(emptyEventForm);
    setEventImageFile(null);
    setEventAttachmentFile(null);
    setAccountName("");
    setAccountEmail("");
    setAccountPassword("");
    setAccountPasswordConfirm("");
    setEnquiries([]);
    setMemberProfilesAdmin([]);
    setMemberRoleDrafts({});
    setAuthUsersAdmin([]);
  };

  const syncAccountFields = (nextProfile, nextSession) => {
    setAccountName(nextProfile?.full_name || "");
    setAccountEmail(nextSession?.user?.email || "");
  };

  const saveContentField = async (key, value) => {
    if (!supabase || !session?.user || !isAdmin) return;

    const { error } = await supabase.from("website_content").upsert(
      {
        content_key: key,
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
      .select("content_key, lang, content_value");

    if (error || !data) return;

    const next = {};
    for (const row of data) {
      if (!next[row.lang]) next[row.lang] = {};
      next[row.lang][row.content_key] = row.content_value;
    }
    setWebsiteContent(next);
  };

  const loadProfile = async (userId, currentSession = session) => {
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
      console.error("loadProfile error:", error);
      setProfile(null);
      syncAccountFields(null, currentSession);
      setProfileLoaded(true);
      return null;
    }

    setProfile(data || null);
    syncAccountFields(data || null, currentSession);
    setProfileLoaded(true);
    return data || null;
  };

  const loadEvents = async (currentProfile = profile) => {
    if (!supabase) return;

    setEventsLoading(true);

    try {
      const baseActiveQuery = supabase
        .from("events")
        .select("*")
        .eq("archived", false)
        .order("event_date", { ascending: true });

      const activeQuery =
        currentProfile?.role === "admin"
          ? baseActiveQuery
          : baseActiveQuery.eq("is_active", true);

      const { data: activeData, error: activeError } = await activeQuery;

      if (!activeError && activeData) setEvents(activeData);
      else setEvents([]);

      if (currentProfile?.role === "admin") {
        const { data: archivedData, error: archivedError } = await supabase
          .from("events")
          .select("*")
          .eq("archived", true)
          .order("event_date", { ascending: false });

        if (!archivedError && archivedData) setArchivedEvents(archivedData);
        else setArchivedEvents([]);
      } else {
        setArchivedEvents([]);
      }
    } finally {
      setEventsLoading(false);
    }
  };

  const loadParticipants = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("event_participants")
      .select("id, event_id, user_id, status, created_at");

    if (error || !data) {
      setParticipants([]);
      return;
    }

    const userIds = [...new Set(data.map((row) => row.user_id))];

    if (userIds.length === 0) {
      setParticipants([]);
      return;
    }

    const { data: profilesData, error: profilesError } = await supabase
      .from("member_profiles")
      .select("id, full_name")
      .in("id", userIds);

    if (profilesError) {
      setParticipants(data);
      return;
    }

    const nameMap = new Map(
      (profilesData || []).map((row) => [row.id, row.full_name])
    );

    const enriched = data.map((row) => ({
      ...row,
      full_name: nameMap.get(row.user_id) || row.user_id,
    }));

    setParticipants(enriched);
  };

  const loadEnquiries = async () => {
    if (!supabase) return;

    setEnquiriesLoading(true);
    const { data, error } = await supabase
      .from("membership_enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setEnquiries(data);
    if (error) setEnquiries([]);
    setEnquiriesLoading(false);
  };

  const loadMemberProfilesAdmin = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("member_profiles")
      .select("id, full_name, role, approved")
      .order("full_name", { ascending: true });

    if (!error && data) {
      setMemberProfilesAdmin(data);
      const drafts = {};
      data.forEach((row) => {
        drafts[row.id] = row.role || "member";
      });
      setMemberRoleDrafts((prev) => ({ ...drafts, ...prev }));
    }
  };

  const loadAuthUsersAdmin = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("auth_users_overview")
      .select("id, email, created_at")
      .order("created_at", { ascending: false });

    if (!error && data) setAuthUsersAdmin(data);
    else setAuthUsersAdmin([]);
  };

  const loadAppData = async (currentSession) => {
    if (!currentSession?.user) return;

    const loadedProfile = await loadProfile(
      currentSession.user.id,
      currentSession
    );

    await loadEvents(loadedProfile);
    await loadParticipants();

    if (loadedProfile?.role === "admin") {
      await loadEnquiries();
      await loadMemberProfilesAdmin();
      await loadAuthUsersAdmin();
    } else {
      setEnquiries([]);
      setMemberProfilesAdmin([]);
      setMemberRoleDrafts({});
      setAuthUsersAdmin([]);
    }
  };

  useEffect(() => {
    if (!supabase) {
      setInitializing(false);
      return;
    }

    let mounted = true;

    const init = async () => {
      try {
        await loadWebsiteContent();

        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (currentSession?.user) {
          setSession(currentSession);
          setProfileLoaded(false);
          await loadAppData(currentSession);
        } else {
          clearAppState();
        }
      } catch (error) {
        console.error("Initialization error:", error);
        clearAppState();
      } finally {
        if (mounted) setInitializing(false);
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!mounted) return;

      try {
        if (currentSession?.user) {
          setSession(currentSession);
          setProfileLoaded(false);
          await loadAppData(currentSession);
        } else {
          clearAppState();
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        clearAppState();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const uploadFileToBucket = async ({
    bucket,
    folder,
    file,
    makePublic = true,
  }) => {
    if (!supabase || !file || !session?.user) return { url: "", name: "" };

    const fileExt = file.name.split(".").pop();
    const safeExt = fileExt ? `.${fileExt}` : "";
    const fileName = `${session.user.id}-${Date.now()}${safeExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: false });

    if (uploadError) throw uploadError;

    if (makePublic) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return { url: data?.publicUrl || "", name: file.name };
    }

    return { url: filePath, name: file.name };
  };

  const handleUploadEventImage = async () =>
    uploadFileToBucket({
      bucket: "event-images",
      folder: "events",
      file: eventImageFile,
      makePublic: true,
    });

  const handleUploadEventAttachment = async () =>
    uploadFileToBucket({
      bucket: "event-files",
      folder: "attachments",
      file: eventAttachmentFile,
      makePublic: true,
    });

  const handleSubmitEnquiry = async () => {
    resetStatus();

    if (!supabase) {
      setStatus({ type: "error", message: messages.setupText });
      return;
    }

    if (!enquiryForm.full_name.trim() || !enquiryForm.email.trim()) {
      setStatus({ type: "error", message: messages.enquiryMissingFields });
      return;
    }

    setEnquiryLoading(true);

    const { error } = await supabase.from("membership_enquiries").insert({
      full_name: enquiryForm.full_name.trim(),
      email: enquiryForm.email.trim(),
      interest_note: enquiryForm.interest_note.trim() || null,
      language: lang,
      status: "new",
    });

    setEnquiryLoading(false);

    if (error) {
      setStatus({
        type: "error",
        message: error.message || messages.enquiryError,
      });
      return;
    }

    setEnquiryForm({ full_name: "", email: "", interest_note: "" });
    setStatus({ type: "success", message: messages.enquirySuccess });
  };

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
      const { error: profileError } = await supabase
        .from("member_profiles")
        .insert({
          id: data.user.id,
          full_name: fullName.trim(),
          role: "member",
          approved: false,
        });

      if (
        profileError &&
        !String(profileError.message || "").toLowerCase().includes("duplicate")
      ) {
        setLoading(false);
        setStatus({
          type: "error",
          message: profileError.message || messages.genericError,
        });
        return;
      }
    }

    setLoading(false);
    setStatus({ type: "success", message: messages.signupSuccess });
    setAuthMode("login");
    setPassword("");
  };

  const handleLogout = async () => {
    resetStatus();

    if (!supabase) {
      clearAppState();
      window.location.href = "/";
      return;
    }

    await supabase.auth.signOut();

    localStorage.removeItem("heritage-drivers-auth");
    sessionStorage.clear();

    clearAppState();
    setPassword("");

    window.location.href = "/";
  };

  const handleUpdateProfileName = async () => {
    resetStatus();
    if (!supabase || !session?.user) return;

    setAccountLoading(true);
    const { error } = await supabase
      .from("member_profiles")
      .update({ full_name: accountName.trim() })
      .eq("id", session.user.id);
    setAccountLoading(false);

    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }

    await loadProfile(session.user.id, session);
    setStatus({ type: "success", message: messages.profileUpdateSuccess });
  };

  const handleUpdateEmail = async () => {
    resetStatus();
    if (!supabase || !session?.user) return;

    setAccountLoading(true);
    const { error } = await supabase.auth.updateUser({
      email: accountEmail.trim(),
    });
    setAccountLoading(false);

    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }

    setStatus({ type: "success", message: messages.emailUpdateSuccess });
  };

  const handleUpdatePassword = async () => {
    resetStatus();
    if (!supabase || !session?.user) return;

    if (accountPassword !== accountPasswordConfirm) {
      setStatus({ type: "error", message: messages.passwordMismatch });
      return;
    }

    if (accountPassword.length < 8) {
      setStatus({ type: "error", message: messages.passwordTooShort });
      return;
    }

    setAccountLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: accountPassword,
    });
    setAccountLoading(false);

    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }

    setAccountPassword("");
    setAccountPasswordConfirm("");
    setStatus({ type: "success", message: messages.passwordUpdateSuccess });
  };

  const handleCreateEvent = async () => {
    resetStatus();

    if (!supabase || !session?.user || !isAdmin) {
      setStatus({ type: "error", message: messages.notAuthorized });
      return;
    }

    if (!eventForm.title.trim() || !eventForm.event_date) {
      setStatus({ type: "error", message: messages.eventCreateError });
      return;
    }

    setEventSaving(true);

    try {
      let uploadedImageUrl = eventForm.image_url || null;
      let uploadedAttachmentUrl = eventForm.attachment_url || null;
      let uploadedAttachmentName = eventForm.attachment_name || null;

      if (eventImageFile) {
        const imageUpload = await handleUploadEventImage();
        uploadedImageUrl = imageUpload.url || null;
      }

      if (eventAttachmentFile) {
        const attachmentUpload = await handleUploadEventAttachment();
        uploadedAttachmentUrl = attachmentUpload.url || null;
        uploadedAttachmentName = attachmentUpload.name || null;
      }

      const payload = {
        title: eventForm.title.trim(),
        short_description: eventForm.short_description.trim() || null,
        long_description: eventForm.long_description.trim() || null,
        event_date: eventForm.event_date || null,
        location: eventForm.location.trim() || null,
        max_participants: eventForm.max_participants
          ? Number(eventForm.max_participants)
          : null,
        image_url: uploadedImageUrl,
        attachment_name: uploadedAttachmentName,
        attachment_url: uploadedAttachmentUrl,
        is_active: true,
        archived: false,
      };

      const response = editingEventId
        ? await supabase.from("events").update(payload).eq("id", editingEventId)
        : await supabase.from("events").insert({
            ...payload,
            created_by: session.user.id,
          });

      if (response.error) {
        setStatus({
          type: "error",
          message: response.error.message || messages.eventCreateError,
        });
        setEventSaving(false);
        return;
      }

      setStatus({
        type: "success",
        message: editingEventId
          ? messages.eventUpdateSuccess
          : messages.eventCreateSuccess,
      });

      setEventForm(emptyEventForm);
      setEventImageFile(null);
      setEventAttachmentFile(null);
      setEditingEventId(null);
      await loadEvents(profile);
    } catch (err) {
      setStatus({ type: "error", message: err?.message || messages.uploadError });
    }

    setEventSaving(false);
  };

  const handleDeleteEvent = async (eventId) => {
    resetStatus();

    if (!supabase || !session?.user || !isAdmin) {
      setStatus({ type: "error", message: messages.notAuthorized });
      return;
    }

    const confirmed = window.confirm(messages.eventDeleteConfirm);
    if (!confirmed) return;

    const { error } = await supabase.from("events").delete().eq("id", eventId);

    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }

    if (editingEventId === eventId) {
      setEditingEventId(null);
      setEventForm(emptyEventForm);
      setEventImageFile(null);
      setEventAttachmentFile(null);
    }

    setParticipantsView(null);
    setStatus({ type: "success", message: messages.eventDeleteSuccess });
    await loadEvents(profile);
  };

  const handleArchiveEvent = async (eventId) => {
    resetStatus();

    if (!supabase || !session?.user || !isAdmin) {
      setStatus({ type: "error", message: messages.notAuthorized });
      return;
    }

    const confirmed = window.confirm(messages.eventArchiveConfirm);
    if (!confirmed) return;

    const { error } = await supabase
      .from("events")
      .update({
        archived: true,
        archived_at: new Date().toISOString(),
        is_active: false,
      })
      .eq("id", eventId);

    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }

    if (editingEventId === eventId) {
      setEditingEventId(null);
      setEventForm(emptyEventForm);
      setEventImageFile(null);
      setEventAttachmentFile(null);
    }

    setParticipantsView(null);
    setStatus({ type: "success", message: messages.eventArchiveSuccess });
    await loadEvents(profile);
  };

  const handleEditEvent = (event) => {
    setEditingEventId(event.id);
    setEventForm({
      title: event.title || "",
      short_description: event.short_description || "",
      long_description: event.long_description || "",
      event_date: event.event_date || "",
      location: event.location || "",
      max_participants: event.max_participants?.toString() || "",
      image_url: event.image_url || "",
      attachment_name: event.attachment_name || "",
      attachment_url: event.attachment_url || "",
    });
    setEventImageFile(null);
    setEventAttachmentFile(null);
  };

  const resetEventEditor = () => {
    setEditingEventId(null);
    setEventForm(emptyEventForm);
    setEventImageFile(null);
    setEventAttachmentFile(null);
  };

  const isRegisteredForEvent = (eventId) => {
    if (!session?.user) return false;
    return participants.some(
      (p) => p.event_id === eventId && p.user_id === session.user.id
    );
  };

  const getParticipantsForEvent = (eventId) => {
    return participants
      .filter((p) => p.event_id === eventId)
      .sort((a, b) =>
        String(a.full_name || "").localeCompare(String(b.full_name || ""))
      );
  };

  const handleToggleParticipation = async (eventId, checked) => {
    resetStatus();
    if (!supabase || !session?.user) return;

    if (checked) {
      const alreadyRegistered = participants.some(
        (p) => p.event_id === eventId && p.user_id === session.user.id
      );

      if (!alreadyRegistered) {
        const { error } = await supabase.from("event_participants").insert({
          event_id: eventId,
          user_id: session.user.id,
          status: "registered",
        });

        if (error) {
          setStatus({ type: "error", message: error.message });
          return;
        }
      }
    } else {
      const { error } = await supabase
        .from("event_participants")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", session.user.id);

      if (error) {
        setStatus({ type: "error", message: error.message });
        return;
      }
    }

    await loadParticipants();
    setStatus({ type: "success", message: messages.participantUpdateSuccess });
  };

  const handleViewParticipants = async (eventId) => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("event_participants")
      .select("id, event_id, user_id, status, created_at")
      .eq("event_id", eventId);

    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }

    const userIds = (data || []).map((row) => row.user_id);

    if (userIds.length === 0) {
      setParticipantsView({ eventId, rows: [] });
      return;
    }

    const { data: profilesData, error: profilesError } = await supabase
      .from("member_profiles")
      .select("id, full_name")
      .in("id", userIds);

    if (profilesError) {
      setStatus({ type: "error", message: profilesError.message });
      return;
    }

    const nameMap = new Map(
      (profilesData || []).map((row) => [row.id, row.full_name])
    );

    const rows = (data || []).map((row) => ({
      ...row,
      full_name: nameMap.get(row.user_id) || row.user_id,
    }));

    setParticipantsView({ eventId, rows });
  };

  const handleApproveMember = async (memberId) => {
    resetStatus();
    if (!supabase || !session?.user || !isAdmin) return;

    const selectedRole = memberRoleDrafts[memberId] || "member";

    const { error } = await supabase
      .from("member_profiles")
      .update({ approved: true, role: selectedRole })
      .eq("id", memberId);

    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }

    setStatus({ type: "success", message: messages.approvalSuccess });
    await loadMemberProfilesAdmin();
  };

  const handleUpdateMemberRole = async (memberId) => {
    resetStatus();
    if (!supabase || !session?.user || !isAdmin) return;

    const selectedRole = memberRoleDrafts[memberId] || "member";

    const { error } = await supabase
      .from("member_profiles")
      .update({ role: selectedRole })
      .eq("id", memberId);

    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }

    setStatus({ type: "success", message: messages.roleUpdateSuccess });
    await loadMemberProfilesAdmin();
  };

  const handleCreateProfile = async (userId, userEmail) => {
    resetStatus();
    if (!supabase || !session?.user || !isAdmin) return;

    const defaultName = userEmail
      ? userEmail.split("@")[0].replace(/[._-]/g, " ")
      : "Member";

    const selectedRole = memberRoleDrafts[userId] || "member";

    const { error } = await supabase.from("member_profiles").insert({
      id: userId,
      full_name: defaultName,
      role: selectedRole,
      approved: false,
    });

    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }

    setStatus({ type: "success", message: messages.createProfileSuccess });
    await loadMemberProfilesAdmin();
    await loadAuthUsersAdmin();
  };

  const handleMarkEnquiryReviewed = async (enquiryId) => {
    resetStatus();
    if (!supabase || !session?.user || !isAdmin) return;

    const { error } = await supabase
      .from("membership_enquiries")
      .update({
        status: "reviewed",
        reviewed_at: new Date().toISOString(),
        reviewed_by: session.user.id,
      })
      .eq("id", enquiryId);

    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }

    setStatus({ type: "success", message: messages.enquiryReviewedSuccess });
    await loadEnquiries();
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

  const missingProfileUsers = authUsersAdmin.filter(
    (authUser) => !memberProfilesAdmin.some((member) => member.id === authUser.id)
  );

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
              <Link href="/society" className="transition hover:text-white">{tc("navSociety")}</Link>
              <Link href="/philosophy" className="transition hover:text-white">{tc("navPhilosophy")}</Link>
              <Link href="/membership" className="transition hover:text-white">{tc("navMembership")}</Link>

              {isAdmin && (
                <Link href="/admin/pages" className="inline-flex items-center gap-2 rounded-full border border-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#e8dcc0] transition hover:bg-[#b6924f] hover:text-black">
                  <FileText className="h-3.5 w-3.5" />
                  {tc("navAdminPages")}
                </Link>
              )}

              {!isLoggedIn ? (
                <button onClick={() => { resetStatus(); setAuthMode("login"); setShowLogin(true); }} className="inline-flex rounded-full border border-[#3b311d] px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#e8dcc0] transition hover:border-[#b6924f] hover:text-white">
                  {tc("loginButton")}
                </button>
              ) : (
                <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full border border-[#3b311d] px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#e8dcc0] transition hover:border-[#b6924f] hover:text-white">
                  <LogOut className="h-3.5 w-3.5" />
                  {lang === "en" ? "Sign Out" : "Abmelden"}
                </button>
              )}
            </nav>

            <button onClick={() => setLang(lang === "en" ? "de" : "en")} className="border border-[#b6924f] px-3 py-1 text-xs uppercase tracking-widest">
              {lang === "en" ? "DE" : "EN"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-20">
        <StatusBanner />

        {!supabaseConfigured && (
          <div className="mb-10 rounded-[1.75rem] border border-[#4b2f20] bg-[#16100d] p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[#b6924f]">{messages.setupTitle}</p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#cfbea3]">{messages.setupText}</p>
          </div>
        )}

        <section>
          <div className="mb-10 flex justify-center">
            <img src="/logo.png" alt="The Heritage Drivers" className="h-40 object-contain" />
          </div>

          {!isLoggedIn ? (
            <>
              <EditableText isAdmin={isAdmin} value={tc("heroTag")} onSave={(v) => saveContentField("heroTag", v)} className="text-sm uppercase tracking-[0.4em] text-[#b6924f]" as="p" modifyLabel={tc("modify")} saveLabel={tc("save")} cancelLabel={tc("cancel")} />
              <EditableText isAdmin={isAdmin} value={tc("heroTitle")} onSave={(v) => saveContentField("heroTitle", v)} className="mt-6 text-5xl leading-tight text-[#f2e6cf]" as="h1" multiline modifyLabel={tc("modify")} saveLabel={tc("save")} cancelLabel={tc("cancel")} />
              <EditableText isAdmin={isAdmin} value={tc("heroText")} onSave={(v) => saveContentField("heroText", v)} className="mt-6 max-w-xl text-lg text-[#bcb09a]" as="p" modifyLabel={tc("modify")} saveLabel={tc("save")} cancelLabel={tc("cancel")} />

              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/membership" className="bg-[#b6924f] px-6 py-3 text-black">{tc("cta1")}</Link>
                <Link href="/society" className="border border-[#b6924f] px-6 py-3">{tc("cta2")}</Link>
                <button onClick={() => { resetStatus(); setAuthMode("login"); setShowLogin(true); }} className="border border-[#3b311d] px-6 py-3 text-[#e8dcc0]">{tc("loginButton")}</button>
              </div>

              <div className="mt-10 flex flex-wrap gap-6 text-sm uppercase text-[#8b7e65]">
                {[tc("tag1"), tc("tag2"), tc("tag3"), tc("tag4")].map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </>
          ) : (
            <>
              <EditableText isAdmin={isAdmin} value={tc("secureAccess")} onSave={(v) => saveContentField("secureAccess", v)} className="text-sm uppercase tracking-[0.4em] text-[#b6924f]" as="p" modifyLabel={tc("modify")} saveLabel={tc("save")} cancelLabel={tc("cancel")} />
              <h1 className="mt-6 text-5xl leading-tight text-[#f2e6cf]">{tc("welcome")}, {memberName}</h1>
              <EditableText isAdmin={isAdmin} value={tc("membersIntro")} onSave={(v) => saveContentField("membersIntro", v)} className="mt-6 max-w-2xl text-lg text-[#bcb09a]" as="p" modifyLabel={tc("modify")} saveLabel={tc("save")} cancelLabel={tc("cancel")} />

              <div className="mt-10 grid gap-6 lg:grid-cols-3">
                <div className="rounded-[1.5rem] border border-[#2d2416] bg-[#131313] p-6">
                  <div className="flex items-center gap-3"><Calendar className="h-5 w-5 text-[#b6924f]" /><EditableText isAdmin={isAdmin} value={tc("eventCardTitle")} onSave={(v) => saveContentField("eventCardTitle", v)} className="text-lg text-[#f2e6cf]" as="h3" modifyLabel={tc("modify")} saveLabel={tc("save")} cancelLabel={tc("cancel")} /></div>
                  <EditableText isAdmin={isAdmin} value={tc("eventCardText")} onSave={(v) => saveContentField("eventCardText", v)} className="mt-3 text-sm leading-6 text-[#a99c83]" as="p" multiline modifyLabel={tc("modify")} saveLabel={tc("save")} cancelLabel={tc("cancel")} />
                </div>

                <div className="rounded-[1.5rem] border border-[#2d2416] bg-[#131313] p-6">
                  <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-[#b6924f]" /><EditableText isAdmin={isAdmin} value={tc("notesTitle")} onSave={(v) => saveContentField("notesTitle", v)} className="text-lg text-[#f2e6cf]" as="h3" modifyLabel={tc("modify")} saveLabel={tc("save")} cancelLabel={tc("cancel")} /></div>
                  <EditableText isAdmin={isAdmin} value={tc("notesText")} onSave={(v) => saveContentField("notesText", v)} className="mt-3 text-sm leading-6 text-[#a99c83]" as="p" multiline modifyLabel={tc("modify")} saveLabel={tc("save")} cancelLabel={tc("cancel")} />
                </div>

                <div className="rounded-[1.5rem] border border-[#2d2416] bg-[#131313] p-6">
                  <div className="flex items-center gap-3"><Wrench className="h-5 w-5 text-[#b6924f]" /><EditableText isAdmin={isAdmin} value={tc("atelierTitle")} onSave={(v) => saveContentField("atelierTitle", v)} className="text-lg text-[#f2e6cf]" as="h3" modifyLabel={tc("modify")} saveLabel={tc("save")} cancelLabel={tc("cancel")} /></div>
                  <EditableText isAdmin={isAdmin} value={tc("atelierText")} onSave={(v) => saveContentField("atelierText", v)} className="mt-3 text-sm leading-6 text-[#a99c83]" as="p" multiline modifyLabel={tc("modify")} saveLabel={tc("save")} cancelLabel={tc("cancel")} />
                </div>
              </div>
            </>
          )}
        </section>

        {!isLoggedIn && (
          <section className="mt-24 grid gap-6 lg:grid-cols-2">
            <div>
              <EditableText isAdmin={isAdmin} value={tc("philosophyTitle")} onSave={(v) => saveContentField("philosophyTitle", v)} className="text-3xl text-[#f0e3c6]" as="h2" modifyLabel={tc("modify")} saveLabel={tc("save")} cancelLabel={tc("cancel")} />
            </div>

            <div className="rounded-[2rem] border border-[#2d2416] bg-[#111111] p-8">
              <div className="flex items-center gap-3">
                <div className="rounded-full border border-[#3a2f1c] p-3"><User className="h-5 w-5 text-[#b6924f]" /></div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#b6924f]">{lang === "en" ? "Members" : "Mitglieder"}</p>
                  <p className="mt-2 text-sm text-[#b9ad95]">{tc("loginSubtitle")}</p>
                </div>
              </div>

              <button onClick={() => { resetStatus(); setAuthMode("login"); setShowLogin(true); }} className="mt-6 rounded-full border border-[#b6924f] px-5 py-3 text-sm uppercase tracking-[0.24em] text-[#f0e3c6] transition hover:bg-[#b6924f] hover:text-black">
                {tc("loginButton")}
              </button>
            </div>
          </section>
        )}

        {!isLoggedIn && (
          <section className="mt-24">
            <EditableText isAdmin={isAdmin} value={tc("membershipTitle")} onSave={(v) => saveContentField("membershipTitle", v)} className="text-3xl text-[#f0e3c6]" as="h2" modifyLabel={tc("modify")} saveLabel={tc("save")} cancelLabel={tc("cancel")} />
            <EditableText isAdmin={isAdmin} value={tc("membershipText")} onSave={(v) => saveContentField("membershipText", v)} className="mt-6 max-w-xl text-[#bcb09a]" as="p" modifyLabel={tc("modify")} saveLabel={tc("save")} cancelLabel={tc("cancel")} />

            <div className="mt-10 max-w-md space-y-4">
              <EditablePlaceholderField value={tc("enquiryName")} fieldValue={enquiryForm.full_name} onFieldChange={(e) => setEnquiryForm({ ...enquiryForm, full_name: e.target.value })} className="w-full border border-[#342a1a] bg-black p-3 text-[#efe2c5]" />
              <EditablePlaceholderField value={tc("enquiryEmail")} fieldValue={enquiryForm.email} onFieldChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })} className="w-full border border-[#342a1a] bg-black p-3 text-[#efe2c5]" extraProps={{ type: "email" }} />
              <EditablePlaceholderField value={tc("enquiryMessage")} inputType="textarea" fieldValue={enquiryForm.interest_note} onFieldChange={(e) => setEnquiryForm({ ...enquiryForm, interest_note: e.target.value })} className="w-full border border-[#342a1a] bg-black p-3 text-[#efe2c5]" />

              <button onClick={handleSubmitEnquiry} disabled={enquiryLoading} className="flex w-full items-center justify-center gap-2 bg-[#b6924f] px-6 py-3 text-black disabled:cursor-not-allowed disabled:opacity-70">
                {enquiryLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {tc("enquirySubmit")}
              </button>
            </div>
          </section>
        )}

        {isLoggedIn && profileLoaded && profile && !hasMemberAccess && (
          <section className="mt-24">
            <div className="rounded-[2rem] border border-[#4b2f20] bg-[#16100d] p-8">
              <EditableText isAdmin={isAdmin} value={tc("approvalPendingTitle")} onSave={(v) => saveContentField("approvalPendingTitle", v)} className="text-2xl text-[#f2e6cf]" as="h2" modifyLabel={tc("modify")} saveLabel={tc("save")} cancelLabel={tc("cancel")} />
              <EditableText isAdmin={isAdmin} value={tc("approvalPendingText")} onSave={(v) => saveContentField("approvalPendingText", v)} className="mt-4 max-w-2xl text-[#cfbea3]" as="p" modifyLabel={tc("modify")} saveLabel={tc("save")} cancelLabel={tc("cancel")} />
            </div>
          </section>
        )}

        {hasMemberAccess && (
          <section className="mt-24" id="members">
            <div className="rounded-[2rem] border border-[#2c2415] bg-[#0f0f0f] p-8 shadow-2xl shadow-black/30">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#b6924f]">Club Events</p>
                  <h2 className="mt-4 text-3xl text-[#f2e6cf]">{tc("eventsSectionTitle")}</h2>
                  <p className="mt-4 max-w-2xl text-[#b8ad96]">{tc("eventsSectionText")}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {isAdmin && (
                    <Link href="/admin/pages" className="inline-flex items-center gap-2 rounded-full border border-[#b6924f] px-5 py-3 text-sm uppercase tracking-[0.22em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black">
                      <FileText className="h-4 w-4" />
                      {tc("navAdminPages")}
                    </Link>
                  )}

                  <button onClick={handleLogout} className="rounded-full border border-[#3b311d] px-5 py-3 text-sm uppercase tracking-[0.22em] text-[#f2e6cf] transition hover:border-[#b6924f]">
                    {lang === "en" ? "Sign Out" : "Abmelden"}
                  </button>
                </div>
              </div>

              <div className="mt-8 grid gap-6">
                <div className="rounded-[1.75rem] border border-[#2d2416] bg-[#131313] p-8">
                  {eventsLoading ? (
                    <p className="text-sm text-[#b8ad96]">{tc("eventLoading")}</p>
                  ) : events.length === 0 ? (
                    <p className="text-sm text-[#b8ad96]">{tc("eventEmpty")}</p>
                  ) : (
                    <div className="grid gap-6 lg:grid-cols-2">
                      {events.map((event) => (
                        <div key={event.id} className="rounded-[1.5rem] border border-[#2d2416] bg-[#0f0f0f] p-6">
                          {event.image_url && <img src={event.image_url} alt={event.title} className="mb-4 h-48 w-full rounded-2xl object-cover" />}

                          <p className="text-xs uppercase tracking-[0.3em] text-[#b6924f]">{tc("eventUpcoming")}</p>
                          <h4 className="mt-3 text-xl text-[#f2e6cf]">{event.title}</h4>
                          <p className="mt-2 text-sm text-[#a99c83]">{formatDateSafe(event.event_date, lang)}{event.location ? ` · ${event.location}` : ""}</p>

                          {event.short_description && <p className="mt-4 text-sm leading-6 text-[#a99c83]">{event.short_description}</p>}
                          {event.long_description && <p className="mt-4 text-sm leading-6 text-[#8f836d]">{event.long_description}</p>}

                          {event.max_participants && (
                            <p className="mt-4 text-sm text-[#b8ad96]">{tc("eventMaxParticipantsLabel")}: {getParticipantsForEvent(event.id).length} / {event.max_participants}</p>
                          )}

                          {getParticipantsForEvent(event.id).length > 0 && (
                            <div className="mt-4">
                              <p className="text-sm text-[#d9ccb1]">{tc("eventParticipants")}:</p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {getParticipantsForEvent(event.id).map((participant) => (
                                  <span key={participant.id} className="rounded-full border border-[#3b311d] px-3 py-1 text-xs text-[#cdbd9f]">{participant.full_name || participant.user_id}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {event.attachment_url && (
                            <div className="mt-4">
                              <a href={event.attachment_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-[#d7bf8a] underline underline-offset-4 hover:text-white">
                                <Paperclip className="h-4 w-4" />
                                {event.attachment_name || tc("eventOpenAttachment")}
                              </a>
                            </div>
                          )}

                          <div className="mt-6 flex items-center gap-3">
                            <input id={`join-${event.id}`} type="checkbox" checked={isRegisteredForEvent(event.id)} onChange={(e) => handleToggleParticipation(event.id, e.target.checked)} className="h-4 w-4 accent-[#b6924f]" />
                            <label htmlFor={`join-${event.id}`} className="text-sm text-[#e8dcc0]">{tc("eventAttend")}</label>
                          </div>

                          {isAdmin && (
                            <div className="mt-6 flex flex-wrap gap-3">
                              <button onClick={() => handleEditEvent(event)} className="rounded-full border border-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black">{tc("eventModify")}</button>
                              <button onClick={() => handleViewParticipants(event.id)} className="rounded-full border border-[#3b311d] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:border-[#b6924f]">{tc("eventParticipants")}</button>
                              <button onClick={() => handleArchiveEvent(event.id)} className="inline-flex items-center gap-2 rounded-full border border-[#6e5a2c] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:border-[#b6924f] hover:text-white"><Archive className="h-3.5 w-3.5" />{tc("eventArchive")}</button>
                              <button onClick={() => handleDeleteEvent(event.id)} className="inline-flex items-center gap-2 rounded-full border border-[#6a2f24] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:border-[#b74b39] hover:text-white"><Trash2 className="h-3.5 w-3.5" />{tc("eventDelete")}</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {isAdmin && (
                    <div className="mt-8 flex flex-wrap gap-4">
                      <button onClick={resetEventEditor} className="rounded-full bg-[#b6924f] px-5 py-3 text-sm uppercase tracking-[0.22em] text-black transition hover:bg-[#c6a45d]">{tc("eventCreate")}</button>
                    </div>
                  )}

                  {isAdmin && (
                    <div className="mt-8 rounded-[1.5rem] border border-[#2d2416] bg-[#0f0f0f] p-6">
                      <p className="text-xs uppercase tracking-[0.3em] text-[#b6924f]">{editingEventId ? tc("eventModify") : tc("eventCreate")}</p>

                      <div className="mt-6 grid gap-4 lg:grid-cols-2">
                        <input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} placeholder={tc("eventTitleLabel")} className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none placeholder:text-[#796c56]" />
                        <input value={eventForm.event_date} onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })} type="date" className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none" />
                        <input value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} placeholder={tc("eventLocationLabel")} className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none placeholder:text-[#796c56]" />
                        <input value={eventForm.max_participants} onChange={(e) => setEventForm({ ...eventForm, max_participants: e.target.value })} type="number" placeholder={tc("eventMaxParticipantsLabel")} className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none placeholder:text-[#796c56]" />
                        <input value={eventForm.short_description} onChange={(e) => setEventForm({ ...eventForm, short_description: e.target.value })} placeholder={tc("eventShortDescriptionLabel")} className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none placeholder:text-[#796c56] lg:col-span-2" />
                        <textarea value={eventForm.long_description} onChange={(e) => setEventForm({ ...eventForm, long_description: e.target.value })} placeholder={tc("eventLongDescriptionLabel")} className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none placeholder:text-[#796c56] lg:col-span-2" />

                        <div className="rounded-2xl border border-[#342a1a] bg-black/60 p-4 lg:col-span-2">
                          <label className="mb-3 flex items-center gap-2 text-sm text-[#efe2c5]"><ImageIcon className="h-4 w-4 text-[#b6924f]" />{tc("eventImageLabel")}</label>
                          <input type="file" accept="image/*" onChange={(e) => setEventImageFile(e.target.files?.[0] || null)} className="w-full text-[#efe2c5] outline-none" />
                        </div>

                        <div className="rounded-2xl border border-[#342a1a] bg-black/60 p-4 lg:col-span-2">
                          <label className="mb-3 flex items-center gap-2 text-sm text-[#efe2c5]"><Paperclip className="h-4 w-4 text-[#b6924f]" />{tc("eventAttachmentLabel")}</label>
                          <input type="file" onChange={(e) => setEventAttachmentFile(e.target.files?.[0] || null)} className="w-full text-[#efe2c5] outline-none" />
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-4">
                        <button onClick={handleCreateEvent} disabled={eventSaving} className="inline-flex items-center gap-2 rounded-full bg-[#b6924f] px-5 py-3 text-sm uppercase tracking-[0.22em] text-black transition hover:bg-[#c6a45d] disabled:cursor-not-allowed disabled:opacity-70">
                          {eventSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                          {editingEventId ? tc("eventSaveChanges") : tc("eventCreate")}
                        </button>

                        {editingEventId && (
                          <button onClick={resetEventEditor} className="rounded-full border border-[#b6924f] px-5 py-3 text-sm uppercase tracking-[0.22em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black">{tc("eventCancelEdit")}</button>
                        )}
                      </div>
                    </div>
                  )}

                  {participantsView && (
                    <div className="mt-8 rounded-[1.5rem] border border-[#2d2416] bg-[#0f0f0f] p-6">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-[#b6924f]">{tc("eventParticipants")}</p>
                        <button onClick={() => setParticipantsView(null)} className="rounded-full border border-[#3b311d] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:border-[#b6924f]">{tc("eventClose")}</button>
                      </div>

                      <div className="mt-6 space-y-3">
                        {participantsView.rows.length === 0 ? (
                          <p className="text-sm text-[#b8ad96]">{tc("eventNoParticipants")}</p>
                        ) : (
                          participantsView.rows.map((row) => <div key={row.id} className="rounded-xl border border-[#2d2416] bg-[#131313] p-4 text-sm text-[#e8dcc0]">{row.full_name}</div>)
                        )}
                      </div>
                    </div>
                  )}

                  {isAdmin && (
                    <div className="mt-10 rounded-[1.5rem] border border-[#2d2416] bg-[#0f0f0f] p-6">
                      <div className="flex items-center gap-3"><Archive className="h-5 w-5 text-[#b6924f]" /><h3 className="text-xl text-[#f2e6cf]">{tc("archivedEventsTitle")}</h3></div>

                      {archivedEvents.length === 0 ? (
                        <p className="mt-4 text-sm text-[#b8ad96]">{tc("archivedEventsEmpty")}</p>
                      ) : (
                        <div className="mt-6 grid gap-4 lg:grid-cols-2">
                          {archivedEvents.map((event) => (
                            <div key={`archived-${event.id}`} className="rounded-xl border border-[#2d2416] bg-[#131313] p-4">
                              <p className="text-lg text-[#f2e6cf]">{event.title}</p>
                              <p className="mt-2 text-sm text-[#a99c83]">{formatDateSafe(event.event_date, lang)}{event.location ? ` · ${event.location}` : ""}</p>
                              {event.archived_at && <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#8f836d]">{tc("archivedAt")}: {formatDateSafe(event.archived_at, lang)}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="rounded-[1.75rem] border border-[#2d2416] bg-[#131313] p-8">
                  <div className="flex items-center gap-3"><Save className="h-5 w-5 text-[#b6924f]" /><h3 className="text-xl text-[#f2e6cf]">{tc("accountTitle")}</h3></div>
                  <p className="mt-3 text-sm leading-6 text-[#a99c83]">{tc("accountSubtitle")}</p>

                  <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-[1.25rem] border border-[#2d2416] bg-[#0f0f0f] p-5">
                      <label className="mb-2 block text-sm text-[#d9ccb1]">{tc("accountDisplayName")}</label>
                      <input value={accountName} onChange={(e) => setAccountName(e.target.value)} className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none" />
                      <button onClick={handleUpdateProfileName} disabled={accountLoading} className="mt-4 rounded-full border border-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black disabled:cursor-not-allowed disabled:opacity-70">{tc("accountSaveName")}</button>
                    </div>

                    <div className="rounded-[1.25rem] border border-[#2d2416] bg-[#0f0f0f] p-5">
                      <label className="mb-2 block text-sm text-[#d9ccb1]">{tc("accountEmail")}</label>
                      <input type="email" value={accountEmail} onChange={(e) => setAccountEmail(e.target.value)} className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none" />
                      <button onClick={handleUpdateEmail} disabled={accountLoading} className="mt-4 rounded-full border border-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black disabled:cursor-not-allowed disabled:opacity-70">{tc("accountSaveEmail")}</button>
                    </div>

                    <div className="rounded-[1.25rem] border border-[#2d2416] bg-[#0f0f0f] p-5 lg:col-span-2">
                      <div className="grid gap-4 lg:grid-cols-2">
                        <div><label className="mb-2 block text-sm text-[#d9ccb1]">{tc("accountNewPassword")}</label><input type="password" value={accountPassword} onChange={(e) => setAccountPassword(e.target.value)} className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none" /></div>
                        <div><label className="mb-2 block text-sm text-[#d9ccb1]">{tc("accountConfirmPassword")}</label><input type="password" value={accountPasswordConfirm} onChange={(e) => setAccountPasswordConfirm(e.target.value)} className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none" /></div>
                      </div>

                      <button onClick={handleUpdatePassword} disabled={accountLoading} className="mt-4 rounded-full border border-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black disabled:cursor-not-allowed disabled:opacity-70">{tc("accountSavePassword")}</button>
                    </div>
                  </div>
                </div>

                {isAdmin && (
                  <div className="rounded-[1.75rem] border border-[#2d2416] bg-[#131313] p-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div><h3 className="text-xl text-[#f2e6cf]">{tc("adminTitle")}</h3><p className="mt-3 text-sm leading-6 text-[#a99c83]">{tc("adminSubtitle")}</p></div>
                      <Link href="/admin/pages" className="inline-flex items-center gap-2 rounded-full border border-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black"><FileText className="h-3.5 w-3.5" />{tc("navAdminPages")}</Link>
                    </div>

                    <div className="mt-8 grid gap-6 lg:grid-cols-2">
                      <div className="rounded-[1.25rem] border border-[#2d2416] bg-[#0f0f0f] p-5">
                        <h4 className="text-lg text-[#f2e6cf]">{tc("adminEnquiries")}</h4>

                        {enquiriesLoading ? (
                          <p className="mt-4 text-sm text-[#b8ad96]">Loading...</p>
                        ) : enquiries.length === 0 ? (
                          <p className="mt-4 text-sm text-[#b8ad96]">{tc("adminNoEnquiries")}</p>
                        ) : (
                          <div className="mt-4 space-y-4">
                            {enquiries.map((enquiry) => (
                              <div key={enquiry.id} className="rounded-xl border border-[#2d2416] bg-[#131313] p-4">
                                <p className="text-sm text-[#f2e6cf]">{enquiry.full_name}</p>
                                <p className="mt-1 text-sm text-[#b8ad96]">{enquiry.email}</p>
                                {enquiry.interest_note && <p className="mt-3 text-sm leading-6 text-[#a99c83]">{enquiry.interest_note}</p>}
                                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[#8f836d]">{enquiry.status === "reviewed" ? tc("adminReviewed") : tc("adminNew")}</p>
                                {enquiry.status !== "reviewed" && <button onClick={() => handleMarkEnquiryReviewed(enquiry.id)} className="mt-4 rounded-full border border-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black">{tc("adminMarkReviewed")}</button>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="rounded-[1.25rem] border border-[#2d2416] bg-[#0f0f0f] p-5">
                        <h4 className="text-lg text-[#f2e6cf]">{tc("adminMembers")}</h4>

                        {missingProfileUsers.length > 0 && (
                          <div className="mt-4 space-y-4">
                            {missingProfileUsers.map((authUser) => (
                              <div key={`missing-${authUser.id}`} className="rounded-xl border border-[#5a4120] bg-[#17120d] p-4">
                                <p className="text-sm text-[#f2e6cf]">{authUser.email}</p>
                                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#b6924f]">{tc("adminMissingProfile")}</p>

                                <div className="mt-4 space-y-3">
                                  <label className="block text-[11px] uppercase tracking-[0.18em] text-[#8f836d]">{tc("adminRole")}</label>
                                  <select value={memberRoleDrafts[authUser.id] || "member"} onChange={(e) => setMemberRoleDrafts((prev) => ({ ...prev, [authUser.id]: e.target.value }))} className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-3 text-[#efe2c5] outline-none">
                                    <option value="member">member</option>
                                    <option value="admin">admin</option>
                                  </select>

                                  <button onClick={() => handleCreateProfile(authUser.id, authUser.email)} className="rounded-full bg-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-black transition hover:bg-[#c6a45d]">{tc("adminCreateProfile")}</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {memberProfilesAdmin.length === 0 ? (
                          <p className="mt-4 text-sm text-[#b8ad96]">{tc("adminNoMembers")}</p>
                        ) : (
                          <div className="mt-4 space-y-4">
                            {memberProfilesAdmin.map((member) => (
                              <div key={member.id} className="rounded-xl border border-[#2d2416] bg-[#131313] p-4">
                                <p className="text-sm text-[#f2e6cf]">{member.full_name || member.id}</p>
                                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#8f836d]">{member.approved ? tc("adminApproved") : tc("adminPending")}</p>

                                <div className="mt-4 space-y-3">
                                  <label className="block text-[11px] uppercase tracking-[0.18em] text-[#8f836d]">{tc("adminRole")}</label>
                                  <select value={memberRoleDrafts[member.id] || member.role || "member"} onChange={(e) => setMemberRoleDrafts((prev) => ({ ...prev, [member.id]: e.target.value }))} className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-3 text-[#efe2c5] outline-none">
                                    <option value="member">member</option>
                                    <option value="admin">admin</option>
                                  </select>

                                  <button onClick={() => handleUpdateMemberRole(member.id)} className="rounded-full border border-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black">{tc("adminSaveRole")}</button>
                                </div>

                                {!member.approved && <button onClick={() => handleApproveMember(member.id)} className="mt-4 rounded-full bg-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-black transition hover:bg-[#c6a45d]">{tc("adminApprove")}</button>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {showLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[2rem] border border-[#3a2f1b] bg-[#0d0d0d] p-8 shadow-2xl shadow-black/40">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#b6924f]">The Heritage Drivers</p>
                  <h3 className="mt-3 text-2xl text-[#f0e3c6]">{tc("loginTitle")}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#ad9f86]">{tc("loginSubtitle")}</p>
                </div>

                <button onClick={() => setShowLogin(false)} className="rounded-full border border-[#332818] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#b7aa90] hover:border-[#b6924f] hover:text-white">{tc("loginClose")}</button>
              </div>

              <div className="mt-8 space-y-4">
                {authMode === "signup" && (
                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c7e65]" />
                    <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={tc("loginFullName")} className="w-full rounded-2xl border border-[#342a1a] bg-black/60 py-4 pl-11 pr-4 text-[#efe2c5] outline-none placeholder:text-[#796c56] focus:border-[#b6924f]" />
                  </div>
                )}

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c7e65]" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={tc("loginEmail")} className="w-full rounded-2xl border border-[#342a1a] bg-black/60 py-4 pl-11 pr-4 text-[#efe2c5] outline-none placeholder:text-[#796c56] focus:border-[#b6924f]" />
                </div>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c7e65]" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={tc("loginPassword")} className="w-full rounded-2xl border border-[#342a1a] bg-black/60 py-4 pl-11 pr-4 text-[#efe2c5] outline-none placeholder:text-[#796c56] focus:border-[#b6924f]" />
                </div>

                <button onClick={authMode === "login" ? handleLogin : handleSignup} disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#b6924f] px-6 py-4 text-sm uppercase tracking-[0.28em] text-black transition hover:bg-[#c6a45d] disabled:cursor-not-allowed disabled:opacity-70">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {authMode === "login" ? tc("loginSubmit") : tc("signupSubmit")}
                </button>

                <button onClick={() => { resetStatus(); setAuthMode(authMode === "login" ? "signup" : "login"); }} className="w-full text-sm text-[#cdbd9f] underline underline-offset-4 hover:text-white">
                  {authMode === "login" ? tc("switchToSignup") : tc("switchToLogin")}
                </button>

                <p className="text-center text-xs text-[#7f735c]">{tc("loginForgot")}</p>
                <p className="text-center text-xs uppercase tracking-[0.25em] text-[#7f735c]">{tc("loginNote")}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-[#2a2213] bg-[#0b0b0b]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-3">
          <div>
            <EditableText isAdmin={isAdmin} value={tc("footerImprintTitle")} onSave={(v) => saveContentField("footerImprintTitle", v)} className="text-sm uppercase tracking-[0.3em] text-[#b6924f]" as="h4" modifyLabel={tc("modify")} saveLabel={tc("save")} cancelLabel={tc("cancel")} />
            <EditableText isAdmin={isAdmin} value={tc("footerImprintText")} onSave={(v) => saveContentField("footerImprintText", v)} className="mt-4 text-sm leading-6 text-[#a99c83]" as="p" multiline modifyLabel={tc("modify")} saveLabel={tc("save")} cancelLabel={tc("cancel")} />
            <Link href="/impressum" className="mt-4 inline-block text-sm text-[#d7bf8a] underline underline-offset-4">{tc("footerImprintLink")}</Link>
          </div>

          <div>
            <EditableText isAdmin={isAdmin} value={tc("footerAffiliationTitle")} onSave={(v) => saveContentField("footerAffiliationTitle", v)} className="text-sm uppercase tracking-[0.3em] text-[#b6924f]" as="h4" modifyLabel={tc("modify")} saveLabel={tc("save")} cancelLabel={tc("cancel")} />
            <EditableText isAdmin={isAdmin} value={tc("footerAffiliationText")} onSave={(v) => saveContentField("footerAffiliationText", v)} className="mt-4 text-sm leading-6 text-[#a99c83]" as="p" multiline modifyLabel={tc("modify")} saveLabel={tc("save")} cancelLabel={tc("cancel")} />
          </div>

          <div>
            <EditableText isAdmin={isAdmin} value={tc("footerSponsorsTitle")} onSave={(v) => saveContentField("footerSponsorsTitle", v)} className="text-sm uppercase tracking-[0.3em] text-[#b6924f]" as="h4" modifyLabel={tc("modify")} saveLabel={tc("save")} cancelLabel={tc("cancel")} />
            <EditableText isAdmin={isAdmin} value={tc("footerSponsorsText")} onSave={(v) => saveContentField("footerSponsorsText", v)} className="mt-4 text-sm leading-6 text-[#a99c83]" as="p" multiline modifyLabel={tc("modify")} saveLabel={tc("save")} cancelLabel={tc("cancel")} />
          </div>
        </div>

        <div className="border-t border-[#1e1a12] px-6 py-4 text-center text-xs uppercase tracking-[0.25em] text-[#7f735c]">
          {tc("footerBottomLine")}
        </div>
      </footer>
    </div>
  );
}
