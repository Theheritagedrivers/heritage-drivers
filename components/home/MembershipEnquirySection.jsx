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

    setEnquiryForm({
      full_name: "",
      email: "",
      interest_note: "",
    });

    setStatus({
      type: "success",
      message: messages.enquirySuccess,
    });
  };

  return (
    <section className="mt-24">
      <h2 className="text-3xl text-[#f0e3c6]">
        {tc("membershipTitle")}
      </h2>

      <p className="mt-6 max-w-xl text-[#bcb09a]">
        {tc("membershipText")}
      </p>

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