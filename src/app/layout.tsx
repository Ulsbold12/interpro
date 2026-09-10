import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "INTERPRO | Дуу, дүрс, орчуулга & эвентийн шийдэл",
  description: "Хурал, форум, эвентийн дуу, дүрс, синхрон орчуулга, шууд дамжуулалтын техникийн шийдэл. INTERPRO-той арга хэмжээгээ хамт төлөвлөөрэй.",
  icons: { icon: "/interpro.jpeg", apple: "/interpro.jpeg" },
  openGraph: { title: "INTERPRO — Таны эвент. Бидний шийдэл.", description: "Audio Visual · Interpretation · Live Solutions", locale: "mn_MN", type: "website", images: [{ url: "/interpro.jpeg", width: 1004, height: 650, alt: "INTERPRO" }] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="mn"><body>{children}</body></html>;
}
