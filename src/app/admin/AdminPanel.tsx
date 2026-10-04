"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Inbox, LoaderCircle, LogOut, Mail, Phone, RefreshCw, Search } from "lucide-react";
import { INQUIRY_STATUSES, STATUS_LABELS, type Inquiry, type InquiryStatus } from "@/lib/inquiry";

class ApiFailure extends Error {
  constructor(public status: number, message: string) { super(message); }
}
async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...options, cache: "no-store", headers: { "Content-Type": "application/json", ...options?.headers } });
  const data = await response.json();
  if (!response.ok) throw new ApiFailure(response.status, data.error || "Дахин оролдоно уу.");
  return data;
}
function dateLabel(date: string) { return new Date(date).toLocaleString("mn-MN", { timeZone: "Asia/Ulaanbaatar", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }); }

export function AdminPanel() {
  const [admin, setAdmin] = useState<{ email: string } | null | undefined>(undefined);
  const [items, setItems] = useState<Inquiry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | InquiryStatus>("all");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let active = true;
    api<{ admin: { email: string } | null }>("/api/admin/session")
      .then(data => { if (active) setAdmin(data.admin); })
      .catch(cause => { if (active) { setAdmin(null); setError(cause.message); } });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!admin) return;
    const controller = new AbortController();
    setLoading(true); setError("");
    api<{ inquiries: Inquiry[]; hasMore: boolean }>(`/api/admin/inquiries?offset=${page * 50}${filter !== "all" ? `&status=${filter}` : ""}`, { signal: controller.signal })
      .then(data => {
        setItems(data.inquiries); setHasMore(data.hasMore);
        setSelectedId(previous => data.inquiries.some(item => item.id === previous) ? previous : data.inquiries[0]?.id || null);
      })
      .catch(cause => {
        if (cause.name === "AbortError") return;
        setError(cause.message);
        if (cause.status === 401) { setAdmin(null); setItems([]); }
      }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [admin, filter, page, refresh]);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true); setError("");
    try {
      await api("/api/admin/session", { method: "POST", body: JSON.stringify({ email: data.get("email"), password: data.get("password") }) });
      const session = await api<{ admin: { email: string } | null }>("/api/admin/session");
      setAdmin(session.admin);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Нэвтрэх боломжгүй байна."); }
    finally { setBusy(false); }
  };
  const logout = async () => {
    setBusy(true); setError("");
    try { await api("/api/admin/session", { method: "DELETE" }); setAdmin(null); setItems([]); setSelectedId(null); setNotice(""); setPage(0); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Дахин оролдоно уу."); }
    finally { setBusy(false); }
  };
  const selected = items.find(item => item.id === selectedId);
  const visible = items.filter(item => `${item.name} ${item.phone} ${item.email} ${item.subject} ${item.note}`.toLowerCase().includes(query.toLowerCase()));
  const updateStatus = async (status: InquiryStatus) => {
    if (!selected) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await api("/api/admin/inquiries", { method: "PATCH", body: JSON.stringify({ id: selected.id, status }) });
      setNotice("Төлөв шинэчлэгдлээ."); setRefresh(value => value + 1);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Дахин оролдоно уу."); if (cause instanceof ApiFailure && cause.status === 401) setAdmin(null); }
    finally { setBusy(false); }
  };
  const retryEmail = async () => {
    if (!selected) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await api("/api/admin/notifications", { method: "POST", body: JSON.stringify({ id: selected.id }) });
      setNotice("Имэйл мэдэгдэл илгээгдлээ."); setRefresh(value => value + 1);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Дахин оролдоно уу."); if (cause instanceof ApiFailure && cause.status === 401) setAdmin(null); }
    finally { setBusy(false); }
  };

  if (admin === undefined) return <main className="admin-loading"><LoaderCircle className="loading-spin" />Panel нээж байна…</main>;
  if (!admin) return <main className="admin-login-page">
    <a className="admin-back" href="/"><ArrowLeft size={16} /> Сайт руу буцах</a>
    <section className="admin-login-card"><span className="eyebrow">INTERPRO / ADMIN</span><h1>Хүсэлтүүдээ удирдах.</h1><p>Эрхтэй имэйл хаягаараа нэвтэрнэ үү.</p>
      <form className="inquiry-form" onSubmit={login}><label>Имэйл<input name="email" type="email" autoComplete="username" required maxLength={254} /></label><label>Нууц үг<input name="password" type="password" autoComplete="current-password" required maxLength={256} /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button-dark" disabled={busy}>{busy ? <LoaderCircle size={18} className="loading-spin" /> : null}Нэвтрэх</button>
      </form>
    </section>
  </main>;

  return <main className="admin-page">
    <header className="admin-header"><a href="/" className="admin-wordmark">INTERPRO<span> / PANEL</span></a><div><span>{admin.email}</span><button className="button button-border" onClick={() => void logout()} disabled={busy}><LogOut size={16} /> Гарах</button></div></header>
    <div className="admin-container">
      <div className="admin-page-heading"><div><span className="eyebrow">CUSTOMER INQUIRIES</span><h1>Харилцагчийн хүсэлтүүд</h1><p>Сонирхсон бараа, асуулт болон холбоо барих мэдээлэл.</p></div><button className="button button-border" onClick={() => setRefresh(value => value + 1)} disabled={loading || busy}><RefreshCw size={16} className={loading ? "loading-spin" : ""} /> Шинэчлэх</button></div>
      <div className="admin-toolbar"><div className="filter-list">{(["all", ...INQUIRY_STATUSES] as const).map(status => <button key={status} className={`filter ${filter === status ? "active" : ""}`} aria-pressed={filter === status} disabled={busy} onClick={() => { setFilter(status); setPage(0); setQuery(""); setNotice(""); }}>{status === "all" ? "Бүгд" : STATUS_LABELS[status]}</button>)}</div><label className="admin-search"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Энэ хуудсаас хайх" aria-label="Энэ хуудсан дахь хүсэлтээс хайх" /></label></div>
      {error && <p className="form-error admin-message" role="alert">{error}</p>}
      {notice && <p className="admin-notice" role="status"><Check size={16} />{notice}</p>}
      <div className="admin-workspace" aria-busy={loading}>
        <section className="admin-request-list" aria-label="Хүсэлтийн жагсаалт">
          <div className="admin-list-label">{loading ? "Уншиж байна…" : `${visible.length} хүсэлт · Хуудас ${page + 1}`}</div>
          {!visible.length && !loading && <div className="admin-empty"><Inbox size={34} /><h2>{query ? "Хүсэлт олдсонгүй" : "Хүсэлт хараахан ирээгүй байна"}</h2><p>Шинэ хүсэлтүүд энд харагдана.</p></div>}
          {visible.map(item => <button className={`admin-request ${item.id === selectedId ? "selected" : ""}`} key={item.id} aria-pressed={item.id === selectedId} disabled={busy} onClick={() => { setSelectedId(item.id); setNotice(""); }}><div><strong>{item.name}</strong><span className={`request-status status-${item.status}`}>{STATUS_LABELS[item.status]}</span></div><p>{item.subject}</p><small>{dateLabel(item.created_at)} · {item.phone}</small></button>)}
          <div className="admin-pagination"><button className="icon-button" disabled={page === 0 || loading || busy} onClick={() => setPage(value => value - 1)} aria-label="Өмнөх хуудас"><ArrowLeft size={18} /></button><span>{page + 1}</span><button className="icon-button" disabled={!hasMore || loading || busy} onClick={() => setPage(value => value + 1)} aria-label="Дараах хуудас"><ArrowRight size={18} /></button></div>
        </section>
        <section className="admin-request-detail" aria-label="Хүсэлтийн дэлгэрэнгүй">
          {selected ? <><div className="admin-detail-heading"><div><span className="eyebrow">{dateLabel(selected.created_at)}</span><h2>{selected.name}</h2></div><span className={`request-status status-${selected.status}`}>{STATUS_LABELS[selected.status]}</span></div>
            <div className="admin-contact-links"><a href={`tel:${selected.phone.replace(/[^\d+]/g, "")}`}><Phone size={17} />{selected.phone}</a>{selected.email && <a href={`mailto:${selected.email}`}><Mail size={17} />{selected.email}</a>}</div>
            <dl className="admin-detail-fields"><div><dt>Сонирхсон бараа / үйлчилгээ</dt><dd>{selected.subject}</dd></div><div><dt>Эвентийн огноо</dt><dd>{selected.event_date || "Тодорхойгүй"}</dd></div><div><dt>Оролцогчдын тоо</dt><dd>{selected.guests || "Тодорхойгүй"}</dd></div></dl>
            <div className="admin-request-note"><h3>Нэмэлт мэдээлэл</h3><p>{selected.note}</p></div>
            <label className="admin-status-control">Хүсэлтийн төлөв<select value={selected.status} disabled={busy || loading} onChange={event => void updateStatus(event.target.value as InquiryStatus)}>{INQUIRY_STATUSES.map(status => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}</select></label>
            <div className="admin-email-status"><Mail size={18} /><div><strong>{selected.notification_status === "sent" ? "Имэйл мэдэгдэл илгээгдсэн" : selected.notification_status === "failed" ? "Имэйл мэдэгдэл илгээгдээгүй" : "Имэйл мэдэгдэл хүлээгдэж байна"}</strong><p>{selected.notification_sent_at ? dateLabel(selected.notification_sent_at) : "Хүсэлт мэдээллийн санд хадгалагдсан."}</p></div>{selected.notification_status !== "sent" && <button className="button button-border" disabled={busy} onClick={() => void retryEmail()}>Дахин илгээх</button>}</div>
          </> : <div className="admin-empty"><Inbox size={40} /><h2>Хүсэлтээ сонгоорой</h2><p>Дэлгэрэнгүй мэдээлэл энд харагдана.</p></div>}
        </section>
      </div>
    </div>
  </main>;
}
