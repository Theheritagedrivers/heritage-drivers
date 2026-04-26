"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useHeritageAuth({ lang, messages, setStatus, resetStatus }) {
  const [initializing, setInitializing] = useState(true);

  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [accountName, setAccountName] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [accountPasswordConfirm, setAccountPasswordConfirm] = useState("");
  const [accountLoading, setAccountLoading] = useState(false);

  const isLoggedIn = !!session;
  const isAdmin = profile?.role === "admin";
  const isApproved = profile?.approved === true;
  const hasMemberAccess = isLoggedIn && (isApproved || isAdmin);

  const memberName = useMemo(() => {
    if (profile?.full_name) return profile.full_name;

    const sessionEmail = session?.user?.email || email;
    if (!sessionEmail) return lang === "en" ? "Member" : "Mitglied";

    return sessionEmail.split("@")[0].replace(/[._-]/g, " ");
  }, [profile, session, email, lang]);

  const syncAccountFields = (nextProfile, nextSession) => {
    setAccountName(nextProfile?.full_name || "");
    setAccountEmail(nextSession?.user?.email || "");
  };

  const clearAuthState = () => {
    setSession(null);
    setProfile(null);
    setProfileLoaded(false);
    setAccountName("");
    setAccountEmail("");
    setAccountPassword("");
    setAccountPasswordConfirm("");
  };

  const loadProfile = async (userId, currentSession) => {
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

  useEffect(() => {
    if (!supabase) {
      setInitializing(false);
      return;
    }

    let mounted = true;

    const init = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (currentSession?.user) {
          setSession(currentSession);
          setProfileLoaded(false);
          await loadProfile(currentSession.user.id, currentSession);
        } else {
          clearAuthState();
          setProfileLoaded(true);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        clearAuthState();
        setProfileLoaded(true);
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
          await loadProfile(currentSession.user.id, currentSession);
        } else {
          clearAuthState();
          setProfileLoaded(true);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        clearAuthState();
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
    setPassword("");
  };

  const handleLogout = async () => {
    resetStatus();

    if (supabase) {
      await supabase.auth.signOut();
    }

    localStorage.removeItem("heritage-drivers-auth");
    sessionStorage.clear();

    clearAuthState();
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

    setStatus({
      type: "success",
      message: messages.profileUpdateSuccess,
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
      message: messages.emailUpdateSuccess,
    });
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

    setStatus({
      type: "success",
      message: messages.passwordUpdateSuccess,
    });
  };

  return {
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
  };
}