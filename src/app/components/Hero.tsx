import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ContactButton } from "./ContactProvider";

export function Hero() {
  return <section className="hero" id="home" aria-labelledby="hero-title">
    <Image className="hero-background" src="/b38155c1-f35f-4e60-9287-21756ae7fe0b.jpeg" alt="INTERPRO-ийн хурлын танхим дахь синхрон орчуулгын бүхээгийн суурилуулалт" fill sizes="100vw" preload />
    <div className="hero-shade" aria-hidden="true" />
    <div className="container hero-content">
      <span className="eyebrow">INTERPRO / СИНХРОН ОРЧУУЛГА · ХУРЛЫН АУДИО</span>
      <h1 id="hero-title">Таны хэл.<br />Таны арга хэмжээ.<br /><span>Бидний техникийн шийдэл.</span></h1>
      <p>Синхрон орчуулгын тоног төхөөрөмжийн түрээс, хурлын аудио систем. Суурилуулалтаас арга хэмжээ дуусах хүртэлх техникийн үйлчилгээ.</p>
      <div className="hero-buttons"><ContactButton className="button button-blue">Арга хэмжээгээ төлөвлөе <ArrowUpRight size={19} /></ContactButton><a className="hero-secondary" href="#equipment">Төхөөрөмж үзэх <ArrowDown size={17} /></a></div>
    </div>
    <div className="container hero-index"><a href="#services"><span>01</span> Синхрон орчуулга <ArrowUpRight size={19} /></a><a href="#services"><span>02</span> Хурлын аудио <ArrowUpRight size={19} /></a><a href="#projects"><span>03</span> Техникийн үйлчилгээ <ArrowUpRight size={19} /></a></div>
  </section>;
}
