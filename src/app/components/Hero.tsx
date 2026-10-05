import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ContactButton } from "./ContactProvider";
import ParticleText from "./ParticleText";

export function Hero() {
  return <section className="hero" id="home" aria-labelledby="hero-title">
    <Image className="hero-background" src="/prohuuhen.jpeg" alt="Хурлын танхимыг харж синхрон орчуулга хийж буй орчуулагч" fill sizes="100vw" preload />
    <div className="hero-shade" aria-hidden="true" />
    <div className="container hero-content">
      <span className="eyebrow">INTERPRO / СИНХРОН ОРЧУУЛГА · ХУРЛЫН АУДИО</span>
      <h1 id="hero-title"><ParticleText text="Таны хэл." className="hero-particle-line" particleSize={1.65} density={3} color="#ffffff" highlightColor="#bdc2cf" scatter={65} gatherDuration={1250} stagger={180} pointerRepel={14} repelRadius={65} idleDrift={0.25} trigger="hover" fontSize="1em" fontWeight={600} glow={false} /><br />Таны арга хэмжээ.<br /><span>Бидний техникийн шийдэл.</span></h1>
      <p>Синхрон орчуулгын тоног төхөөрөмжийн түрээс, хурлын аудио систем. Суурилуулалтаас арга хэмжээ дуусах хүртэлх техникийн үйлчилгээ.</p>
      <div className="hero-buttons"><ContactButton className="button button-blue">Арга хэмжээгээ төлөвлөе <ArrowUpRight size={19} /></ContactButton><a className="hero-secondary" href="#equipment">Төхөөрөмж үзэх <ArrowDown size={17} /></a></div>
    </div>
    <div className="container hero-index"><a href="#services"><span>01</span> Синхрон орчуулга <ArrowUpRight size={19} /></a><a href="#services"><span>02</span> Хурлын аудио <ArrowUpRight size={19} /></a><a href="#projects"><span>03</span> Техникийн үйлчилгээ <ArrowUpRight size={19} /></a></div>
  </section>;
}
