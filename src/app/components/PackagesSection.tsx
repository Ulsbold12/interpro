import { ArrowUpRight, Check } from "lucide-react";
import { PACKAGES } from "@/data/equipmentData";
import { ContactButton } from "./ContactProvider";
export function PackagesSection() {
  return <section className="section solutions-section" id="solutions"><div className="container"><div className="section-heading"><div><span className="eyebrow">02 / SOLUTIONS</span><h2>Нэг эвент. Нэгдсэн шийдэл.</h2></div><p>Төхөөрөмж бүрийг тусад нь бодох хэрэггүй.<br className="desktop-break" /> Хэрэгцээнд тань тааруулж хамтад нь төлөвлөе.</p></div>
    <div className="packages-grid">{PACKAGES.map(pkg => <article className={`package-card ${pkg.isPopular ? "featured" : ""}`} key={pkg.id}>
      <div className="package-top"><span>{pkg.packageNum}</span>{pkg.isPopular && <span className="package-badge">ХАМГИЙН ЭРЭЛТТЭЙ</span>}</div>
      <h3>{pkg.name}</h3><p>{pkg.targetSize}</p><ul>{pkg.features.map(item => <li key={item}><Check size={17} />{item}</li>)}</ul>
      <div className="package-footer"><div className="package-price"><strong>{pkg.price}</strong><span>{pkg.pricePer}</span></div><ContactButton subject={`${pkg.packageNum} — ${pkg.name}`} className={`button ${pkg.isPopular ? "button-lime" : "button-border"}`}>{pkg.price.includes("Үнийн") ? "Үнийн санал авах" : "Багц лавлах"} <ArrowUpRight size={18} /></ContactButton></div>
    </article>)}</div>
  </div></section>;
}
