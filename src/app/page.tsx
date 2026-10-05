import { ArrowUpRight, AudioLines, Mail, Phone } from "lucide-react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ServicesSection } from "./components/ServicesSection";
import { ProjectShowcase } from "./components/ProjectShowcase";
import { ProductCatalog } from "./components/ProductCatalog";
import { TeamSection } from "./components/TeamSection";
import { ContactButton, ContactProvider } from "./components/ContactProvider";
import { ContactSection } from "./components/ContactSection";
import { AboutSection } from "./components/AboutSection";
import { SolutionsSection } from "./components/SolutionsSection";
import { WhyUsSection } from "./components/WhyUsSection";
const faqs = [
  ["Төхөөрөмжийн үнийн санал хэрхэн авах вэ?", "Сонирхсон төхөөрөмжийнхөө “Энэ төхөөрөмжийг сонирхож байна” товчийг дараарай. Барааны нэр маягтад автоматаар орно. Холбоо барих мэдээлэл, хэрэгцээгээ оруулаад хүсэлтээ илгээхэд манай баг эргэн холбогдоно."],
  ["Түрээсийн үнэ хэрхэн тооцогдох вэ?", "Төхөөрөмжийн төрөл, тоо ширхэг, ашиглах хугацаа, байршил болон инженерийн үйлчилгээ шаардлагатай эсэхээс хамаарч үнийн санал гаргана."],
  ["Хүргэлт, суурилуулалт хийдэг үү?", "Хүргэлт, суурилуулалт болон арга хэмжээний өмнөх техникийн тестийг хэрэгцээнд тань тохируулж төлөвлөнө. Байршил, орох цаг, заалны нөхцөлөө урьдчилан хэлээрэй."],
  ["Ямар төхөөрөмж хэрэгтэйгээ мэдэхгүй байвал яах вэ?", "Арга хэмжээний төрөл, оролцогчдын тоо, ашиглах хэл, танхимын хэмжээ болон хөтөлбөрөө бидэнд хэлэхэд болно. Шаардлагатай орчуулгын систем, аудио төхөөрөмжийг хамт сонгоно."],
];
export default function HomePage() {
  return <ContactProvider><div className="public-site"><a className="skip-link" href="#equipment">Үндсэн агуулга руу</a><Header /><main>
    <Hero /><ServicesSection /><ProjectShowcase /><ProductCatalog />
    <AboutSection /><SolutionsSection /><WhyUsSection /><TeamSection />
    <section className="section faq-section" id="faq"><div className="container faq-grid"><div><span className="eyebrow">ТАНД ХЭРЭГТЭЙ МЭДЭЭЛЭЛ</span><h2>Түгээмэл асуултууд</h2><p>Арга хэмжээгээ төлөвлөхөд тань туслах хариултууд.</p><ContactButton className="text-button">Өөр асуулт асуух <ArrowUpRight size={17} /></ContactButton></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span className="faq-plus" aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></div></section>
    <ContactSection />
  </main><footer className="site-footer"><div className="container"><div className="footer-main"><div className="footer-brand"><a href="#home" className="footer-wordmark"><AudioLines size={33} strokeWidth={1.5} />INTERPRO</a><span>Синхрон орчуулга · Хурлын аудио · Техникийн үйлчилгээ</span><p>Олон хэлний арга хэмжээний тоног төхөөрөмжийн түрээс, техникийн үйлчилгээ.</p></div><div><h3>Шийдлүүд</h3><nav aria-label="Үйлчилгээний цэс"><a href="#services">Хурлын аудио тоног төхөөрөмж</a><a href="#projects">Синхрон орчуулга</a><a href="#equipment">Тоног төхөөрөмж</a><a href="#event-solutions">Арга хэмжээний шийдэл</a></nav></div><div><h3>INTERPRO</h3><nav aria-label="Хөл хэсгийн цэс"><a href="#about">Бидний тухай</a><a href="#solutions">Манай баг, хамт олон</a><a href="#faq">Түгээмэл асуулт</a><a href="#contact">Холбоо барих</a></nav></div><div className="footer-contact"><h3>Холбоо барих</h3><a href="mailto:Pagmasuren@interpro.mn"><Mail size={16} />Pagmasuren@interpro.mn</a><a href="tel:+97680051655"><Phone size={16} />8005 1655</a><p>Улаанбаатар, Монгол</p></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} INTERPRO. Бүх эрх хуулиар хамгаалагдсан.</span><a href="#home">Дээш буцах ↑</a></div></div></footer></div></ContactProvider>;
}
