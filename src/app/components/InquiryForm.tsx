"use client";
import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
export function InquiryForm({ subject = "Арга хэмжээний үнийн санал", onBusyChange, onClose }: { subject?: string; onBusyChange?: (busy: boolean) => void; onClose?: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submission = useRef<{ id: string; payload: string } | null>(null);
  const sendRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const data = new FormData(event.currentTarget);
    const payload = { subject, name: data.get("name"), phone: data.get("phone"), email: data.get("email"), event_date: data.get("date"), guests: data.get("guests"), note: data.get("note"), website: data.get("website") };
    const serialized = JSON.stringify(payload);
    setSubmitting(true); setError(""); onBusyChange?.(true);
    try {
      if (!submission.current || submission.current.payload !== serialized) submission.current = { id: crypto.randomUUID(), payload: serialized };
      const response = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, id: submission.current.id }), signal: AbortSignal.timeout(35000) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Хүсэлт илгээж чадсангүй.");
      setSubmitted(true);
    } catch (cause) {
      setError(cause instanceof Error && !["TimeoutError", "TypeError"].includes(cause.name) ? cause.message : "Холболт тасарлаа. Маягтын мэдээлэл хэвээр байгаа тул дахин илгээж болно.");
    } finally { setSubmitting(false); onBusyChange?.(false); }
  };
  if (submitted) return <div className="request-ready" role="status"><span className="request-ready-icon"><Check size={26} /></span><h3>Хүсэлт илгээгдлээ.</h3><p>Таны хүсэлтийг хүлээн авлаа. Манай баг тантай эргэн холбогдоно.</p><button className="button button-blue" onClick={() => { if (onClose) onClose(); else { setSubmitted(false); submission.current = null; } }}>{onClose ? "Хаах" : "Дахин хүсэлт илгээх"}</button></div>;
  return <form className="inquiry-form" onSubmit={sendRequest}>
    <div className="inquiry-contact-fields">
      <label>Таны овог, нэр<input name="name" autoComplete="name" minLength={2} maxLength={100} required placeholder="Нэрээ оруулна уу" /></label>
      <label><span>Имэйл хаяг <small className="field-optional">(заавал биш)</small></span><input name="email" type="email" autoComplete="email" maxLength={254} placeholder="name@example.com" /></label>
      <label>Утасны дугаар<input name="phone" type="tel" autoComplete="tel" minLength={6} maxLength={30} required placeholder="99xx xxxx" /></label>
    </div>
    <label>Сонирхож буй бараа, асуулт<textarea name="note" rows={4} required maxLength={4000} defaultValue={subject !== "Арга хэмжээний үнийн санал" ? `Сонирхож буй бараа / үйлчилгээ: ${subject}\n\n` : ""} placeholder="Сонирхож буй төхөөрөмж, хэрэгцээ болон асуултаа бичээрэй…" /></label>
    <details className="inquiry-event-details"><summary>Эвентийн дэлгэрэнгүй <span>(заавал биш)</span></summary><div className="form-row"><label>Эвентийн огноо<input name="date" type="date" /></label><label>Оролцогчдын тоо<input name="guests" type="number" min="1" max="100000" placeholder="Жишээ: 80" /></label></div></details>
    <label className="form-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="inquiry-submit-row"><button className="button button-blue" type="submit" disabled={submitting}>{submitting ? <><LoaderCircle size={17} className="loading-spin" />Илгээж байна…</> : <>Хүсэлт илгээх <ArrowRight size={17} /></>}</button><p className="form-privacy">Таны мэдээллийг хүсэлтэд хариу өгөх зорилгоор ашиглана.</p></div>
  </form>;
}
