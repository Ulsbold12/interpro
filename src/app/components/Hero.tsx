import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
export function Hero() {
  return <section className="hero" id="home">
    <Image className="hero-background" src="/b38155c1-f35f-4e60-9287-21756ae7fe0b.jpeg" alt="INTERPRO-ийн суурилуулсан хурлын танхим, синхрон орчуулгын кабин" fill sizes="100vw" preload />
    <div className="hero-shade" aria-hidden="true" />
    <div className="container hero-content">
      <span className="eyebrow">СИНХРОН ОРЧУУЛГЫН ТОНОГ ТӨХӨӨРӨМЖ · ТЕХНИКИЙН ҮЙЛЧИЛГЭЭ</span>
      <h1>Таны хэл.<br />Таны арга хэмжээ.<br />Бидний техникийн шийдэл.</h1>
      <p>Синхрон орчуулгын тоног төхөөрөмжийн түрээс, хурлын аудио систем.<br className="desktop-break" /> Суурилуулалтаас арга хэмжээ дуусах хүртэлх техникийн үйлчилгээ.</p>
      <div className="hero-buttons"><a className="button button-blue" href="#services">Бидний үйлчилгээ <Play size={14} fill="currentColor" /></a><a className="hero-secondary" href="#equipment">Тоног төхөөрөмж <ArrowRight size={17} /></a></div>
    </div>
  </section>;
}
