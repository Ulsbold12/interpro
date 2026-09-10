import { ArrowDown, ArrowUpRight, AudioLines, Check } from "lucide-react";
import { ContactButton } from "./ContactProvider";
export function Hero() {
  return <section className="hero" id="home">
    <div className="container hero-grid">
      <div className="hero-copy"><span className="eyebrow"><span className="status-dot" /> AUDIO. VISUAL. CONNECTION.</span>
        <h1>Таны эвент.<br />Бидний <span>шийдэл.</span></h1>
        <p className="hero-description">Дуу, дүрс, синхрон орчуулга, шууд дамжуулалт.<br className="desktop-break" /> Арга хэмжээний тань техникийн хэрэгцээг нэг дор.</p>
        <div className="hero-buttons"><a className="button button-lime" href="#equipment">Төхөөрөмж үзэх <ArrowUpRight size={18} /></a><ContactButton className="button button-outline">Үнийн санал авах</ContactButton></div>
        <div className="hero-checks"><span><Check size={15} /> Хүргэлт, суурилуулалт</span><span><Check size={15} /> Техникийн дэмжлэг</span></div>
      </div>
      <div className="hero-visual">
        <div className="hero-photo" role="img" aria-label="Гэрэлтүүлэг, дэлгэц бүхий арга хэмжээний танхим" />
        <div className="visual-top"><span className="live-label"><span /> READY FOR YOUR NEXT EVENT</span><AudioLines size={25} /></div>
        <div className="visual-bottom"><span>BEHIND EVERY GREAT EVENT</span><strong>Бүх зүйл<br />нэг хэмнэлд.</strong><div className="visual-bottom-row"><span>INTERPRO / TECHNICAL SOLUTIONS</span><span className="round-arrow"><ArrowUpRight /></span></div></div>
        <div className="visual-lines" aria-hidden="true">{Array.from({ length: 29 }, (_, index) => <i key={index} style={{ height: `${12 + ((index * 17) % 49)}px` }} />)}</div>
      </div>
    </div>
    <div className="container hero-footer"><span>ХУРАЛ · ФОРУМ · СЕМИНАР · ЭВЕНТ</span><a href="#equipment">Доош үзэх <ArrowDown size={15} /></a></div>
  </section>;
}
