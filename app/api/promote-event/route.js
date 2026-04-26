import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request) {
  try {
    const body = await request.json();
    const { eventId, memberIds = [], testEmail = "" } = body;

    if (!eventId) {
      return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Server Supabase config missing" },
        { status: 500 }
      );
    }

    const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: event, error: eventError } = await adminSupabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { error: eventError?.message || "Event not found" },
        { status: 404 }
      );
    }

    let recipients = [];

    if (testEmail) {
      recipients = [
        {
          id: null,
          full_name: "Testempfänger",
          email: testEmail,
        },
      ];
    } else {
      let query = adminSupabase
        .from("member_profiles")
        .select("id, full_name, approved")
        .eq("approved", true);

      if (Array.isArray(memberIds) && memberIds.length > 0) {
        query = query.in("id", memberIds);
      }

      const { data: members, error: membersError } = await query;

      if (membersError) {
        return NextResponse.json(
          { error: membersError.message },
          { status: 500 }
        );
      }

      const userIds = (members || []).map((m) => m.id);

      const { data: authUsers, error: authError } =
        await adminSupabase.auth.admin.listUsers();

      if (authError) {
        return NextResponse.json(
          { error: authError.message },
          { status: 500 }
        );
      }

      const emailMap = new Map(
        (authUsers?.users || []).map((user) => [user.id, user.email])
      );

      recipients = (members || [])
        .map((member) => ({
          id: member.id,
          full_name: member.full_name,
          email: emailMap.get(member.id),
        }))
        .filter((member) => userIds.includes(member.id) && member.email);
    }

    const subject = `The Heritage Drivers · ${event.title}`;

    const eventDate = event.event_date || "";
    const eventLocation = event.location || "";
    const shortDescription = event.short_description || "";
    const longDescription = event.long_description || "";

    const textBody = `
The Heritage Drivers

${event.title}

Datum: ${eventDate}
Ort: ${eventLocation}

${shortDescription}

${longDescription}

Diese Nachricht wurde im Zusammenhang mit einer neuen Event-Ausschreibung versendet.
`.trim();

    const htmlBody = `
      <div style="font-family: Georgia, serif; background:#0a0a0a; color:#e8dcc0; padding:32px;">
        <div style="max-width:680px; margin:0 auto; border:1px solid #2d2416; padding:32px; border-radius:24px; background:#111;">
          <p style="letter-spacing:0.28em; text-transform:uppercase; color:#b6924f; font-size:12px;">
            The Heritage Drivers
          </p>
          <h1 style="color:#f2e6cf; font-size:30px; line-height:1.2;">
            ${escapeHtml(event.title)}
          </h1>
          <p style="color:#bcb09a; font-size:15px;">
            ${escapeHtml(eventDate)}${eventLocation ? " · " + escapeHtml(eventLocation) : ""}
          </p>
          ${
            shortDescription
              ? `<p style="color:#d8ccb3; font-size:16px; line-height:1.7;">${escapeHtml(shortDescription)}</p>`
              : ""
          }
          ${
            longDescription
              ? `<p style="color:#a99c83; font-size:15px; line-height:1.7; white-space:pre-line;">${escapeHtml(longDescription)}</p>`
              : ""
          }
          <hr style="border:none; border-top:1px solid #2d2416; margin:28px 0;" />
          <p style="color:#7f735c; font-size:12px;">
            Diese Nachricht wurde im Zusammenhang mit einer neuen Event-Ausschreibung versendet.
          </p>
        </div>
      </div>
    `;

    const resendApiKey = process.env.RESEND_API_KEY;
    const mailFrom =
      process.env.EVENT_MAIL_FROM ||
      "The Heritage Drivers <onboarding@resend.dev>";

    const sent = [];
    const failed = [];

    if (resendApiKey) {
      for (const recipient of recipients) {
        const mailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: mailFrom,
            to: recipient.email,
            subject,
            text: textBody,
            html: htmlBody,
          }),
        });

        if (mailResponse.ok) {
          sent.push(recipient);
        } else {
          const errorText = await mailResponse.text();
          failed.push({
            email: recipient.email,
            error: errorText,
          });
        }
      }
    } else {
      console.log("PROMOTE EVENT DRY RUN:", {
        event: event.title,
        recipients,
      });
      sent.push(...recipients);
    }

    if (!testEmail && sent.length > 0) {
      const promotionRows = sent
        .filter((recipient) => recipient.id)
        .map((recipient) => ({
          event_id: eventId,
          member_id: recipient.id,
          email: recipient.email,
        }));

      if (promotionRows.length > 0) {
        await adminSupabase.from("event_promotions").insert(promotionRows);
      }

      await adminSupabase
        .from("events")
        .update({
          promoted_at: new Date().toISOString(),
        })
        .eq("id", eventId);
    }

   return NextResponse.json({
  success: failed.length === 0,
  sent: sent.length,
  failed: failed.length,
  failedRecipients: failed,
  dryRun: !resendApiKey,
  hasResendKey: !!resendApiKey,
  from: mailFrom,
  recipients: recipients.map((r) => r.email),
});
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}