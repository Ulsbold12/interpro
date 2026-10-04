import type { ReactNode } from "react";
function Waveform() {
  return <span className="heading-wave" aria-hidden="true">{Array.from({ length: 33 }, (_, index) => <i key={index} style={{ height: `${5 + ((index * 13 + index * index) % 32)}px` }} />)}</span>;
}
export function SectionTitle({ children, description, eyebrow, id }: { children: ReactNode; description?: string; eyebrow?: string; id?: string }) {
  return <div className="section-title">{eyebrow && <span className="eyebrow">{eyebrow}</span>}<div className="section-title-row"><Waveform /><h2 id={id}>{children}</h2><Waveform /></div>{description && <p>{description}</p>}</div>;
}
