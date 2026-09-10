"use client";
import { useState } from "react";
import { ArrowUpRight, PackageSearch } from "lucide-react";
import { CATEGORIES, FEATURED_PRODUCTS, PRODUCT_CATEGORY_IDS } from "@/data/equipmentData";
import { ContactButton } from "./ContactProvider";

export function ProductCatalog() {
  const [category, setCategory] = useState("all");
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const products = FEATURED_PRODUCTS.filter(product => category === "all" || PRODUCT_CATEGORY_IDS[product.category] === category);
  const selectedCategory = CATEGORIES.find(item => item.id === category);
  const filters = [{ id: "all", name: "Бүгд" }, ...CATEGORIES];

  return <section className="section catalog-section" id="equipment"><div className="container">
    <div className="section-heading"><div><span className="eyebrow">01 / EQUIPMENT</span><h2>Зөв төхөөрөмж.<br className="mobile-break" /> Төгс зохицол.</h2></div><p>Таны арга хэмжээний хэмжээ, онцлогт<br className="desktop-break" /> тохирох техникийн шийдлийг сонгоё.</p></div>
    <div className="catalog-toolbar"><div className="filter-list" aria-label="Төхөөрөмжийн ангилал">{filters.map(item => <button key={item.id} onClick={() => setCategory(item.id)} aria-pressed={category === item.id} className={category === item.id ? "filter active" : "filter"}>{item.name}</button>)}</div></div>
    <div className="catalog-results" aria-live="polite"><span>{selectedCategory ? `${selectedCategory.name} · ${selectedCategory.count}` : "Онцлох тоног төхөөрөмж"}</span><span>Энд {products.length} төхөөрөмж</span></div>
    <div className="product-grid">{products.map(product => <article className="product-card" key={product.id}>
      <div className="product-visual product-photo-visual">
        {failedImages[product.id] ? <div className="product-image-fallback"><PackageSearch size={45} strokeWidth={1} /><span>{product.brand}</span></div> : <img src={product.image} alt={product.name} width={600} height={400} loading="lazy" className="product-photo" onError={() => setFailedImages(previous => ({ ...previous, [product.id]: true }))} />}
        <span className="product-sku">{product.sku}</span><span className="stock-badge">Бэлэн: {product.stock} {product.stockUnit}</span>
      </div>
      <div className="product-content"><span className="product-brand">{product.brand}</span><h3>{product.name}</h3><p className="product-category">{product.category}</p><div className="product-tags">{product.specsSummary.map(spec => <span key={spec}>{spec}</span>)}</div><div className="product-bottom"><div className="product-price"><small>1 өдрийн түрээс</small><strong>{product.pricePerDay.toLocaleString("en-US")}₮</strong></div><ContactButton subject={`${product.name} (${product.sku})`} className="text-button">Лавлах <ArrowUpRight size={18} /></ContactButton></div></div>
    </article>)}</div>
    {products.length === 0 && <div className="catalog-empty"><PackageSearch size={36} strokeWidth={1.2} /><h3>Энэ ангиллын төхөөрөмжийг лавлаарай</h3><p>Энэ ангиллын бүтээгдэхүүний дэлгэрэнгүй мэдээлэл хараахан нэмэгдээгүй байна.</p><ContactButton subject={selectedCategory?.name}>Боломжит төхөөрөмж лавлах <ArrowUpRight size={18} /></ContactButton></div>}
    <p className="catalog-note">Түрээсийн огнооны боломжит үлдэгдэл, хүргэлт, суурилуулалтын үнийг холбогдон баталгаажуулна уу.</p>
  </div></section>;
}
