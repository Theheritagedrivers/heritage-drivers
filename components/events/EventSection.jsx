"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Image as ImageIcon,
  Paperclip,
  Trash2,
  Archive,
  Check,
  Megaphone,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const emptyEventForm = {
  title: "",
  short_description: "",
  long_description: "",
  event_date: "",
  location: "",
  max_participants: "",
  image_url: "",
};

function formatDateSafe(dateValue, lang = "de") {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;

  return new Intl.DateTimeFormat(lang === "de" ? "de-CH" : "en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export default function EventSection({
  lang,
  tc,
  messages,
  session,
  profile,
  isAdmin,
  hasMemberAccess,
  setStatus,
  resetStatus,
}) {
  const [events, setEvents] = useState([]);
  const [archivedEvents, setArchivedEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  const [participants, setParticipants] = useState([]);
  const [participantsView, setParticipantsView] = useState(null);

  const [promotionEvent, setPromotionEvent] = useState(null);
  const [promotionMembers, setPromotionMembers] = useState([]);
  const [selectedPromotionMembers, setSelectedPromotionMembers] = useState([]);
  const [promotionLoading, setPromotionLoading] = useState(false);
  const [testEmail, setTestEmail] = useState("");

  const [eventForm, setEventForm] = useState(emptyEventForm);
  const [eventImageFile, setEventImageFile] = useState(null);
  const [eventFiles, setEventFiles] = useState([]);

  const [editingEventId, setEditingEventId] = useState(null);
  const [eventSaving, setEventSaving] = useState(false);

  const loadEvents = async () => {
    if (!supabase) return;

    setEventsLoading(true);

    try {
      let activeQuery = supabase
        .from("events")
        .select("*, event_files(*)")
        .eq("archived", false)
        .order("event_date", { ascending: true });

      if (!isAdmin) {
        activeQuery = activeQuery
          .eq("is_active", true)
          .eq("approval_status", "approved");
      }

      const { data: activeData, error: activeError } = await activeQuery;

      setEvents(activeError ? [] : activeData || []);

      if (isAdmin) {
        const { data: archivedData, error: archivedError } = await supabase
          .from("events")
          .select("*, event_files(*)")
          .eq("archived", true)
          .order("event_date", { ascending: false });

        setArchivedEvents(archivedError ? [] : archivedData || []);
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

    setParticipants(
      data.map((row) => ({
        ...row,
        full_name: nameMap.get(row.user_id) || row.user_id,
      }))
    );
  };

  useEffect(() => {
    if (!session?.user || !profile) return;

    loadEvents();
    loadParticipants();
  }, [session?.user?.id, profile?.role]);

  const uploadFileToBucket = async ({ bucket, folder, file }) => {
    if (!supabase || !file || !session?.user) return { url: "", name: "" };

    const fileExt = file.name.split(".").pop();
    const safeExt = fileExt ? `.${fileExt}` : "";
    const fileName = `${session.user.id}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}${safeExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: false });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return {
      url: data?.publicUrl || "",
      name: file.name,
      type: file.type || null,
    };
  };

  const handleUploadEventImage = async () =>
    uploadFileToBucket({
      bucket: "event-images",
      folder: "events",
      file: eventImageFile,
    });

  const handleUploadEventFiles = async (eventId) => {
    if (!eventFiles.length || !eventId || !session?.user) return;

    for (const file of eventFiles) {
      const uploaded = await uploadFileToBucket({
        bucket: "event-files",
        folder: `events/${eventId}`,
        file,
      });

      await supabase.from("event_files").insert({
        event_id: eventId,
        file_name: uploaded.name,
        file_url: uploaded.url,
        file_type: uploaded.type,
        uploaded_by: session.user.id,
      });
    }
  };

  const resetEventEditor = () => {
    setEditingEventId(null);
    setEventForm(emptyEventForm);
    setEventImageFile(null);
    setEventFiles([]);
  };

  const handleCreateEvent = async () => {
    resetStatus();

    if (!supabase || !session?.user || !hasMemberAccess) {
      setStatus({ type: "error", message: messages.notAuthorized });
      return;
    }

    if (editingEventId && !isAdmin) {
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

      if (eventImageFile) {
        const imageUpload = await handleUploadEventImage();
        uploadedImageUrl = imageUpload.url || null;
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
        is_active: isAdmin,
        archived: false,
        approval_status: isAdmin ? "approved" : "pending",
        submitted_by: session.user.id,
        approved_by: isAdmin ? session.user.id : null,
        approved_at: isAdmin ? new Date().toISOString() : null,
      };

      let savedEventId = editingEventId;

      if (editingEventId) {
        const { error } = await supabase
          .from("events")
          .update(payload)
          .eq("id", editingEventId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("events")
          .insert({
            ...payload,
            created_by: session.user.id,
          })
          .select("id")
          .single();

        if (error) throw error;
        savedEventId = data?.id;
      }

      if (savedEventId && eventFiles.length > 0) {
        await handleUploadEventFiles(savedEventId);
      }

      setStatus({
        type: "success",
        message: editingEventId
          ? messages.eventUpdateSuccess
          : isAdmin
          ? messages.eventCreateSuccess
          : messages.eventProposalSuccess,
      });

      resetEventEditor();
      await loadEvents();
    } catch (err) {
      setStatus({
        type: "error",
        message: err?.message || messages.uploadError,
      });
    }

    setEventSaving(false);
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
    });
    setEventImageFile(null);
    setEventFiles([]);
  };

  const handleDeleteEvent = async (eventId) => {
    resetStatus();

    if (!supabase || !session?.user || !isAdmin) {
      setStatus({ type: "error", message: messages.notAuthorized });
      return;
    }

    if (!window.confirm(messages.eventDeleteConfirm)) return;

    const { error } = await supabase.from("events").delete().eq("id", eventId);

    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }

    if (editingEventId === eventId) resetEventEditor();

    setParticipantsView(null);
    setStatus({ type: "success", message: messages.eventDeleteSuccess });
    await loadEvents();
  };

  const handleArchiveEvent = async (eventId) => {
    resetStatus();

    if (!supabase || !session?.user || !isAdmin) {
      setStatus({ type: "error", message: messages.notAuthorized });
      return;
    }

    if (!window.confirm(messages.eventArchiveConfirm)) return;

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

    if (editingEventId === eventId) resetEventEditor();

    setParticipantsView(null);
    setStatus({ type: "success", message: messages.eventArchiveSuccess });
    await loadEvents();
  };

  const handleApproveEvent = async (eventId) => {
    resetStatus();

    if (!supabase || !session?.user || !isAdmin) {
      setStatus({ type: "error", message: messages.notAuthorized });
      return;
    }

    const { error } = await supabase
      .from("events")
      .update({
        approval_status: "approved",
        is_active: true,
        approved_by: session.user.id,
        approved_at: new Date().toISOString(),
      })
      .eq("id", eventId);

    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }

    setStatus({ type: "success", message: messages.eventApproveSuccess });
    await loadEvents();
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
    setStatus({
      type: "success",
      message: messages.participantUpdateSuccess,
    });
  };

  const handleViewParticipants = async (eventId) => {
    const rows = getParticipantsForEvent(eventId);
    setParticipantsView({ eventId, rows });
  };

  const loadPromotionMembers = async (event) => {
    resetStatus();

    if (!supabase || !isAdmin) {
      setStatus({ type: "error", message: messages.notAuthorized });
      return;
    }

    setPromotionLoading(true);
    setPromotionEvent(event);

    const { data, error } = await supabase
      .from("member_profiles")
      .select("id, full_name, approved")
      .eq("approved", true)
      .order("full_name", { ascending: true });

    setPromotionLoading(false);

    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }

    setPromotionMembers(data || []);
    setSelectedPromotionMembers((data || []).map((member) => member.id));
  };

  const togglePromotionMember = (memberId) => {
    setSelectedPromotionMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const sendPromotion = async ({ test = false } = {}) => {
    resetStatus();

    if (!promotionEvent?.id || !isAdmin) {
      setStatus({ type: "error", message: messages.notAuthorized });
      return;
    }

    if (test && !testEmail.trim()) {
      setStatus({
        type: "error",
        message:
          lang === "de"
            ? "Bitte Test-E-Mail-Adresse eingeben."
            : "Please enter a test email address.",
      });
      return;
    }

    setPromotionLoading(true);

    const response = await fetch("/api/promote-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: promotionEvent.id,
        memberIds: test ? [] : selectedPromotionMembers,
        testEmail: test ? testEmail.trim() : "",
      }),
    });

    const result = await response.json().catch(() => ({}));

    setPromotionLoading(false);

    if (!response.ok) {
      setStatus({
        type: "error",
        message: result?.error || messages.eventPromoteError,
      });
      return;
    }

    setStatus({
      type: "success",
      message: test
        ? lang === "de"
          ? "Testmail wurde ausgelöst."
          : "Test email sent."
        : messages.eventPromoteSuccess,
    });

    if (!test) {
      setPromotionEvent(null);
      setPromotionMembers([]);
      setSelectedPromotionMembers([]);
      await loadEvents();
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#b6924f]">
            Club Events
          </p>
          <h2 className="mt-4 text-3xl text-[#f2e6cf]">
            {tc("eventsSectionTitle")}
          </h2>
          <p className="mt-4 max-w-2xl text-[#b8ad96]">
            {tc("eventsSectionText")}
          </p>
        </div>

        <button
          onClick={resetEventEditor}
          className="rounded-full bg-[#b6924f] px-5 py-3 text-sm uppercase tracking-[0.22em] text-black transition hover:bg-[#c6a45d]"
        >
          {isAdmin ? tc("eventCreate") : tc("eventPropose")}
        </button>
      </div>

      <div className="mt-8 rounded-[1.75rem] border border-[#2d2416] bg-[#131313] p-8">
        {eventsLoading ? (
          <p className="text-sm text-[#b8ad96]">{tc("eventLoading")}</p>
        ) : events.length === 0 ? (
          <p className="text-sm text-[#b8ad96]">{tc("eventEmpty")}</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {events.map((event) => {
              const participantsForEvent = getParticipantsForEvent(event.id);

              return (
                <div
                  key={event.id}
                  className="rounded-[1.5rem] border border-[#2d2416] bg-[#0f0f0f] p-6"
                >
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.title || "Event image"}
                      className="mb-4 h-48 w-full rounded-2xl object-cover"
                    />
                  ) : null}

                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#b6924f]">
                      {tc("eventUpcoming")}
                    </p>

                    {event.approval_status === "pending" && (
                      <span className="rounded-full border border-[#6e5a2c] px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-[#d7bf8a]">
                        {tc("eventPending")}
                      </span>
                    )}
                  </div>

                  <h4 className="mt-3 text-xl text-[#f2e6cf]">
                    {event.title}
                  </h4>

                  <p className="mt-2 text-sm text-[#a99c83]">
                    {formatDateSafe(event.event_date, lang)}
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
                      {tc("eventMaxParticipantsLabel")}:{" "}
                      {participantsForEvent.length} / {event.max_participants}
                    </p>
                  )}

                  {event.event_files?.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-[#d9ccb1]">
                        {tc("eventFiles")}:
                      </p>

                      {event.event_files.map((file) => (
                        <a
                          key={file.id}
                          href={file.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 text-sm text-[#d7bf8a] underline underline-offset-4 hover:text-white"
                        >
                          <Paperclip className="h-4 w-4" />
                          {file.file_name}
                        </a>
                      ))}
                    </div>
                  )}

                  {participantsForEvent.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-[#d9ccb1]">
                        {tc("eventParticipants")}:
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {participantsForEvent.map((participant) => (
                          <span
                            key={participant.id}
                            className="rounded-full border border-[#3b311d] px-3 py-1 text-xs text-[#cdbd9f]"
                          >
                            {participant.full_name || participant.user_id}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {event.approval_status === "approved" && (
                    <div className="mt-6 flex items-center gap-3">
                      <input
                        id={`join-${event.id}`}
                        type="checkbox"
                        checked={isRegisteredForEvent(event.id)}
                        onChange={(e) =>
                          handleToggleParticipation(event.id, e.target.checked)
                        }
                        className="h-4 w-4 accent-[#b6924f]"
                      />
                      <label
                        htmlFor={`join-${event.id}`}
                        className="text-sm text-[#e8dcc0]"
                      >
                        {tc("eventAttend")}
                      </label>
                    </div>
                  )}

                  {isAdmin && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      {event.approval_status === "pending" && (
                        <button
                          onClick={() => handleApproveEvent(event.id)}
                          className="inline-flex items-center gap-2 rounded-full bg-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-black transition hover:bg-[#c6a45d]"
                        >
                          <Check className="h-3.5 w-3.5" />
                          {tc("eventApprove")}
                        </button>
                      )}

                      {event.approval_status === "approved" && (
                        <button
                          onClick={() => loadPromotionMembers(event)}
                          className="inline-flex items-center gap-2 rounded-full border border-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black"
                        >
                          <Megaphone className="h-3.5 w-3.5" />
                          {tc("eventPromote")}
                        </button>
                      )}

                      <button
                        onClick={() => handleEditEvent(event)}
                        className="rounded-full border border-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black"
                      >
                        {tc("eventModify")}
                      </button>

                      <button
                        onClick={() => handleViewParticipants(event.id)}
                        className="rounded-full border border-[#3b311d] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:border-[#b6924f]"
                      >
                        {tc("eventParticipants")}
                      </button>

                      <button
                        onClick={() => handleArchiveEvent(event.id)}
                        className="inline-flex items-center gap-2 rounded-full border border-[#6e5a2c] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:border-[#b6924f] hover:text-white"
                      >
                        <Archive className="h-3.5 w-3.5" />
                        {tc("eventArchive")}
                      </button>

                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="inline-flex items-center gap-2 rounded-full border border-[#6a2f24] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:border-[#b74b39] hover:text-white"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {tc("eventDelete")}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {promotionEvent && (
          <div className="mt-8 rounded-[1.5rem] border border-[#5a4120] bg-[#17120d] p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#b6924f]">
                  {tc("eventPromote")}
                </p>
                <h3 className="mt-3 text-xl text-[#f2e6cf]">
                  {promotionEvent.title}
                </h3>
                <p className="mt-2 text-sm text-[#a99c83]">
                  {lang === "de"
                    ? "Alle freigegebenen Mitglieder sind standardmässig angewählt."
                    : "All approved members are selected by default."}
                </p>
              </div>

              <button
                onClick={() => {
                  setPromotionEvent(null);
                  setPromotionMembers([]);
                  setSelectedPromotionMembers([]);
                  setTestEmail("");
                }}
                className="rounded-full border border-[#3b311d] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:border-[#b6924f]"
              >
                {tc("cancel")}
              </button>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#342a1a] bg-black/40 p-4">
                <p className="text-sm text-[#d9ccb1]">
                  {lang === "de" ? "Testversand" : "Test send"}
                </p>

                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="mt-3 w-full rounded-xl border border-[#342a1a] bg-black/60 p-3 text-[#efe2c5] outline-none"
                />

                <button
                  onClick={() => sendPromotion({ test: true })}
                  disabled={promotionLoading}
                  className="mt-4 rounded-full border border-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black disabled:opacity-60"
                >
                  {promotionLoading
                    ? "..."
                    : lang === "de"
                    ? "Testmail senden"
                    : "Send test email"}
                </button>
              </div>

              <div className="rounded-2xl border border-[#342a1a] bg-black/40 p-4">
                <p className="text-sm text-[#d9ccb1]">
                  {lang === "de" ? "Empfänger" : "Recipients"}:{" "}
                  {selectedPromotionMembers.length} / {promotionMembers.length}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      setSelectedPromotionMembers(
                        promotionMembers.map((member) => member.id)
                      )
                    }
                    className="rounded-full border border-[#3b311d] px-3 py-1 text-xs text-[#f2e6cf]"
                  >
                    {lang === "de" ? "Alle wählen" : "Select all"}
                  </button>

                  <button
                    onClick={() => setSelectedPromotionMembers([])}
                    className="rounded-full border border-[#3b311d] px-3 py-1 text-xs text-[#f2e6cf]"
                  >
                    {lang === "de" ? "Alle abwählen" : "Clear all"}
                  </button>
                </div>

                <button
                  onClick={() => sendPromotion({ test: false })}
                  disabled={
                    promotionLoading || selectedPromotionMembers.length === 0
                  }
                  className="mt-4 rounded-full bg-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-black transition hover:bg-[#c6a45d] disabled:opacity-60"
                >
                  {promotionLoading
                    ? "..."
                    : lang === "de"
                    ? "Ausgewählte anschreiben"
                    : "Send to selected"}
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {promotionMembers.map((member) => (
                <label
                  key={member.id}
                  className="flex items-center gap-3 rounded-xl border border-[#2d2416] bg-[#131313] p-3 text-sm text-[#e8dcc0]"
                >
                  <input
                    type="checkbox"
                    checked={selectedPromotionMembers.includes(member.id)}
                    onChange={() => togglePromotionMember(member.id)}
                    className="h-4 w-4 accent-[#b6924f]"
                  />
                  <span>{member.full_name || member.id}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 rounded-[1.5rem] border border-[#2d2416] bg-[#0f0f0f] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#b6924f]">
            {editingEventId
              ? tc("eventModify")
              : isAdmin
              ? tc("eventCreate")
              : tc("eventPropose")}
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <input
              value={eventForm.title}
              onChange={(e) =>
                setEventForm({ ...eventForm, title: e.target.value })
              }
              placeholder={tc("eventTitleLabel")}
              className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none placeholder:text-[#796c56]"
            />

            <input
              value={eventForm.event_date}
              onChange={(e) =>
                setEventForm({ ...eventForm, event_date: e.target.value })
              }
              type="date"
              className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none"
            />

            <input
              value={eventForm.location}
              onChange={(e) =>
                setEventForm({ ...eventForm, location: e.target.value })
              }
              placeholder={tc("eventLocationLabel")}
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
              placeholder={tc("eventMaxParticipantsLabel")}
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
              placeholder={tc("eventShortDescriptionLabel")}
              className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none placeholder:text-[#796c56] lg:col-span-2"
            />

            <textarea
              value={eventForm.long_description}
              onChange={(e) =>
                setEventForm({
                  ...eventForm,
                  long_description: e.target.value,
                })
              }
              placeholder={tc("eventLongDescriptionLabel")}
              className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-4 text-[#efe2c5] outline-none placeholder:text-[#796c56] lg:col-span-2"
            />

            <div className="rounded-2xl border border-[#342a1a] bg-black/60 p-4 lg:col-span-2">
              <label className="mb-3 flex items-center gap-2 text-sm text-[#efe2c5]">
                <ImageIcon className="h-4 w-4 text-[#b6924f]" />
                {tc("eventImageLabel")}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEventImageFile(e.target.files?.[0] || null)
                }
                className="w-full text-[#efe2c5] outline-none"
              />
            </div>

            <div className="rounded-2xl border border-[#342a1a] bg-black/60 p-4 lg:col-span-2">
              <label className="mb-3 flex items-center gap-2 text-sm text-[#efe2c5]">
                <Paperclip className="h-4 w-4 text-[#b6924f]" />
                {tc("eventAttachmentLabel")}
              </label>
              <input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) =>
                  setEventFiles(Array.from(e.target.files || []))
                }
                className="w-full text-[#efe2c5] outline-none"
              />

              {eventFiles.length > 0 && (
                <div className="mt-3 space-y-1 text-xs text-[#a99c83]">
                  {eventFiles.map((file) => (
                    <p key={file.name}>{file.name}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={handleCreateEvent}
              disabled={eventSaving}
              className="inline-flex items-center gap-2 rounded-full bg-[#b6924f] px-5 py-3 text-sm uppercase tracking-[0.22em] text-black transition hover:bg-[#c6a45d] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {eventSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingEventId
                ? tc("eventSaveChanges")
                : isAdmin
                ? tc("eventCreate")
                : tc("eventPropose")}
            </button>

            {editingEventId && (
              <button
                onClick={resetEventEditor}
                className="rounded-full border border-[#b6924f] px-5 py-3 text-sm uppercase tracking-[0.22em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black"
              >
                {tc("eventCancelEdit")}
              </button>
            )}
          </div>
        </div>

        {participantsView && (
          <div className="mt-8 rounded-[1.5rem] border border-[#2d2416] bg-[#0f0f0f] p-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#b6924f]">
                {tc("eventParticipants")}
              </p>

              <button
                onClick={() => setParticipantsView(null)}
                className="rounded-full border border-[#3b311d] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:border-[#b6924f]"
              >
                {tc("eventClose")}
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {participantsView.rows.length === 0 ? (
                <p className="text-sm text-[#b8ad96]">
                  {tc("eventNoParticipants")}
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

        {isAdmin && (
          <div className="mt-10 rounded-[1.5rem] border border-[#2d2416] bg-[#0f0f0f] p-6">
            <div className="flex items-center gap-3">
              <Archive className="h-5 w-5 text-[#b6924f]" />
              <h3 className="text-xl text-[#f2e6cf]">
                {tc("archivedEventsTitle")}
              </h3>
            </div>

            {archivedEvents.length === 0 ? (
              <p className="mt-4 text-sm text-[#b8ad96]">
                {tc("archivedEventsEmpty")}
              </p>
            ) : (
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {archivedEvents.map((event) => (
                  <div
                    key={`archived-${event.id}`}
                    className="rounded-xl border border-[#2d2416] bg-[#131313] p-4"
                  >
                    <p className="text-lg text-[#f2e6cf]">{event.title}</p>
                    <p className="mt-2 text-sm text-[#a99c83]">
                      {formatDateSafe(event.event_date, lang)}
                      {event.location ? ` · ${event.location}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}