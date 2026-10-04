import { createHash, createHmac } from "node:crypto";
import { HttpError, validateInquiry, type Inquiry } from "@/lib/inquiry";
import { apiError, database, readJson, requiredEnv, sameOrigin } from "@/lib/server/backend";
import { notifyInquiry } from "@/lib/server/notifications";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const raw = await readJson(request);
    if (raw.website) return Response.json({ success: true });
    const input = validateInquiry(raw);
    const hash = createHash("sha256").update(JSON.stringify(input)).digest("hex");
    const existing = await database<(Inquiry & { request_hash: string })[]>(`inquiries?id=eq.${input.id}&select=*`);
    if (existing.length) {
      if (existing[0].request_hash !== hash) throw new HttpError(409, "Мэдээлэл өөрчлөгдсөн байна. Хуудсаа шинэчлээд дахин илгээнэ үү.");
      return Response.json({ success: true, id: input.id });
    }
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const key = createHmac("sha256", requiredEnv("SUPABASE_SERVICE_ROLE_KEY")).update(`inquiry:${ip}`).digest("hex");
    const allowed = await database<boolean>("rpc/consume_inquiry_limit", { method: "POST", body: JSON.stringify({ bucket_key: key, maximum: 5, window_seconds: 600 }) });
    if (!allowed) throw new HttpError(429, "Олон хүсэлт илгээсэн байна. 10 минутын дараа дахин оролдоно уу.");
    const saved = await database<Inquiry[]>("inquiries?on_conflict=id", {
      method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=representation" }, body: JSON.stringify({ ...input, request_hash: hash }),
    });
    if (saved[0]) await notifyInquiry(saved[0]);
    else {
      const duplicate = await database<{ request_hash: string }[]>(`inquiries?id=eq.${input.id}&select=request_hash`);
      if (duplicate[0]?.request_hash !== hash) throw new HttpError(409, "Мэдээлэл өөрчлөгдсөн байна. Хуудсаа шинэчлээд дахин илгээнэ үү.");
    }
    return Response.json({ success: true, id: input.id }, { status: 201 });
  } catch (error) { return apiError(error); }
}
