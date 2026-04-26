"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useWebsiteContent({
  lang,
  session,
  isAdmin,
  messages,
  setStatus,
}) {
  const [websiteContent, setWebsiteContent] = useState({});

  // 🔹 Content laden
  const loadWebsiteContent = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("website_content")
      .select("content_key, lang, content_value");

    if (error) {
      console.error("Content load error:", error);
      return;
    }

    const mapped = {};

    (data || []).forEach((row) => {
      if (!mapped[row.lang]) mapped[row.lang] = {};
      mapped[row.lang][row.content_key] = row.content_value;
    });

    setWebsiteContent(mapped);
  };

  // 🔹 Content speichern (Admin only)
  const saveContentField = async (key, value) => {
    if (!supabase || !session?.user || !isAdmin) return;

    const { error } = await supabase.from("website_content").upsert(
      {
        content_key: key,
        lang,
        content_value: value,
        updated_by: session.user.id,
      },
      {
        onConflict: "content_key,lang",
      }
    );

    if (error) {
      setStatus({
        type: "error",
        message: error.message,
      });
      return;
    }

    // lokal updaten → kein reload nötig
    setWebsiteContent((prev) => ({
      ...prev,
      [lang]: {
        ...(prev[lang] || {}),
        [key]: value,
      },
    }));

    setStatus({
      type: "success",
      message: messages.contentUpdateSuccess,
    });
  };

  // 🔹 initial laden
  useEffect(() => {
    loadWebsiteContent();
  }, []);

  return {
    websiteContent,
    saveContentField,
    reloadContent: loadWebsiteContent,
  };
}