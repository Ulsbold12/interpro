"use client";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { InquiryForm } from "./InquiryForm";
const ContactContext = createContext<(subject?: string) => void>(() => {});
export function useContact() { return useContext(ContactContext); }
export function ContactProvider({ children }: { children: ReactNode }) {
  const [subject, setSubject] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [version, setVersion] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (subject === null) return;
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; previous?.focus(); };
  }, [subject]);
  const close = () => { if (!busy) { dialog.current?.close(); setSubject(null); } };
  return <ContactContext.Provider value={(value = "Арга хэмжээний үнийн санал") => { setVersion(previous => previous + 1); setSubject(value); }}>
    {children}
    <dialog ref={dialog} className="contact-dialog" aria-labelledby="contact-title" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="dialog-content"><button className="icon-button dialog-close" onClick={close} disabled={busy} aria-label="Хаах"><X size={21} /></button>
        <span className="eyebrow">INTERPRO / ХОЛБОО БАРИХ</span><h2 id="contact-title">Бидэнтэй холбогдох</h2><p>Хэрэгцээгээ хуваалцаарай. Танд тохирох шийдлийг хамт сонгоё.</p>
        <div className="subject-line"><span>Таны сонирхсон бараа / үйлчилгээ</span><strong>{subject}</strong></div>
        <InquiryForm key={version} subject={subject || undefined} onBusyChange={setBusy} onClose={close} />
      </div>
    </dialog>
  </ContactContext.Provider>;
}
export function ContactButton({ children = "Холбоо барих", subject, className = "button button-blue" }: { children?: ReactNode; subject?: string; className?: string }) {
  const openContact = useContact();
  return <button className={className} onClick={() => openContact(subject)}>{children}</button>;
}
