"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function MembershipEnquirySection({
  lang,
  tc,
  messages,
  setStatus,
  resetStatus,
}) {
  const [enquiryForm, setEnquiryForm] = useState({
    full_name: "",
    email: "",
    interest_note: "",
  });

  const [enquiryLoading, setEnquiryLoading] = useState(false);

  const sendMail = async ({ to, subject, html }) => {
    const response = await fetch("/api/send-mail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, subject, html }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Mail could not be sent.");
    }

    return result;
  };

  const handleSubmitEnquiry = async () => {
    resetStatus();

    if (!supabase) {
      setStatus({ type: "error", message: messages.setupText });
      return;
    }

    const fullName = enquiryForm.full_name.trim();
    const email = enquiryForm.email.trim();
    const note = enquiryForm.interest_note.trim();

    if (!fullName || !email) {
      setStatus({ type: "error", message: messages.enquiryMissingFields });
      return;
    }

    setEnquiryLoading(true);

    const { error } = await supabase.from("membership_enquiries").insert({
      full_name: fullName,
      email,
      interest_note: note || null,
      language: lang,
      status: "new",
    });

    if (error) {
      setEnquiryLoading(false);
      setStatus({
        type: "error",
        message: error.message || messages.enquiryError,
      });
      return;
    }

    try {
      await sendMail({
        to: "info@heritagedrivers.ch",
        subject: "Neue Membership Anfrage",
        html: `
          <h2>Neue Membership Anfrage</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>E-Mail:</strong> ${email}</p>
          <p><strong>Sprache:</strong> ${lang}</p>
          <p><strong>Nachricht:</strong></p>
          <p>${note || "Keine Nachricht"}</p>
        `,
      });

      await sendMail({
        to: email,
        subject: "The Heritage Drivers – Membership Enquiry",
        html: `
          <p>Dear ${fullName},</p>
          <p>Thank you for your enquiry.</p>
          <p>Your interest in The Heritage Drivers has been received. We will review your request personally and respond in due course.</p>
          <p>With kind regards,<br/>The Heritage Drivers</p>
        `,
      });
    } catch (mailError) {
      console.error("Membership enquiry mail error:", mailError);
      setStatus({
        type: "success",
        message:
          messages.enquirySuccess +
          " Die Anfrage wurde gespeichert, aber die E-Mail-Benachrichtigung konnte nicht gesendet werden.",
      });

      setEnquiryForm({
        full_name: "",
        email: "",
        interest_note: "",
      });

      setEnquiryLoading(false);
      return;
    }

    setEnquiryForm({
      full_name: "",
      email: "",
      interest_note: "",
    });

    setStatus({
      type: "success",
      message: messages.enquirySuccess,
    });

    setEnquiryLoading(false);
  };

  return (
    <section className="mt-24">
      <h2 className="text-3xl text-[#f0e3c6]">{tc("membershipTitle")}</h2>

      <p className="mt-6 max-w-xl text-[#bcb09a]">{tc("membershipText")}</p>

      <div className="mt-10 max-w-md space-y-4">
        <input
          value={enquiryForm.full_name}
          onChange={(e) =>
            setEnquiryForm({
              ...enquiryForm,
              full_name: e.target.value,
            })
          }
          placeholder={tc("enquiryName")}
          className="w-full border border-[#342a1a] bg-black p-3 text-[#efe2c5]"
        />

        <input
          type="email"
          value={enquiryForm.email}
          onChange={(e) =>
            setEnquiryForm({
              ...enquiryForm,
              email: e.target.value,
            })
          }
          placeholder={tc("enquiryEmail")}
          className="w-full border border-[#342a1a] bg-black p-3 text-[#efe2c5]"
        />

        <textarea
          value={enquiryForm.interest_note}
          onChange={(e) =>
            setEnquiryForm({
              ...enquiryForm,
              interest_note: e.target.value,
            })
          }
          placeholder={tc("enquiryMessage")}
          className="w-full border border-[#342a1a] bg-black p-3 text-[#efe2c5]"
        />

        <button
          onClick={handleSubmitEnquiry}
          disabled={enquiryLoading}
          className="flex w-full items-center justify-center gap-2 bg-[#b6924f] px-6 py-3 text-black disabled:cursor-not-allowed disabled:opacity-70"
        >
          {enquiryLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {tc("enquirySubmit")}
        </button>
      </div>
    </section>
  );
}