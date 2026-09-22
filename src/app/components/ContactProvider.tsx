"use client";

import { createContext, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowUpRight, Check, Copy, Mail, Phone, X } from "lucide-react";

// Add verified company contact details here.
export const CONTACT = { phone: "", email: "", facebook: "" };
const ContactContext = createContext<(subject?: string) => void>(() => {});
export function useContact() { return useContext(ContactContext); }
export function ContactProvider({ children }: { children: ReactNode }) {
  const [subject, setSubject] = useState<string | null>(null);
  const [preparedRequest, setPreparedRequest] = useState("");
  const [copied, setCopied] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (subject === null) return;
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; previous?.focus(); };
  }, [subject]);
  const close = () => { dialog.current?.close(); setSubject(null); setPreparedRequest(""); setCopied(false); };
  const copyRequest = async (text = preparedRequest) => {
    try { await navigator.clipboard.writeText(text); setCopied(true); } catch { setCopied(false); }
  };
  const prepareRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const request = [
      "INTERPRO — Үнийн саналын хүсэлт",
      `Үйлчилгээ: ${subject}`,
      `Нэр: ${data.get("name")}`,
      `Утас: ${data.get("phone")}`,
      `Огноо: ${data.get("date") || "Тодорхойгүй"}`,
      `Хүний тоо: ${data.get("guests") || "Тодорхойгүй"}`,
      `Нэмэлт мэдээлэл: ${data.get("note") || "—"}`,
    ].join("\n");
    setPreparedRequest(request);
    void copyRequest(request);
  };
  return <ContactContext.Provider value={(value = "Арга хэмжээний үнийн санал") => setSubject(value)}>
    {children}
    <dialog ref={dialog} className="contact-dialog" aria-labelledby="contact-title" onCancel={close} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div className="dialog-content">
        <button className="icon-button dialog-close" onClick={close} aria-label="Хаах"><X size={21} /></button>
        <span className="eyebrow">LET’S MAKE IT HAPPEN</span>
        <h2 id="contact-title">Хамтдаа төлөвлөе.</h2>
        <p>Арга хэмжээний огноо, байршил, оролцогчдын тоогоо хэлээрэй. Танд тохирох шийдлийг ярилцъя.</p>
        <div className="subject-line">Таны сонирхсон үйлчилгээ<strong>{subject}</strong></div>
        {(CONTACT.phone || CONTACT.email || CONTACT.facebook) && <div className="contact-options">
          {CONTACT.phone && <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}><Phone size={20} /><span><small>Шууд залгах</small>{CONTACT.phone}</span><ArrowUpRight size={20} /></a>}
          {CONTACT.email && <a href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(subject ?? "Үнийн санал")}`}><Mail size={20} /><span><small>Имэйл бичих</small>{CONTACT.email}</span><ArrowUpRight size={20} /></a>}
          {CONTACT.facebook && <a href={CONTACT.facebook} target="_blank" rel="noreferrer"><span className="facebook-icon">f</span><span><small>Facebook</small>INTERPRO</span><ArrowUpRight size={20} /></a>}
        </div>}
        {!preparedRequest ? <form className="inquiry-form" onSubmit={prepareRequest}>
          <div className="form-row"><label>Таны нэр<input name="name" autoComplete="name" required placeholder="Нэрээ оруулна уу" /></label><label>Утасны дугаар<input name="phone" type="tel" autoComplete="tel" required placeholder="99xx xxxx" /></label></div>
          <div className="form-row"><label>Эвентийн огноо<input name="date" type="date" /></label><label>Оролцогчдын тоо<input name="guests" type="number" min="1" placeholder="Жишээ: 80" /></label></div>
          <label>Нэмэлт мэдээлэл<textarea name="note" rows={3} placeholder="Байршил, хөтөлбөр болон хэрэгцээгээ товч бичээрэй" /></label>
          <button className="button button-dark" type="submit">Хүсэлт бэлтгэх <ArrowUpRight size={18} /></button>
          <p className="form-privacy">Demo горимд мэдээлэл сервер рүү илгээгдэхгүй.</p>
        </form> : <div className="request-ready" role="status">
          <span className="request-ready-icon"><Check size={22} /></span><h3>Хүсэлт бэлэн боллоо.</h3>
          <p>Доорх мэдээллийг хуулж, INTERPRO-ийн сонгосон сувгаар илгээнэ үү.</p>
          <textarea readOnly value={preparedRequest} rows={8} aria-label="Бэлтгэсэн хүсэлт" />
          <button className="button button-dark" onClick={() => void copyRequest()}>{copied ? <><Check size={18} /> Хуулагдлаа</> : <><Copy size={18} /> Хуулах</>}</button>
        </div>}
      </div>
    </dialog>
  </ContactContext.Provider>;
}
export function ContactButton({ children = "Холбоо барих", subject, className = "button button-dark" }: { children?: ReactNode; subject?: string; className?: string }) {
  const openContact = useContact();
  return <button className={className} onClick={() => openContact(subject)}>{children}</button>;
}
