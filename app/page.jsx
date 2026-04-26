"use client";

import { useState } from "react";
import { supabaseConfigured } from "@/lib/supabaseClient";

import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import StatusBanner from "@/components/ui/StatusBanner";

import PublicHomeSection from "@/components/home/PublicHomeSection";
import MembersHomeSection from "@/components/home/MembersHomeSection";
import MembershipEnquirySection from "@/components/home/MembershipEnquirySection";

import EventSection from "@/components/events/EventSection";
import AccountSection from "@/components/account/AccountSection";
import AdminPanel from "@/components/admin/AdminPanel";
import LoginModal from "@/components/auth/LoginModal";

import { useHeritageAuth } from "@/hooks/useHeritageAuth";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { fallbackContent, uiMessages } from "@/lib/siteContent";

export default function TheHeritageDriversLandingPage() {
  const [lang, setLang] = useState("de");
  const [showLogin, setShowLogin] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [status, setStatus] = useState({ type: "", message: "" });

  const messages = uiMessages[lang];

  const resetStatus = () => setStatus({ type: "", message: "" });

  const {
    initializing,
    session,
    profile,
    profileLoaded,
    isLoggedIn,
    isAdmin,
    isApproved,
    hasMemberAccess,
    memberName,
    accountName,
    setAccountName,
    accountEmail,
    setAccountEmail,
    accountPassword,
    setAccountPassword,
    accountPasswordConfirm,
    setAccountPasswordConfirm,
    accountLoading,
    handleLogin,
    handleSignup,
    handleLogout,
    handleUpdateProfileName,
    handleUpdateEmail,
    handleUpdatePassword,
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
  } = useHeritageAuth({
    lang,
    messages,
    setStatus,
    resetStatus,
  });

  const { websiteContent, saveContentField } = useWebsiteContent({
    lang,
    session,
    isAdmin,
    messages,
    setStatus,
  });

  const tc = (key) => {
    const saved = websiteContent?.[lang]?.[key];
    const fallback = fallbackContent?.[lang]?.[key];
    return saved || fallback || "";
  };

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-[#e8dcc0]">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#b6924f] border-t-transparent" />
          <span>{lang === "de" ? "Initialisierung..." : "Initializing..."}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8dcc0]">
      <SiteHeader
  lang={lang}
  setLang={setLang}
  tc={tc}
  isLoggedIn={isLoggedIn}
  isAdmin={isAdmin}
  onLoginClick={() => {
    resetStatus();
    setAuthMode("login");
    setShowLogin(true);
  }}
  onLogout={handleLogout}
/>

{/* NEUER HERO HIER */}


      <section className="relative h-[62vh] min-h-[420px] w-full overflow-hidden border-b border-[#2a2213]">
        <img
          src="/hero.jpg"
          alt="The Heritage Drivers"
          className="absolute inset-0 h-full w-full object-cover"
        />

       <div className="absolute inset-0 bg-black/35" />
<div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#0a0a0a]" />

      
      </section>

{/* Ende HERO HIER */}

      <main className="mx-auto max-w-7xl px-6 py-20">
        <StatusBanner status={status} />

        {!supabaseConfigured && (
          <div className="mb-10 rounded-[1.75rem] border border-[#4b2f20] bg-[#16100d] p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[#b6924f]">
              {messages.setupTitle}
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#cfbea3]">
              {messages.setupText}
            </p>
          </div>
        )}

        {!isLoggedIn ? (
          <>
            <PublicHomeSection
              tc={tc}
              isAdmin={isAdmin}
              saveContentField={saveContentField}
              onLoginClick={() => {
                resetStatus();
                setAuthMode("login");
                setShowLogin(true);
              }}
            />

            <MembershipEnquirySection
              lang={lang}
              tc={tc}
              messages={messages}
              setStatus={setStatus}
              resetStatus={resetStatus}
            />
          </>
        ) : (
          <>
            <MembersHomeSection
              tc={tc}
              isAdmin={isAdmin}
              memberName={memberName}
              saveContentField={saveContentField}
            />

            {profileLoaded && profile && !hasMemberAccess && (
              <section className="mt-24">
                <div className="rounded-[2rem] border border-[#4b2f20] bg-[#16100d] p-8">
                  <h2 className="text-2xl text-[#f2e6cf]">
                    {tc("approvalPendingTitle")}
                  </h2>
                  <p className="mt-4 max-w-2xl text-[#cfbea3]">
                    {tc("approvalPendingText")}
                  </p>
                </div>
              </section>
            )}

            {hasMemberAccess && (
              <section className="mt-24" id="members">
                <div className="rounded-[2rem] border border-[#2c2415] bg-[#0f0f0f] p-8 shadow-2xl shadow-black/30">
                  <EventSection
                    lang={lang}
                    tc={tc}
                    messages={messages}
                    session={session}
                    profile={profile}
                    isAdmin={isAdmin}
                    hasMemberAccess={hasMemberAccess}
                    setStatus={setStatus}
                    resetStatus={resetStatus}
                  />

                  <AccountSection
                    tc={tc}
                    accountName={accountName}
                    setAccountName={setAccountName}
                    accountEmail={accountEmail}
                    setAccountEmail={setAccountEmail}
                    accountPassword={accountPassword}
                    setAccountPassword={setAccountPassword}
                    accountPasswordConfirm={accountPasswordConfirm}
                    setAccountPasswordConfirm={setAccountPasswordConfirm}
                    accountLoading={accountLoading}
                    handleUpdateProfileName={handleUpdateProfileName}
                    handleUpdateEmail={handleUpdateEmail}
                    handleUpdatePassword={handleUpdatePassword}
                  />

             
                </div>
              </section>
            )}
          </>
        )}

        {showLogin && (
          <LoginModal
            tc={tc}
            authMode={authMode}
            setAuthMode={setAuthMode}
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            onClose={() => setShowLogin(false)}
            onSubmit={authMode === "login" ? handleLogin : handleSignup}
            resetStatus={resetStatus}
          />
        )}
      </main>

      <SiteFooter tc={tc} isAdmin={isAdmin} saveContentField={saveContentField} />
    </div>
  );
}