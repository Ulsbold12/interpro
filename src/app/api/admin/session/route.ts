import { cookies } from "next/headers";
import { HttpError } from "@/lib/inquiry";
import { allowedAdmin, getAdmin, SESSION_COOKIE, sessionOptions } from "@/lib/server/auth";
import { apiError, readJson, requiredEnv, sameOrigin, supabaseUrl } from "@/lib/server/backend";

export async function GET() {
  try { return Response.json({ admin: await getAdmin() }, { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return apiError(error); }
}
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const data = await readJson(request);
    const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
    const password = typeof data.password === "string" ? data.password : "";
    if (!email || email.length > 254 || !password || password.length > 256 || !allowedAdmin(email)) throw new HttpError(401, "Имэйл эсвэл нууц үг буруу байна.");
    const response = await fetch(`${supabaseUrl()}/auth/v1/token?grant_type=password`, {
      method: "POST", cache: "no-store", signal: AbortSignal.timeout(10000),
      headers: { apikey: requiredEnv("SUPABASE_ANON_KEY"), "Content-Type": "application/json" }, body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new HttpError(response.status === 429 ? 429 : 401, response.status === 429 ? "Түр хүлээгээд дахин оролдоно уу." : "Имэйл эсвэл нууц үг буруу байна.");
    const session = await response.json() as { access_token: string; expires_in: number; user: { email: string; email_confirmed_at?: string } };
    if (!session.user.email_confirmed_at || !allowedAdmin(session.user.email)) throw new HttpError(401, "Нэвтрэх эрхгүй байна.");
    (await cookies()).set(SESSION_COOKIE, session.access_token, { ...sessionOptions, maxAge: Math.min(session.expires_in, 3600) });
    return Response.json({ success: true });
  } catch (error) { return apiError(error); }
}
export async function DELETE(request: Request) {
  try {
    sameOrigin(request);
    (await cookies()).set(SESSION_COOKIE, "", { ...sessionOptions, maxAge: 0 });
    return Response.json({ success: true });
  } catch (error) { return apiError(error); }
}
