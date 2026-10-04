import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "INTERPRO | Синхрон орчуулгын тоног төхөөрөмжийн түрээс",
  description: "Олон улсын хурал, уулзалт, сургалт, форумд зориулсан синхрон орчуулгын тоног төхөөрөмжийн түрээс, хурлын аудио болон техникийн үйлчилгээ.",
  keywords: ["синхрон орчуулга", "орчуулгын тоног төхөөрөмжийн түрээс", "хурлын аудио", "хурлын техник", "Улаанбаатар"],
  icons: { icon: "/favicon.ico", apple: "/apple-icon.png" },
  openGraph: { title: "INTERPRO — Таны хэл. Таны арга хэмжээ. Бидний техникийн шийдэл.", description: "Синхрон орчуулгын тоног төхөөрөмжийн түрээс, хурлын аудио, техникийн үйлчилгээ.", locale: "mn_MN", type: "website", images: [{ url: "/b38155c1-f35f-4e60-9287-21756ae7fe0b.jpeg", width: 1536, height: 2048, alt: "INTERPRO синхрон орчуулгын шийдэл" }] },
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="mn"><body>{children}</body></html>;
}
