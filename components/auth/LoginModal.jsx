"use client";

import { Lock, Mail, User, Loader2 } from "lucide-react";

export default function LoginModal({
  tc,
  authMode,
  setAuthMode,
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onClose,
  onSubmit,
  resetStatus,
}) {
  return (
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
            onClick={onClose}
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
            onClick={onSubmit}
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
  );
}