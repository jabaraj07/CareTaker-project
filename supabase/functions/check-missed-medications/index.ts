// supabase/functions/check-missed-medications/index.ts
// Deploy with: supabase functions deploy check-missed-medications

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// import { createClient } from "@supabase/supabase-js"

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Profile {
  id: string;
  full_name: string | null;
  caretaker_email: string | null;
  notification_time: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  user_id: string;
}

interface MedicationLog {
  medication_id: string;
  status: string;
}

// ─── Email HTML Builder ────────────────────────────────────────────────────────

function buildEmailHtml(
  patientName: string | null,
  missedMeds: Pick<Medication, "name" | "dosage">[],
): string {
  const medRows = missedMeds
    .map(
      (m) => `
      <tr>
        <td style="padding: 10px 16px; border-bottom: 1px solid #f1f5f9;">
          <strong style="color: #1e293b;">${m.name}</strong>
        </td>
        <td style="padding: 10px 16px; border-bottom: 1px solid #f1f5f9; color: #64748b;">
          ${m.dosage}
        </td>
      </tr>`,
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin:0; padding:0; background:#f8fafc; font-family:-apple-system, BlinkMacSystemFont, sans-serif;">
      <div style="max-width:480px; margin:40px auto; background:white; border-radius:16px; overflow:hidden; border:1px solid #e2e8f0;">

        <!-- Header -->
        <div style="background:linear-gradient(135deg, #1e293b, #334155); padding:24px 32px;">
          <div style="font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:#94a3b8; margin-bottom:8px;">
            Medication Alert
          </div>
          <h1 style="margin:0; color:white; font-size:22px; font-weight:700;">
            ⚠️ Missed Medications
          </h1>
        </div>

        <!-- Body -->
        <div style="padding:28px 32px;">
          <p style="margin:0 0 16px; color:#475569; font-size:15px; line-height:1.6;">
            ${
              patientName
                ? `<strong>${patientName}</strong> has`
                : "Your patient has"
            } not marked the following medications as taken today:
          </p>

          <!-- Medications Table -->
          <table style="width:100%; border-collapse:collapse; background:#f8fafc; border-radius:12px; overflow:hidden; border:1px solid #e2e8f0; margin-bottom:20px;">
            <thead>
              <tr style="background:#f1f5f9;">
                <th style="padding:10px 16px; text-align:left; font-size:11px; letter-spacing:0.5px; text-transform:uppercase; color:#64748b; font-weight:600;">
                  Medication
                </th>
                <th style="padding:10px 16px; text-align:left; font-size:11px; letter-spacing:0.5px; text-transform:uppercase; color:#64748b; font-weight:600;">
                  Dosage
                </th>
              </tr>
            </thead>
            <tbody>
              ${medRows}
            </tbody>
          </table>

          <p style="margin:0; color:#64748b; font-size:14px; line-height:1.6;">
            Please check in with your patient to ensure they take their medications.
          </p>
        </div>

        <!-- Footer -->
        <div style="padding:16px 32px; background:#f8fafc; border-top:1px solid #e2e8f0;">
          <p style="margin:0; font-size:12px; color:#94a3b8; text-align:center;">
            Sent by MedRemind · You're receiving this as a registered caretaker
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}

// ─── Main Handler ──────────────────────────────────────────────────────────────

serve(async (_req: Request) => {
  const authHeader = _req.headers.get("authorization");
  const secret = Deno.env.get("CRON_SECRET");

  console.log("Header sent:", authHeader);
  console.log("Secret stored:", secret);

  // Check CRON_SECRET
  if (!authHeader || authHeader !== `Bearer ${secret}`) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Unauthorized – invalid CRON_SECRET",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const resendApiKey = Deno.env.get("RESEND_API_KEY")!;
  const fromEmail = Deno.env.get("FROM_EMAIL") ?? "noreply@medremind.app";

  console.log({
    supabaseUrl,
    supabaseKey: supabaseKey?.slice(0, 5) + "...",
    resendApiKey: resendApiKey?.slice(0, 5) + "...",
    fromEmail,
  });

  console.log("ResendApiKey : " + resendApiKey);

  if (!supabaseUrl || !supabaseKey || !resendApiKey) {
    throw new Error("Missing required environment variables");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });
  const now = new Date();
  const results: string[] = [];

  try {
    // 1. Fetch all user profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, caretaker_email, notification_time");

    if (profilesError) throw profilesError;

    for (const profile of profiles as Profile[]) {
      if (!profile.caretaker_email) {
        results.push(`[${profile.id}] Skipped — no caretaker email`);
        continue;
      }
      const notifTimeStr = profile.notification_time || "09:00";
      const [h, m] = notifTimeStr.split(":").map(Number);

      const notifTime = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          h,
          m,
          0,
          0,
        ),
      );

      console.log("Current time (UTC):", now.toISOString());
      console.log(
        "Notification time (calculated UTC):",
        notifTime.toISOString(),
      );
      console.log("Stored notification_time string (UTC):", notifTimeStr);

      // Calculate difference
      const diff = now.getTime() - notifTime.getTime();

      // 5 minute window
      if (diff < 0 || diff > 5 * 60 * 1000) {
        results.push(
          `[${profile.id}] Skipped — not within notification window`,
        );
        continue;
      }

      results.push(`[${profile.id}] Using notification time: ${notifTimeStr}`);

      const { data: medications, error: medsError } = await supabase
        .from("medications")
        .select("id, name, dosage, user_id")
        .eq("user_id", profile.id)
        .eq("is_active", true);

      if (medsError) throw medsError;
      if (!medications?.length) continue;

      const { data: logs, error: logsError } = await supabase
        .from("medication_logs")
        .select("medication_id, status")
        .eq("user_id", profile.id)
        .eq("scheduled_date", today);

      if (logsError) throw logsError;

      const takenIds = new Set(
        (logs as MedicationLog[])
          .filter((l) => l.status === "taken")
          .map((l) => l.medication_id),
      );

      const missed = (medications as Medication[]).filter(
        (m) => !takenIds.has(m.id),
      );

      if (!missed.length) {
        results.push(`[${profile.id}] All medications taken — no alert needed`);
        continue;
      }

      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `MedRemind <${fromEmail}>`,
          to: [profile.caretaker_email],
          subject: `⚠️ ${missed.length} medication${missed.length > 1 ? "s" : ""} not taken today`,
          html: buildEmailHtml(profile.full_name, missed),
        }),
      });

      console.log("Email API status:", emailRes.status);

      if (!emailRes.ok) {
        const err = await emailRes.text();
        results.push(`[${profile.id}] Email failed: ${err}`);
        continue;
      }

      for (const med of missed) {
        const alreadyLogged = (logs as MedicationLog[]).some(
          (l) => l.medication_id === med.id,
        );

        if (!alreadyLogged) {
          await supabase.from("medication_logs").insert({
            medication_id: med.id,
            user_id: profile.id,
            scheduled_date: today,
            status: "missed",
            taken_at: new Date().toISOString(),
          });
        }
      }

      results.push(
        `[${profile.id}] Alert sent to ${profile.caretaker_email} — ${missed.length} missed`,
      );
    }

    return new Response(JSON.stringify({ success: true, processed: results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
