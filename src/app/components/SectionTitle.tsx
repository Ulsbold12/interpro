import type { ReactNode } from "react";
export function SectionTitle({ children, description, eyebrow, id }: { children: ReactNode; description?: string; eyebrow?: string; id?: string }) {
  return <div className="section-title">{eyebrow && <span className="eyebrow">{eyebrow}</span>}<div className="section-title-row"><h2 id={id}>{children}</h2>{description && <p>{description}</p>}</div></div>;
}
