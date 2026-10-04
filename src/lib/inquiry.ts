export const INQUIRY_STATUSES = ["new", "contacted", "done"] as const;
export type InquiryStatus = typeof INQUIRY_STATUSES[number];
export const STATUS_LABELS: Record<InquiryStatus, string> = { new: "Шинэ", contacted: "Холбогдсон", done: "Дууссан" };
export type InquiryInput = {
  id: string; name: string; phone: string; email: string;
  subject: string; event_date: string | null; guests: number | null; note: string;
};
export type Inquiry = InquiryInput & {
  created_at: string; status: InquiryStatus; notification_status: "pending" | "sent" | "failed";
  notification_sent_at: string | null;
};
export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function validId(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}
export function validateInquiry(raw: unknown): InquiryInput {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new HttpError(400, "Мэдээллээ шалгана уу.");
  const data = raw as Record<string, unknown>;
  function text(key: string, min: number, max: number) {
    const value = typeof data[key] === "string" ? (data[key] as string).trim() : "";
    if (value.length < min || value.length > max || value.includes("\0")) throw new HttpError(400, "Мэдээллээ бүрэн, зөв оруулна уу.");
    return value;
  }
  const id = text("id", 36, 36);
  if (!validId(id)) throw new HttpError(400, "Хуудсаа шинэчлээд дахин оролдоно уу.");
  const name = text("name", 2, 100);
  const phone = text("phone", 6, 30);
  if (!/^\+?[\d\s()-]+$/.test(phone) || phone.replace(/\D/g, "").length < 6) throw new HttpError(400, "Утасны дугаараа шалгана уу.");
  const email = text("email", 0, 254).toLowerCase();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, "Имэйл хаягаа шалгана уу.");
  const subject = text("subject", 1, 400);
  const note = text("note", 1, 4000);
  const date = text("event_date", 0, 10);
  if (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date)) throw new HttpError(400, "Огноогоо шалгана уу.");
  const guests = data.guests === "" || data.guests === null || data.guests === undefined ? null : Number(data.guests);
  if (guests !== null && (!Number.isInteger(guests) || guests < 1 || guests > 100000)) throw new HttpError(400, "Оролцогчдын тоогоо шалгана уу.");
  return { id, name, phone, email, subject, note, event_date: date || null, guests };
}
