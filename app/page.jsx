"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Lock,
  LogOut,
  Mail,
  Shield,
  User,
  Wrench,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Image as ImageIcon,
  Paperclip,
  Save,
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

  const [events, setEvents] = useState([]);
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

  const t = {
    en: {
      nav: ["Society", "Philosophy", "Membership"],
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
        forgot: "Password reset can be added via Supabase if desired.",
      },
      members: {
        label: "Members",
        title: "Private Members Area",
        subtitle:
          "A discreet section for members, events and society information.",
        welcome: "Welcome back",
        intro:
          "Your account is protected by Supabase authentication. Member data, events and protected content can be maintained securely.",
        eventTitle: "Upcoming Drive",
        eventText: "Season Opening · 19.04.2026 · Private confirmation required.",
        registryTitle: "Members Notes",
        registryText:
          "Discreet updates, club notices and society correspondence.",
        atelierTitle: "Technical Circle",
        atelierText:
          "Selected workshop evenings, heritage discussions and mechanical exchange.",
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
        eventDeleteConfirm: "Do you really want to delete this event?",
        profileUpdateSuccess: "Profile name updated successfully.",
        emailUpdateSuccess:
          "Email update requested. Please confirm via the email sent by Supabase.",
        passwordUpdateSuccess: "Password updated successfully.",
        passwordMismatch: "The new passwords do not match.",
        passwordTooShort: "Please use a password with at least 8 characters.",
        participantUpdateSuccess: "Attendance updated successfully.",
        uploadError: "File upload failed.",
      },
      account: {
        title: "Account Settings",
        subtitle: "Maintain your member details and access credentials.",
        fullName: "Display name",
        email: "Email address",
        newPassword: "New password",
        confirmPassword: "Confirm new password",
        saveName: "Save Name",
        saveEmail: "Save Email",
        savePassword: "Save Password",
      },
      event: {
        sectionTitle: "Upcoming Events & Attendance",
        sectionText:
          "Manage upcoming drives, review attendance and maintain event details for the society.",
        loading: "Loading events...",
        empty: "No events available yet.",
        attend: "Attend this event",
        participants: "Participants",
        close: "Close",
        modify: "Modify Event",
        create: "Create Event",
        cancelEdit: "Cancel Edit",
        title: "Event title",
        date: "Event date",
        location: "Location",
        maxParticipants: "Max participants",
        shortDescription: "Short description",
        longDescription: "Detailed description",
        image: "Event image",
        attachment: "Event attachment",
        saveChanges: "Save Changes",
        noParticipants: "No participants registered yet.",
        upcoming: "Upcoming Event",
        maxParticipantsLabel: "Max participants",
        openAttachment: "Open attachment",
        delete: "Delete Event",
      },
    },
    de: {
      nav: ["Gesellschaft", "Philosophie", "Mitgliedschaft"],
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
        subtitle:
          "Ausschliesslich für registrierte Mitglieder der Gesellschaft.",
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
        subtitle:
          "Ein diskreter Bereich für Mitglieder, Veranstaltungen und Gesellschaftsinformationen.",
        welcome: "Willkommen zurück",
        intro:
          "Ihr Konto ist über Supabase-Authentifizierung geschützt. Mitgliederdaten, Events und geschützte Inhalte können sicher gepflegt werden.",
        eventTitle: "Nächste Ausfahrt",
        eventText:
          "Season Opening · 19.04.2026 · Teilnahme nur nach Bestätigung.",
        registryTitle: "Mitteilungen",
        registryText:
          "Diskrete Updates, Club-Hinweise und Korrespondenz der Gesellschaft.",
        atelierTitle: "Technischer Zirkel",
        atelierText:
          "Ausgewählte Werkstattabende, Heritage-Gespräche und mechanischer Austausch.",
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
        eventDeleteConfirm: "Soll dieses Event wirklich gelöscht werden?",
        profileUpdateSuccess: "Anzeigename erfolgreich aktualisiert.",
        emailUpdateSuccess:
          "Änderung der E-Mail angestossen. Bitte die Bestätigungs-E-Mail von Supabase prüfen.",
        passwordUpdateSuccess: "Passwort erfolgreich aktualisiert.",
        passwordMismatch: "Die neuen Passwörter stimmen nicht überein.",
        passwordTooShort:
          "Bitte verwenden Sie ein Passwort mit mindestens 8 Zeichen.",
        participantUpdateSuccess: "Teilnahme erfolgreich aktualisiert.",
        uploadError: "Datei-Upload fehlgeschlagen.",
      },
      account: {
        title: "Kontoeinstellungen",
        subtitle:
          "Pflegen Sie Ihre Mitgliederdaten und Zugangsinformationen.",
        fullName: "Anzeigename",
        email: "E-Mail-Adresse",
        newPassword: "Neues Passwort",
        confirmPassword: "Neues Passwort bestätigen",
        saveName: "Name speichern",
        saveEmail: "E-Mail speichern",
        savePassword: "Passwort speichern",
      },
      event: {
        sectionTitle: "Anstehende Events & Teilnahme",
        sectionText:
          "Verwalten Sie Ausfahrten, prüfen Sie Anmeldungen und pflegen Sie die Event-Daten der Gesellschaft.",
        loading: "Events werden geladen...",
        empty: "Noch keine Events vorhanden.",
        attend: "An diesem Event teilnehmen",
        participants: "Teilnehmer",
        close: "Schliessen",
        modify: "Event bearbeiten",
        create: "Event erstellen",
        cancelEdit: "Bearbeitung abbrechen",
        title: "Event-Titel",
        date: "Event-Datum",
        location: "Ort",
        maxParticipants: "Max. Teilnehmer",
        shortDescription: "Kurzbeschreibung",
        longDescription: "Ausführliche Beschreibung",
        image: "Event-Bild",
        attachment: "Event-Anhang",
        saveChanges: "Änderungen speichern",
        noParticipants: "Noch keine Teilnehmer angemeldet.",
        upcoming: "Anstehendes Event",
        maxParticipantsLabel: "Max. Teilnehmer",
        openAttachment: "Anhang öffnen",
        delete: "Event löschen",
      },
    },
  };

  const content = t[lang];
  const isLoggedIn = !!session;
  const isAdmin = profile?.role === "admin";

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
    setEvents([]);
    setParticipants([]);
    setParticipantsView(null);
    setEditingEventId(null);
    setEventForm(emptyEventForm);
    setEventImageFile(null);
    setEventAttachmentFile(null);
    setAccountPassword("");
    setAccountPasswordConfirm("");
  };

  const syncAccountFields = (nextProfile, nextSession) => {
    setAccountName(nextProfile?.full_name || "");
    setAccountEmail(nextSession?.user?.email || "");
  };

  const loadProfile = async (userId) => {
    if (!supabase || !userId) return null;

    const { data, error } = await supabase
      .from("member_profiles")
      .select("id, full_name, role, approved")
      .eq("id", userId)
      .single();

    if (error) {
      return null;
    }

    setProfile(data);
    syncAccountFields(data, session);
    return data;
  };

  const loadEvents = async () => {
    if (!supabase) return;

    setEventsLoading(true);

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    if (!error && data) {
      setEvents(data);
    }

    setEventsLoading(false);
  };

  const loadParticipants = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("event_participants")
      .select("id, event_id, user_id, status, created_at");

    if (!error && data) {
      setParticipants(data);
    }
  };

  const loadAppData = async (currentSession) => {
    if (!currentSession?.user) return;

    const loadedProfile = await loadProfile(currentSession.user.id);
    syncAccountFields(loadedProfile, currentSession);
    await loadEvents();
    await loadParticipants();
  };

  useEffect(() => {
    if (!supabase) {
      setInitializing(false);
      return;
    }

    let mounted = true;

    const init = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(currentSession);

      if (currentSession?.user) {
        await loadAppData(currentSession);
      } else {
        clearAppState();
      }

      if (mounted) {
        setInitializing(false);
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!mounted) return;

      setSession(currentSession);

      if (currentSession?.user) {
        await loadAppData(currentSession);
      } else {
        clearAppState();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const uploadFileToBucket = async ({ bucket, folder, file, makePublic = true }) => {
    if (!supabase || !file || !session?.user) return { url: "", name: "" };

    const fileExt = file.name.split(".").pop();
    const safeExt = fileExt ? `.${fileExt}` : "";
    const fileName = `${session.user.id}-${Date.now()}${safeExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    if (makePublic) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return {
        url: data?.publicUrl || "",
        name: file.name,
      };
    }

    return {
      url: filePath,
      name: file.name,
    };
  };

  const handleUploadEventImage = async () => {
    return uploadFileToBucket({
      bucket: "event-images",
      folder: "events",
      file: eventImageFile,
      makePublic: true,
    });
  };

  const handleUploadEventAttachment = async () => {
    return uploadFileToBucket({
      bucket: "event-files",
      folder: "attachments",
      file: eventAttachmentFile,
      makePublic: true,
    });
  };

  const handleLogin = async () => {
    resetStatus();

    if (!supabase) {
      setStatus({ type: "error", message: content.setup.text });
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
        message: error.message || content.messages.genericError,
      });
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
        message: error.message || content.messages.genericError,
      });
      return;
    }

    if (data.user?.id) {
      await supabase.from("member_profiles").upsert({
        id: data.user.id,
        full_name: fullName.trim(),
        role: "member",
        approved: true,
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
      clearAppState();
      return;
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      setStatus({
        type: "error",
        message: error.message || content.messages.genericError,
      });
      return;
    }

    clearAppState();
    setPassword("");
    setStatus({ type: "success", message: content.messages.logoutSuccess });
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

    await loadProfile(session.user.id);
    setStatus({
      type: "success",
      message: content.messages.profileUpdateSuccess,
    });
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

    setStatus({
      type: "success",
      message: content.messages.emailUpdateSuccess,
    });
  };

  const handleUpdatePassword = async () => {
    resetStatus();

    if (!supabase || !session?.user) return;

    if (accountPassword !== accountPasswordConfirm) {
      setStatus({
        type: "error",
        message: content.messages.passwordMismatch,
      });
      return;
    }

    if (accountPassword.length < 8) {
      setStatus({
        type: "error",
        message: content.messages.passwordTooShort,
      });
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
    setStatus({
      type: "success",
      message: content.messages.passwordUpdateSuccess,
    });
  };

  const handleCreateEvent = async () => {
    resetStatus();

    if (!supabase || !session?.user || !isAdmin) {
      setStatus({
        type: "error",
        message: content.messages.notAuthorized,
      });
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
        created_by: session.user.id,
        is_active: true,
      };

      let response;

      if (editingEventId) {
        response = await supabase
          .from("events")
          .update(payload)
          .eq("id", editingEventId);
      } else {
        response = await supabase.from("events").insert(payload);
      }

      if (response.error) {
        setStatus({
          type: "error",
          message: response.error.message || content.messages.eventCreateError,
        });
        setEventSaving(false);
        return;
      }

      setStatus({
        type: "success",
        message: editingEventId
          ? content.messages.eventUpdateSuccess
          : content.messages.eventCreateSuccess,
      });

      setEventForm(emptyEventForm);
      setEventImageFile(null);
      setEventAttachmentFile(null);
      setEditingEventId(null);

      await loadEvents();
    } catch (err) {
      setStatus({
        type: "error",
        message: err?.message || content.messages.uploadError,
      });
    }

    setEventSaving(false);
  };

  const handleDeleteEvent = async (eventId) => {
    resetStatus();

    if (!supabase || !session?.user || !isAdmin) {
      setStatus({
        type: "error",
        message: content.messages.notAuthorized,
      });
      return;
    }

    const confirmed = window.confirm(content.messages.eventDeleteConfirm);
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
    setStatus({
      type: "success",
      message: content.messages.eventDeleteSuccess,
    });
    await loadEvents();
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
    setStatus({
      type: "success",
      message: content.messages.participantUpdateSuccess,
    });
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
      setParticipantsView({
        eventId,
        rows: [],
      });
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

    setParticipantsView({
      eventId,
      rows,
    });
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8dcc0]">
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
                    resetStatus();
                    setAuthMode("login");
                    setShowLogin(true);
                  }}
                  className="inline-flex rounded-full border border-[#3b311d] px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#e8dcc0] transition hover:border-[#b6924f] hover:text-white"
                >
                  {content.login.button}
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full border border-[#3b311d] px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#e8dcc0] transition hover:border-[#b6924f] hover:text-white"
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
            <p className="text-xs uppercase tracking-[0.35em] text-[#b6924f]">
              {content.setup.title}
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#cfbea3]">
              {content.setup.text}
            </p>
          </div>
        )}

        <section>
          <div className="mb-10 flex justify-center">
            <img
              src="/logo.png"
              alt="The Heritage Drivers"
              className="h-40 object-contain"
            />
          </div>

          {!isLoggedIn ? (
            <>
              <p className="text-sm uppercase tracking-[0.4em] text-[#b6924f]">
                {content.heroTag}
              </p>

              <h1 className="mt-6 text-5xl leading-tight text-[#f2e6cf]">
                {content.heroTitle.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </h1>

              <p className="mt-6 max-w-xl text-lg text-[#bcb09a]">
                {content.heroText}
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <button className="bg-[#b6924f] px-6 py-3 text-black">
                  {content.cta1}
                </button>
                <button className="border border-[#b6924f] px-6 py-3">
                  {content.cta2}
                </button>
                <button
                  onClick={() => {
                    resetStatus();
                    setAuthMode("login");
                    setShowLogin(true);
                  }}
                  className="border border-[#3b311d] px-6 py-3 text-[#e8dcc0]"
                >
                  {content.login.button}
                </button>
              </div>

              <div className="mt-10 flex flex-wrap gap-6 text-sm uppercase text-[#8b7e65]">
                {content.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-sm uppercase tracking-[0.4em] text-[#b6924f]">
                {content.members.secure}
              </p>

              <h1 className="mt-6 text-5xl leading-tight text-[#f2e6cf]">
                {content.members.welcome}, {memberName}
              </h1>

              <p className="mt-6 max-w-2xl text-lg text-[#bcb09a]">
                {content.members.intro}
              </p>

              <div className="mt-10 grid gap-6 lg:grid-cols-3">
                <div className="rounded-[1.5rem] border border-[#2d2416] bg-[#131313] p-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-[#b6924f]" />
                    <h3 className="text-lg text-[#f2e6cf]">
                      {content.members.eventTitle}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#a99c83]">
                    {content.members.eventText}
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-[#2d2416] bg-[#131313] p-6">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-[#b6924f]" />
                    <h3 className="text-lg text-[#f2e6cf]">
                      {content.members.registryTitle}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#a99c83]">
                    {content.members.registryText}
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-[#2d2416] bg-[#131313] p-6">
                  <div className="flex items-center gap-3">
                    <Wrench className="h-5 w-5 text-[#b6924f]" />
                    <h3 className="text-lg text-[#f2e6cf]">
                      {content.members.atelierTitle}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#a99c83]">
                    {content.members.atelierText}
                  </p>
                </div>
              </div>
            </>
          )}
        </section>

        {!isLoggedIn && (
          <section className="mt-24 grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl text-[#f0e3c6]">
                {content.philosophyTitle}
              </h2>
            </div>

            <div className="rounded-[2rem] border border-[#2d2416] bg-[#111111] p-8">
              <div className="flex items-center gap-3">
                <div className="rounded-full border border-[#3a2f1c] p-3">
                  <User className="h-5 w-5 text-[#b6924f]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#b6924f]">
                    {content.members.label}
                  </p>
                  <p className="mt-2 text-sm text-[#b9ad95]">
                    {content.login.subtitle}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  resetStatus();
                  setAuthMode("login");
                  setShowLogin(true);
                }}
                className="mt-6 rounded-full border border-[#b6924f] px-5 py-3 text-sm uppercase tracking-[0.24em] text-[#f0e3c6] transition hover:bg-[#b6924f] hover:text-black"
              >
                {content.login.button}
              </button>
            </div>
          </section>
        )}

        {!isLoggedIn && (
          <section className="mt-24">
            <h2 className="text-3xl text-[#f0e3c6]">
              {content.membershipTitle}
            </h2>
            <p className="mt-6 max-w-xl text-[#bcb09a]">
              {content.membershipText}
            </p>

            <div className="mt-10 max-w-md space-y-4">
              <input
                placeholder={content.form.name}
                className="w-full border border-[#342a1a] bg-black p-3 text-[#efe2c5]"
              />
              <input
                placeholder={content.form.email}
                className="w-full border border-[#342a1a] bg-black p-3 text-[#efe2c5]"
              />
              <textarea
                placeholder={content.form.message}
                className="w-full border border-[#342a1a] bg-black p-3 text-[#efe2c5]"
              />
              <button className="w-full bg-[#b6924f] px-6 py-3 text-black">
                {content.form.submit}
              </button>
            </div>
          </section>
        )}

        <section className="mt-24" id="members">
          <div className="rounded-[2rem] border border-[#2c2415] bg-[#0f0f0f] p-8 shadow-2xl shadow-black/30">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#b6924f]">
                  {isLoggedIn ? "Club Events" : content.members.secure}
                </p>
                <h2 className="mt-4 text-3xl text-[#f2e6cf]">
                  {isLoggedIn
                    ? content.event.sectionTitle
                    : content.members.title}
                </h2>
                <p className="mt-4 max-w-2xl text-[#b8ad96]">
                  {isLoggedIn
                    ? content.event.sectionText
                    : content.members.subtitle}
                </p>
              </div>

              <div className="flex gap-3">
                {!isLoggedIn ? (
                  <button
                    onClick={() => {
                      resetStatus();
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
                  {
                    icon: Shield,
                    title: content.members.preview,
                    text: content.members.intro,
                  },
                  {
                    icon: Calendar,
                    title: content.members.eventTitle,
                    text: content.members.eventText,
                  },
                  {
                    icon: Wrench,
                    title: content.members.atelierTitle,
                    text: content.members.atelierText,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-[1.5rem] border border-[#2d2416] bg-[#131313] p-6"
                    >
                      <Icon className="h-5 w-5 text-[#b6924f]" />
                      <h3 className="mt-4 text-lg text-[#f2e6cf]">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[#a99c83]">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-8 grid gap-6">
                <div className="rounded-[1.75rem] border border-[#2d2416] bg-[#131313] p-8">
                  {eventsLoading ? (
                    <p className="text-sm text-[#b8ad96]">
                      {content.event.loading}
                    </p>
                  ) : events.length === 0 ? (
                    <p className="text-sm text-[#b8ad96]">
                      {content.event.empty}
                    </p>
                  ) : (
                    <div className="grid gap-6 lg:grid-cols-2">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className="rounded-[1.5rem] border border-[#2d2416] bg-[#0f0f0f] p-6"
                        >
                          {event.image_url && (
                            <img
                              src={event.image_url}
                              alt={event.title}
                              className="mb-4 h-48 w-full rounded-2xl object-cover"
                            />
                          )}

                          <p className="text-xs uppercase tracking-[0.3em] text-[#b6924f]">
                            {content.event.upcoming}
                          </p>

                          <h4 className="mt-3 text-xl text-[#f2e6cf]">
                            {event.title}
                          </h4>

                          <p className="mt-2 text-sm text-[#a99c83]">
                            {event.event_date}
                            {event.location ? ` · ${event.location}` : ""}
                          </p>

                          {event.short_description && (
                            <p className="mt-4 text-sm leading-6 text-[#a99c83]">
                              {event.short_description}
                            </p>
                          )}

                          {event.long_description && (
                            <p className="mt-4 text-sm leading-6 text-[#8f836d]">
                              {event.long_description}
                            </p>
                          )}

                          {event.max_participants && (
                            <p className="mt-4 text-sm text-[#b8ad96]">
                              {content.event.maxParticipantsLabel}:{" "}
                              {event.max_participants}
                            </p>
                          )}

                          {event.attachment_url && (
                            <div className="mt-4">
                              <a
                                href={event.attachment_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-[#d7bf8a] underline underline-offset-4 hover:text-white"
                              >
                                <Paperclip className="h-4 w-4" />
                                {event.attachment_name ||
                                  content.event.openAttachment}
                              </a>
                            </div>
                          )}

                          <div className="mt-6 flex items-center gap-3">
                            <input
                              id={`join-${event.id}`}
                              type="checkbox"
                              checked={isRegisteredForEvent(event.id)}
                              onChange={(e) =>
                                handleToggleParticipation(
                                  event.id,
                                  e.target.checked
                                )
                              }
                              className="h-4 w-4 accent-[#b6924f]"
                            />
                            <label
                              htmlFor={`join-${event.id}`}
                              className="text-sm text-[#e8dcc0]"
                            >
                              {content.event.attend}
                            </label>
                          </div>

                          {isAdmin && (
                            <div className="mt-6 flex flex-wrap gap-3">
                              <button
                                onClick={() => handleEditEvent(event)}
                                className="rounded-full border border-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black"
                              >
                                {content.event.modify}
                              </button>

                              <button
                                onClick={() => handleViewParticipants(event.id)}
                                className="rounded-full border border-[#3b311d] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:border-[#b6924f]"
                              >
                                {content.event.participants}
                              </button>

                              <button
                                onClick={() => handleDeleteEvent(event.id)}
                                className="inline-flex items-center gap-2 rounded-full border border-[#6a2f24] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:border-[#b74b39] hover:text-white"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                {content.event.delete}
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {isAdmin && (
                    <div className="mt-8 flex flex-wrap gap-4">
                      <button
                        onClick={resetEventEditor}
                        className="rounded-full bg-[#b6924f] px-5 py-3 text-sm uppercase tracking-[0.22em] text-black transition hover:bg-[#c6a45d]"
                      >
                        {content.event.create}
                      </button>
                    </div>
                  )}

                  {isAdmin && (
                    <div className="mt-8 rounded-[1.5rem] border border-[#2d2416] bg-[#0f0f0f] p-6">
                      <p className="text-xs uppercase tracking-[0.3em] text-[#b6924f]">
                        {editingEventId
                          ? content.event.modify
                          : content.event.create}
                      </p>

                      <div className="mt-6 grid gap-4 lg:grid-cols-2">
                        <input
                          value={eventForm.title}
                          onChange={(e) =>
                            setEventForm({
                              ...eventForm,
                              title: e.target.value,
                            })
                          }
                          placeholder={content.event.title}
                          className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none placeholder:text-[#796c56]"
                        />

                        <input
                          value={eventForm.event_date}
                          onChange={(e) =>
                            setEventForm({
                              ...eventForm,
                              event_date: e.target.value,
                            })
                          }
                          type="date"
                          className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none"
                        />

                        <input
                          value={eventForm.location}
                          onChange={(e) =>
                            setEventForm({
                              ...eventForm,
                              location: e.target.value,
                            })
                          }
                          placeholder={content.event.location}
                          className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none placeholder:text-[#796c56]"
                        />

                        <input
                          value={eventForm.max_participants}
                          onChange={(e) =>
                            setEventForm({
                              ...eventForm,
                              max_participants: e.target.value,
                            })
                          }
                          type="number"
                          placeholder={content.event.maxParticipants}
                          className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none placeholder:text-[#796c56]"
                        />

                        <input
                          value={eventForm.short_description}
                          onChange={(e) =>
                            setEventForm({
                              ...eventForm,
                              short_description: e.target.value,
                            })
                          }
                          placeholder={content.event.shortDescription}
                          className="lg:col-span-2 w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none placeholder:text-[#796c56]"
                        />

                        <textarea
                          value={eventForm.long_description}
                          onChange={(e) =>
                            setEventForm({
                              ...eventForm,
                              long_description: e.target.value,
                            })
                          }
                          placeholder={content.event.longDescription}
                          className="lg:col-span-2 w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none placeholder:text-[#796c56]"
                        />

                        <div className="lg:col-span-2 rounded-2xl border border-[#342a1a] bg-black/60 p-4">
                          <label className="mb-3 flex items-center gap-2 text-sm text-[#efe2c5]">
                            <ImageIcon className="h-4 w-4 text-[#b6924f]" />
                            {content.event.image}
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              setEventImageFile(e.target.files?.[0] || null)
                            }
                            className="w-full text-[#efe2c5] outline-none"
                          />
                          {eventForm.image_url && !eventImageFile && (
                            <p className="mt-2 text-xs text-[#9e8f74]">
                              Existing image kept until replaced.
                            </p>
                          )}
                        </div>

                        <div className="lg:col-span-2 rounded-2xl border border-[#342a1a] bg-black/60 p-4">
                          <label className="mb-3 flex items-center gap-2 text-sm text-[#efe2c5]">
                            <Paperclip className="h-4 w-4 text-[#b6924f]" />
                            {content.event.attachment}
                          </label>
                          <input
                            type="file"
                            onChange={(e) =>
                              setEventAttachmentFile(
                                e.target.files?.[0] || null
                              )
                            }
                            className="w-full text-[#efe2c5] outline-none"
                          />
                          {eventForm.attachment_url && !eventAttachmentFile && (
                            <p className="mt-2 text-xs text-[#9e8f74]">
                              Existing attachment kept until replaced.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-4">
                        <button
                          onClick={handleCreateEvent}
                          disabled={eventSaving}
                          className="inline-flex items-center gap-2 rounded-full bg-[#b6924f] px-5 py-3 text-sm uppercase tracking-[0.22em] text-black transition hover:bg-[#c6a45d] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {eventSaving && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                          {editingEventId
                            ? content.event.saveChanges
                            : content.event.create}
                        </button>

                        {editingEventId && (
                          <button
                            onClick={resetEventEditor}
                            className="rounded-full border border-[#b6924f] px-5 py-3 text-sm uppercase tracking-[0.22em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black"
                          >
                            {content.event.cancelEdit}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {participantsView && (
                    <div className="mt-8 rounded-[1.5rem] border border-[#2d2416] bg-[#0f0f0f] p-6">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-[#b6924f]">
                          {content.event.participants}
                        </p>
                        <button
                          onClick={() => setParticipantsView(null)}
                          className="rounded-full border border-[#3b311d] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:border-[#b6924f]"
                        >
                          {content.event.close}
                        </button>
                      </div>

                      <div className="mt-6 space-y-3">
                        {participantsView.rows.length === 0 ? (
                          <p className="text-sm text-[#b8ad96]">
                            {content.event.noParticipants}
                          </p>
                        ) : (
                          participantsView.rows.map((row) => (
                            <div
                              key={row.id}
                              className="rounded-xl border border-[#2d2416] bg-[#131313] p-4 text-sm text-[#e8dcc0]"
                            >
                              {row.full_name}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-[1.75rem] border border-[#2d2416] bg-[#131313] p-8">
                  <div className="flex items-center gap-3">
                    <Save className="h-5 w-5 text-[#b6924f]" />
                    <h3 className="text-xl text-[#f2e6cf]">
                      {content.account.title}
                    </h3>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#a99c83]">
                    {content.account.subtitle}
                  </p>

                  <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-[1.25rem] border border-[#2d2416] bg-[#0f0f0f] p-5">
                      <label className="mb-2 block text-sm text-[#d9ccb1]">
                        {content.account.fullName}
                      </label>
                      <input
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none"
                      />
                      <button
                        onClick={handleUpdateProfileName}
                        disabled={accountLoading}
                        className="mt-4 rounded-full border border-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {content.account.saveName}
                      </button>
                    </div>

                    <div className="rounded-[1.25rem] border border-[#2d2416] bg-[#0f0f0f] p-5">
                      <label className="mb-2 block text-sm text-[#d9ccb1]">
                        {content.account.email}
                      </label>
                      <input
                        type="email"
                        value={accountEmail}
                        onChange={(e) => setAccountEmail(e.target.value)}
                        className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none"
                      />
                      <button
                        onClick={handleUpdateEmail}
                        disabled={accountLoading}
                        className="mt-4 rounded-full border border-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {content.account.saveEmail}
                      </button>
                    </div>

                    <div className="rounded-[1.25rem] border border-[#2d2416] bg-[#0f0f0f] p-5 lg:col-span-2">
                      <div className="grid gap-4 lg:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm text-[#d9ccb1]">
                            {content.account.newPassword}
                          </label>
                          <input
                            type="password"
                            value={accountPassword}
                            onChange={(e) =>
                              setAccountPassword(e.target.value)
                            }
                            className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm text-[#d9ccb1]">
                            {content.account.confirmPassword}
                          </label>
                          <input
                            type="password"
                            value={accountPasswordConfirm}
                            onChange={(e) =>
                              setAccountPasswordConfirm(e.target.value)
                            }
                            className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleUpdatePassword}
                        disabled={accountLoading}
                        className="mt-4 rounded-full border border-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {content.account.savePassword}
                      </button>
                    </div>
                  </div>
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
                  <p className="text-xs uppercase tracking-[0.35em] text-[#b6924f]">
                    The Heritage Drivers
                  </p>
                  <h3 className="mt-3 text-2xl text-[#f0e3c6]">
                    {content.login.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#ad9f86]">
                    {content.login.subtitle}
                  </p>
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
                    type="email"
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
                  {authMode === "login"
                    ? content.login.submit
                    : content.login.signUp}
                </button>

                <button
                  onClick={() => {
                    resetStatus();
                    setAuthMode(authMode === "login" ? "signup" : "login");
                  }}
                  className="w-full text-sm text-[#cdbd9f] underline underline-offset-4 hover:text-white"
                >
                  {authMode === "login"
                    ? content.login.switchToSignup
                    : content.login.switchToLogin}
                </button>

                <p className="text-center text-xs text-[#7f735c]">
                  {content.login.forgot}
                </p>
                <p className="text-center text-xs uppercase tracking-[0.25em] text-[#7f735c]">
                  {content.login.note}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}