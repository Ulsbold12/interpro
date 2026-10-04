import { HttpError, validId, type Inquiry } from "@/lib/inquiry";
import { requireAdmin } from "@/lib/server/auth";
import { apiError, database, readJson, sameOrigin } from "@/lib/server/backend";
import { notifyInquiry } from "@/lib/server/notifications";

export async function POST(request: Request) {
  try {
    sameOrigin(request); await requireAdmin();
    const { id } = await readJson(request);
    if (typeof id !== "string" || !validId(id)) throw new HttpError(400, "Хүсэлтийн дугаар буруу байна.");
    const inquiries = await database<Inquiry[]>(`inquiries?id=eq.${id}&select=*`);
    if (!inquiries[0]) throw new HttpError(404, "Хүсэлт олдсонгүй.");
    const sent = await notifyInquiry(inquiries[0]);
    if (!sent) throw new HttpError(503, "Имэйл илгээж чадсангүй. Тохиргоогоо шалгаад дахин оролдоно уу.");
    return Response.json({ success: true });
  } catch (error) { return apiError(error); }
}
