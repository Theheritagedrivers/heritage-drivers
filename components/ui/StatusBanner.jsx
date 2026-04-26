"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";

export default function StatusBanner({ status }) {
  if (!status?.message) return null;

  const isSuccess = status.type === "success";

  return (
    <div
      className={`mb-8 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
        isSuccess
          ? "border-[#3f4d29] bg-[#161d10] text-[#d9e8bb]"
          : "border-[#4b2a23] bg-[#1a1110] text-[#efc5bc]"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4" />
      ) : (
        <AlertCircle className="mt-0.5 h-4 w-4" />
      )}
      <span>{status.message}</span>
    </div>
  );
}