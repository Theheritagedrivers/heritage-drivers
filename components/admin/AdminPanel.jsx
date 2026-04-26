"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPanel({
  tc,
  messages,
  session,
  isAdmin,
  setStatus,
  resetStatus,
}) {
  const [enquiries, setEnquiries] = useState([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);

  const [memberProfilesAdmin, setMemberProfilesAdmin] = useState([]);
  const [memberRoleDrafts, setMemberRoleDrafts] = useState({});
  const [authUsersAdmin, setAuthUsersAdmin] = useState([]);

  const missingProfileUsers = authUsersAdmin.filter(
    (authUser) =>
      !memberProfilesAdmin.some((member) => member.id === authUser.id)
  );

  const loadEnquiries = async () => {
    if (!supabase || !isAdmin) return;

    setEnquiriesLoading(true);

    const { data, error } = await supabase
      .from("membership_enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setEnquiries(data);
    else setEnquiries([]);

    setEnquiriesLoading(false);
  };

  const loadMemberProfilesAdmin = async () => {
    if (!supabase || !isAdmin) return;

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

      setMemberRoleDrafts((prev) => ({
        ...drafts,
        ...prev,
      }));
    }
  };

  const loadAuthUsersAdmin = async () => {
    if (!supabase || !isAdmin) return;

    const { data, error } = await supabase
      .from("auth_users_overview")
      .select("id, email, created_at")
      .order("created_at", { ascending: false });

    if (!error && data) setAuthUsersAdmin(data);
    else setAuthUsersAdmin([]);
  };

  useEffect(() => {
    if (!isAdmin) return;

    loadEnquiries();
    loadMemberProfilesAdmin();
    loadAuthUsersAdmin();
  }, [isAdmin]);

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

    setStatus({
      type: "success",
      message: messages.enquiryReviewedSuccess,
    });

    await loadEnquiries();
  };

  const handleApproveMember = async (memberId) => {
    resetStatus();

    if (!supabase || !session?.user || !isAdmin) return;

    const selectedRole = memberRoleDrafts[memberId] || "member";

    const { error } = await supabase
      .from("member_profiles")
      .update({
        approved: true,
        role: selectedRole,
      })
      .eq("id", memberId);

    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }

    setStatus({
      type: "success",
      message: messages.approvalSuccess,
    });

    await loadMemberProfilesAdmin();
  };

  const handleUpdateMemberRole = async (memberId) => {
    resetStatus();

    if (!supabase || !session?.user || !isAdmin) return;

    const selectedRole = memberRoleDrafts[memberId] || "member";

    const { error } = await supabase
      .from("member_profiles")
      .update({
        role: selectedRole,
      })
      .eq("id", memberId);

    if (error) {
      setStatus({ type: "error", message: error.message });
      return;
    }

    setStatus({
      type: "success",
      message: messages.roleUpdateSuccess,
    });

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

    setStatus({
      type: "success",
      message: messages.createProfileSuccess,
    });

    await loadMemberProfilesAdmin();
    await loadAuthUsersAdmin();
  };

  if (!isAdmin) return null;

  return (
    <div className="mt-10 rounded-[1.75rem] border border-[#2d2416] bg-[#131313] p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl text-[#f2e6cf]">{tc("adminTitle")}</h3>
          <p className="mt-3 text-sm leading-6 text-[#a99c83]">
            {tc("adminSubtitle")}
          </p>
        </div>

        <Link
          href="/admin/pages"
          className="inline-flex items-center gap-2 rounded-full border border-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black"
        >
          <FileText className="h-3.5 w-3.5" />
          {tc("navAdminPages")}
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.25rem] border border-[#2d2416] bg-[#0f0f0f] p-5">
          <h4 className="text-lg text-[#f2e6cf]">{tc("adminEnquiries")}</h4>

          {enquiriesLoading ? (
            <p className="mt-4 text-sm text-[#b8ad96]">Loading...</p>
          ) : enquiries.length === 0 ? (
            <p className="mt-4 text-sm text-[#b8ad96]">
              {tc("adminNoEnquiries")}
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {enquiries.map((enquiry) => (
                <div
                  key={enquiry.id}
                  className="rounded-xl border border-[#2d2416] bg-[#131313] p-4"
                >
                  <p className="text-sm text-[#f2e6cf]">
                    {enquiry.full_name}
                  </p>
                  <p className="mt-1 text-sm text-[#b8ad96]">
                    {enquiry.email}
                  </p>

                  {enquiry.interest_note && (
                    <p className="mt-3 text-sm leading-6 text-[#a99c83]">
                      {enquiry.interest_note}
                    </p>
                  )}

                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[#8f836d]">
                    {enquiry.status === "reviewed"
                      ? tc("adminReviewed")
                      : tc("adminNew")}
                  </p>

                  {enquiry.status !== "reviewed" && (
                    <button
                      onClick={() => handleMarkEnquiryReviewed(enquiry.id)}
                      className="mt-4 rounded-full border border-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black"
                    >
                      {tc("adminMarkReviewed")}
                    </button>
                  )}
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
                <div
                  key={`missing-${authUser.id}`}
                  className="rounded-xl border border-[#5a4120] bg-[#17120d] p-4"
                >
                  <p className="text-sm text-[#f2e6cf]">
                    {authUser.email}
                  </p>

                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#b6924f]">
                    {tc("adminMissingProfile")}
                  </p>

                  <div className="mt-4 space-y-3">
                    <label className="block text-[11px] uppercase tracking-[0.18em] text-[#8f836d]">
                      {tc("adminRole")}
                    </label>

                    <select
                      value={memberRoleDrafts[authUser.id] || "member"}
                      onChange={(e) =>
                        setMemberRoleDrafts((prev) => ({
                          ...prev,
                          [authUser.id]: e.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-3 text-[#efe2c5] outline-none"
                    >
                      <option value="member">member</option>
                      <option value="admin">admin</option>
                    </select>

                    <button
                      onClick={() =>
                        handleCreateProfile(authUser.id, authUser.email)
                      }
                      className="rounded-full bg-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-black transition hover:bg-[#c6a45d]"
                    >
                      {tc("adminCreateProfile")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {memberProfilesAdmin.length === 0 ? (
            <p className="mt-4 text-sm text-[#b8ad96]">
              {tc("adminNoMembers")}
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {memberProfilesAdmin.map((member) => (
                <div
                  key={member.id}
                  className="rounded-xl border border-[#2d2416] bg-[#131313] p-4"
                >
                  <p className="text-sm text-[#f2e6cf]">
                    {member.full_name || member.id}
                  </p>

                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#8f836d]">
                    {member.approved ? tc("adminApproved") : tc("adminPending")}
                  </p>

                  <div className="mt-4 space-y-3">
                    <label className="block text-[11px] uppercase tracking-[0.18em] text-[#8f836d]">
                      {tc("adminRole")}
                    </label>

                    <select
                      value={
                        memberRoleDrafts[member.id] ||
                        member.role ||
                        "member"
                      }
                      onChange={(e) =>
                        setMemberRoleDrafts((prev) => ({
                          ...prev,
                          [member.id]: e.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-[#342a1a] bg-black/60 p-3 text-[#efe2c5] outline-none"
                    >
                      <option value="member">member</option>
                      <option value="admin">admin</option>
                    </select>

                    <button
                      onClick={() => handleUpdateMemberRole(member.id)}
                      className="rounded-full border border-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#f2e6cf] transition hover:bg-[#b6924f] hover:text-black"
                    >
                      {tc("adminSaveRole")}
                    </button>
                  </div>

                  {!member.approved && (
                    <button
                      onClick={() => handleApproveMember(member.id)}
                      className="mt-4 rounded-full bg-[#b6924f] px-4 py-2 text-xs uppercase tracking-[0.18em] text-black transition hover:bg-[#c6a45d]"
                    >
                      {tc("adminApprove")}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}