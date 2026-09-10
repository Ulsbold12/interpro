"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Mail, Phone, X } from "lucide-react";

// Add verified company contact details here.
export const CONTACT = { phone: "", email: "", facebook: "" };
const ContactContext = createContext<(subject?: string) => void>(() => {});
export function useContact() { return useContext(ContactContext); }
export function ContactProvider({ children }: { children: ReactNode }) {
  const [subject, setSubject] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (subject === null) return;
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; previous?.focus(); };
  }, [subject]);
  const close = () => { dialog.current?.close(); setSubject(null); };
  return <ContactContext.Provider value={(value = "Арга хэмжээний үнийн санал") => setSubject(value)}>
    {children}
    <dialog ref={dialog} className="contact-dialog" aria-labelledby="contact-title" onCancel={close} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div className="dialog-content">
        <button className="icon-button dialog-close" onClick={close} aria-label="Хаах"><X size={21} /></button>
        <span className="eyebrow">LET’S MAKE IT HAPPEN</span>
        <h2 id="contact-title">Хамтдаа төлөвлөе.</h2>
        <p>Арга хэмжээний огноо, байршил, оролцогчдын тоогоо хэлээрэй. Танд тохирох шийдлийг ярилцъя.</p>
        <div className="subject-line">Таны сонирхсон үйлчилгээ<strong>{subject}</strong></div>
        <div className="contact-options">
          {CONTACT.phone && <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}><Phone size={20} /><span><small>Шууд залгах</small>{CONTACT.phone}</span><ArrowUpRight size={20} /></a>}
          {CONTACT.email && <a href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(subject ?? "Үнийн санал")}`}><Mail size={20} /><span><small>Имэйл бичих</small>{CONTACT.email}</span><ArrowUpRight size={20} /></a>}
          {CONTACT.facebook && <a href={CONTACT.facebook} target="_blank" rel="noreferrer"><span className="facebook-icon">f</span><span><small>Facebook</small>INTERPRO</span><ArrowUpRight size={20} /></a>}
          {!CONTACT.phone && !CONTACT.email && !CONTACT.facebook && <p>Холбоо барих мэдээлэл удахгүй нэмэгдэнэ.</p>}
        </div>
        <p className="dialog-note">Хэрэгцээгээ ярилцаад, үнийн саналаа аваарай.</p>
      </div>
    </dialog>
  </ContactContext.Provider>;
}
export function ContactButton({ children = "Холбоо барих", subject, className = "button button-dark" }: { children?: ReactNode; subject?: string; className?: string }) {
  const openContact = useContact();
  return <button className={className} onClick={() => openContact(subject)}>{children}</button>;
}
