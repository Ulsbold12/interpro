"use client";
import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { ContactButton } from "./ContactProvider";
const links = [["#equipment", "Тоног төхөөрөмж"], ["#solutions", "Шийдлүүд"], ["#about", "Бидний тухай"], ["#faq", "Түгээмэл асуулт"]];
export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="container header-inner">
      <a href="#home" className="brand" aria-label="INTERPRO нүүр" onClick={() => setOpen(false)}><Image src="/interpro.jpeg" alt="INTERPRO" width={1004} height={650} preload /></a>
      <nav className="desktop-nav" aria-label="Үндсэн цэс">{links.map(([href, title]) => <a href={href} key={href}>{title}</a>)}</nav>
      <div className="header-actions"><ContactButton className="button button-lime header-contact">Холбоо барих <ArrowUpRight size={17} /></ContactButton><button className="icon-button menu-toggle" aria-label={open ? "Цэс хаах" : "Цэс нээх"} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>
    </div>
    {open && <nav id="mobile-nav" className="mobile-nav" aria-label="Утасны цэс">{links.map(([href, title]) => <a href={href} key={href} onClick={() => setOpen(false)}>{title}<ArrowUpRight size={18} /></a>)}<a href="#contact" onClick={() => setOpen(false)}>Холбоо барих<ArrowUpRight size={18} /></a></nav>}
  </header>;
}
