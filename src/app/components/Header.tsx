"use client";
import { useState } from "react";
import { ArrowUpRight, AudioLines, Menu, X } from "lucide-react";
const links = [["#about", "Бидний тухай"], ["#services", "Бидний үйлчилгээ"], ["#equipment", "Тоног төхөөрөмж"], ["#solutions", "Манай баг"]];
export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="container header-inner">
    <a href="#home" className="brand" aria-label="INTERPRO нүүр" onClick={() => setOpen(false)}><AudioLines size={39} strokeWidth={1.6} /><span><strong>INTERPRO</strong><small>Синхрон орчуулга · Хурлын аудио</small></span></a>
    <nav className="desktop-nav" aria-label="Үндсэн цэс">{links.map(([href, title]) => <a href={href} key={href}>{title}</a>)}</nav>
    <div className="header-actions"><a href="#contact" className="button header-contact">Бидэнтэй холбогдох <ArrowUpRight size={15} /></a><button className="icon-button menu-toggle" aria-label={open ? "Цэс хаах" : "Цэс нээх"} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>
  </div>{open && <nav id="mobile-nav" className="mobile-nav" aria-label="Утасны цэс">{[...links, ["#contact", "Бидэнтэй холбогдох"]].map(([href, title]) => <a href={href} key={href} onClick={() => setOpen(false)}>{title}<ArrowUpRight size={17} /></a>)}</nav>}</header>;
}
