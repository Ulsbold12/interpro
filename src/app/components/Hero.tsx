import Image from "next/image";
import { ArrowDown, ArrowUpRight, AudioLines } from "lucide-react";
import { ContactButton } from "./ContactProvider";

export function Hero() {
  return <section className="hero" id="home" aria-labelledby="hero-title">
    <div className="container hero-grid">
      <div className="hero-content">
        <span className="eyebrow"><span className="status-dot" /> INTERPRO · АРГА ХЭМЖЭЭНИЙ ТЕХНИК</span>
        <h1 id="hero-title">Олон хэл.<br /><span>Нэг ойлголт.</span></h1>
        <p>Таны арга хэмжээ.<br />Бидний техникийн шийдэл.</p>
        <div className="hero-description">Синхрон орчуулгын тоног төхөөрөмж, хурлын аудио, суурилуулалт. Оролцогч бүр мэдээллээ тод сонсож, ойлгох нөхцөлийг бид бүрдүүлнэ.</div>
        <div className="hero-buttons"><ContactButton className="button button-blue">Арга хэмжээгээ төлөвлөе <ArrowUpRight size={19} /></ContactButton><a className="hero-secondary" href="#equipment">Төхөөрөмж үзэх <ArrowDown size={17} /></a></div>
        <div className="hero-location"><span>УЛААНБААТАР, МОНГОЛ</span><span>ТҮРЭЭС / ТЕХНИКИЙН ҮЙЛЧИЛГЭЭ</span></div>
      </div>
      <div className="hero-visual">
        <div className="hero-image"><Image src="/pro1.jpeg" alt="Хурлын микрофон, синхрон орчуулгын консол болон камер" fill sizes="(max-width: 760px) 100vw, 47vw" preload /><div className="hero-image-label"><AudioLines size={22} /><span>ХУРЛЫН БОЛОН<br />ОРЧУУЛГЫН СИСТЕМ</span></div></div>
        <div className="signal-card"><span className="signal-label">МЭДЭЭЛЭЛ ХҮРЭХ ЗАМ</span><div className="signal-route"><span>Илтгэгч</span><i aria-hidden="true" /><span>Орчуулагч</span><i aria-hidden="true" /><span>Оролцогч</span></div><div className="signal-bars" aria-hidden="true">{Array.from({length: 44}, (_, i) => <i key={i} style={{height: `${8 + ((i * 7 + i * i) % 29)}px`}} />)}</div></div>
      </div>
    </div>
    <div className="container hero-index"><a href="#services"><span>01</span> Синхрон орчуулга <ArrowUpRight size={19} /></a><a href="#services"><span>02</span> Хурлын аудио <ArrowUpRight size={19} /></a><a href="#projects"><span>03</span> Техникийн үйлчилгээ <ArrowUpRight size={19} /></a></div>
  </section>;
}
