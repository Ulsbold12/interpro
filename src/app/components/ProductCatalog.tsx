"use client";
import { useState } from "react";
import { ArrowUpRight, PackageSearch, Search } from "lucide-react";
import { CATEGORIES, FEATURED_PRODUCTS, PRODUCT_CATEGORY_IDS } from "@/data/equipmentData";
import { ContactButton } from "./ContactProvider";
import { SectionTitle } from "./SectionTitle";

export function ProductCatalog() {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const products = FEATURED_PRODUCTS.filter(product => (category === "all" || PRODUCT_CATEGORY_IDS[product.category] === category) && `${product.name} ${product.brand} ${product.description}`.toLowerCase().includes(query.trim().toLowerCase()));
  const selectedCategory = CATEGORIES.find(item => item.id === category);
  const filters = [{ id: "all", name: "Бүгд" }, ...CATEGORIES];

  return <section className="section catalog-section" id="equipment"><div className="container">
    <SectionTitle eyebrow="03 / ТОНОГ ТӨХӨӨРӨМЖ" description="Сонирхсон төхөөрөмжөө сонгоод хэрэгцээгээ бидэнд хэлээрэй. Арга хэмжээнд тань тохирсон саналыг бэлтгэнэ.">Зөв төхөөрөмж.<br />Тод дуугаралт.</SectionTitle>
    <div className="catalog-toolbar"><div className="filter-list" aria-label="Төхөөрөмжийн ангилал">{filters.map(item => <button key={item.id} onClick={() => setCategory(item.id)} aria-pressed={category === item.id} className={category === item.id ? "filter active" : "filter"}>{item.name}</button>)}</div><label className="catalog-search"><Search size={17} /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Төхөөрөмж хайх…" aria-label="Төхөөрөмж хайх" /></label></div>
    <div className="catalog-results" aria-live="polite"><span>{selectedCategory ? selectedCategory.name : "Бүх төхөөрөмж"}</span><span>{products.length} төхөөрөмж</span></div>
    <div className="product-grid">{products.map(product => <article className="product-card" key={product.id}>
      <div className="product-visual product-photo-visual">
        {failedImages[product.id] ? <div className="product-image-fallback"><PackageSearch size={45} strokeWidth={1} /><span>{product.brand}</span></div> : <img src={product.image} alt={product.name} width={600} height={400} loading="lazy" className="product-photo" onError={() => setFailedImages(previous => ({ ...previous, [product.id]: true }))} />}
      </div>
      <div className="product-content"><span className="product-category">{product.category}</span><h3>{product.name}</h3><p className="product-description">{product.description}</p><div className="product-bottom"><ContactButton subject={product.name} className="text-button">Энэ төхөөрөмжийг сонирхож байна <ArrowUpRight size={18} /></ContactButton></div></div>
    </article>)}</div>
    {products.length === 0 && <div className="catalog-empty"><PackageSearch size={36} strokeWidth={1.2} /><h3>{query ? "Төхөөрөмж олдсонгүй" : "Энэ ангиллын төхөөрөмжийг лавлаарай"}</h3><p>{query ? "Өөр нэрээр хайх эсвэл хэрэгтэй төхөөрөмжөө биднээс лавлаарай." : "Танд хэрэгтэй төхөөрөмжийн талаар манай багтай холбогдоорой."}</p><ContactButton subject={query || selectedCategory?.name}>Боломжит төхөөрөмж лавлах <ArrowUpRight size={18} /></ContactButton></div>}
    <p className="catalog-note">Түрээсийн огнооны боломжит үлдэгдэл, хүргэлт, суурилуулалтын үнийг холбогдон баталгаажуулна уу.</p>
  </div></section>;
}
