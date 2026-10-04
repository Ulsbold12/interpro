import "server-only";
import type { Inquiry } from "../inquiry";
import { database, requiredEnv } from "./backend";

export async function notifyInquiry(inquiry: Inquiry) {
  if (inquiry.notification_status === "sent") return true;
  try {
    const recipients = requiredEnv("INQUIRY_EMAIL_TO").split(",").map(item => item.trim()).filter(Boolean);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST", signal: AbortSignal.timeout(10000),
      headers: { Authorization: `Bearer ${requiredEnv("RESEND_API_KEY")}`, "Content-Type": "application/json", "Idempotency-Key": `inquiry/${inquiry.id}` },
      body: JSON.stringify({
        from: requiredEnv("INQUIRY_EMAIL_FROM"), to: recipients,
        ...(inquiry.email ? { reply_to: inquiry.email } : {}),
        subject: `INTERPRO — Шинэ хүсэлт: ${inquiry.subject.replace(/[\r\n]/g, " ")}`,
        text: ["Шинэ үнийн саналын хүсэлт", `Нэр: ${inquiry.name}`, `Утас: ${inquiry.phone}`, `Имэйл: ${inquiry.email || "—"}`,
          `Сонирхсон бараа / үйлчилгээ: ${inquiry.subject}`, `Эвентийн огноо: ${inquiry.event_date || "—"}`, `Оролцогчдын тоо: ${inquiry.guests || "—"}`,
          "", inquiry.note, "", `Panel: ${requiredEnv("NEXT_PUBLIC_SITE_URL").replace(/\/$/, "")}/admin`, `Хүсэлтийн дугаар: ${inquiry.id}`].join("\n"),
      }),
    });
    if (!response.ok) throw new Error("Email provider rejected notification");
    await database(`inquiries?id=eq.${inquiry.id}`, { method: "PATCH", body: JSON.stringify({ notification_status: "sent", notification_sent_at: new Date().toISOString() }) });
    return true;
  } catch {
    // A saved inquiry is never lost because the email provider is unavailable.
    try { await database(`inquiries?id=eq.${inquiry.id}&notification_status=neq.sent`, { method: "PATCH", body: JSON.stringify({ notification_status: "failed" }) }); } catch { /* Still pending and retryable. */ }
    return false;
  }
}
