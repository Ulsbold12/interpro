import "server-only";
import { cookies } from "next/headers";
import { HttpError } from "../inquiry";
import { requiredEnv, supabaseUrl } from "./backend";

export const SESSION_COOKIE = "interpro-admin";
export const sessionOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, path: "/" };
export function allowedAdmin(email: string) {
  return requiredEnv("ADMIN_EMAILS").split(",").map(item => item.trim().toLowerCase()).includes(email.toLowerCase());
}
export async function getAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const response = await fetch(`${supabaseUrl()}/auth/v1/user`, {
    cache: "no-store", signal: AbortSignal.timeout(10000),
    headers: { apikey: requiredEnv("SUPABASE_ANON_KEY"), Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return null;
  const user = await response.json() as { id: string; email?: string; email_confirmed_at?: string };
  return user.email && user.email_confirmed_at && allowedAdmin(user.email) ? { id: user.id, email: user.email } : null;
}
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) throw new HttpError(401, "Дахин нэвтэрнэ үү.");
  return admin;
}
