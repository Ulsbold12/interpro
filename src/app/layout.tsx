import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "INTERPRO | Дуу, дүрс, орчуулга & эвентийн шийдэл",
  description: "Хурал, форум, эвентийн дуу, дүрс, синхрон орчуулга, шууд дамжуулалтын техникийн шийдэл. INTERPRO-той арга хэмжээгээ хамт төлөвлөөрэй.",
  keywords: ["эвент тоног төхөөрөмж", "синхрон орчуулга", "дуу дүрсний түрээс", "хурлын техник", "Улаанбаатар"],
  icons: { icon: "/interpro.jpeg", apple: "/interpro.jpeg" },
  openGraph: { title: "INTERPRO — Таны эвент. Бидний шийдэл.", description: "Audio Visual · Interpretation · Live Solutions", locale: "mn_MN", type: "website", images: [{ url: "/b38155c1-f35f-4e60-9287-21756ae7fe0b.jpeg", width: 1536, height: 2048, alt: "INTERPRO синхрон орчуулгын шийдэл" }] },
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="mn"><body>{children}</body></html>;
}
