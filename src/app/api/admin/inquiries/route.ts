import { type Inquiry, INQUIRY_STATUSES, HttpError, validId } from "@/lib/inquiry";
import { requireAdmin } from "@/lib/server/auth";
import { apiError, database, readJson, sameOrigin } from "@/lib/server/backend";

const columns = "id,name,phone,email,subject,event_date,guests,note,created_at,status,notification_status,notification_sent_at";
export async function GET(request: Request) {
  try {
    await requireAdmin();
    const params = new URL(request.url).searchParams;
    const offset = Math.max(0, Math.min(100000, Number(params.get("offset")) || 0));
    const filter = params.get("status");
    if (filter && !INQUIRY_STATUSES.includes(filter as typeof INQUIRY_STATUSES[number])) throw new HttpError(400, "Төлөв буруу байна.");
    const inquiries = await database<Inquiry[]>(`inquiries?select=${columns}&order=created_at.desc,id.desc&limit=51&offset=${Math.floor(offset)}${filter ? `&status=eq.${filter}` : ""}`);
    return Response.json({ inquiries: inquiries.slice(0, 50), hasMore: inquiries.length > 50 }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return apiError(error); }
}
export async function PATCH(request: Request) {
  try {
    sameOrigin(request); await requireAdmin();
    const data = await readJson(request);
    if (typeof data.id !== "string" || !validId(data.id) || !INQUIRY_STATUSES.includes(data.status as typeof INQUIRY_STATUSES[number])) throw new HttpError(400, "Мэдээллээ шалгана уу.");
    const updated = await database<Inquiry[]>(`inquiries?id=eq.${data.id}&select=${columns}`, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify({ status: data.status }) });
    if (!updated[0]) throw new HttpError(404, "Хүсэлт олдсонгүй.");
    return Response.json({ inquiry: updated[0] });
  } catch (error) { return apiError(error); }
}
