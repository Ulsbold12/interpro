import "server-only";
import { HttpError } from "../inquiry";

export function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new HttpError(503, "Үйлчилгээний тохиргоо хийгдэж байна. Утсаар эсвэл имэйлээр холбогдоорой.");
  return value;
}
export function supabaseUrl() { return requiredEnv("SUPABASE_URL").replace(/\/$/, ""); }
export async function database<T>(path: string, options: RequestInit = {}): Promise<T> {
  const key = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const response = await fetch(`${supabaseUrl()}/rest/v1/${path}`, {
    ...options, cache: "no-store", signal: AbortSignal.timeout(12000),
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...options.headers },
  });
  if (!response.ok) throw new HttpError(503, "Мэдээллийн сантай холбогдож чадсангүй. Дахин оролдоно уу.");
  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const actualUrl = new URL(request.url);
  // Next's internal URL can use localhost even when the browser used 127.0.0.1.
  if (!process.env.NEXT_PUBLIC_SITE_URL && request.headers.get("host")) actualUrl.host = request.headers.get("host")!;
  const expected = new URL(process.env.NEXT_PUBLIC_SITE_URL || actualUrl.href).origin;
  if (!origin || origin !== expected) throw new HttpError(403, "Энэ үйлдлийг сайтаас хийнэ үү.");
}
export async function readJson(request: Request): Promise<Record<string, unknown>> {
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "Мэдээлэл оруулаагүй байна.");
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 16000) { await reader.cancel(); throw new HttpError(413, "Мэдээлэл хэт урт байна."); }
    chunks.push(value);
  }
  try {
    const data: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error();
    return data as Record<string, unknown>;
  } catch { throw new HttpError(400, "Мэдээллийн хэлбэр буруу байна."); }
}
export function apiError(error: unknown) {
  return Response.json({ error: error instanceof HttpError ? error.message : "Үйлдэл амжилтгүй боллоо. Дахин оролдоно уу." }, {
    status: error instanceof HttpError ? error.status : 503, headers: { "Cache-Control": "no-store" },
  });
}
