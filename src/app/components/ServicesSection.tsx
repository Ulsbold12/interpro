"use client";
import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ArrowRight, Headphones, Mic, Wrench } from "lucide-react";
import { ContactButton } from "./ContactProvider";
import { SectionTitle } from "./SectionTitle";
const services = [
  { icon: Headphones, title: "Синхрон орчуулга", subtitle: "Нэг танхим. Олон хэлний оролцоо.", image: "/b81401a3-25d8-4e76-944f-cee57cc53de3.jpeg", alt: "Танхимд суурилуулсан орчуулгын бүхээг",
    text: "Ашиглах хэл, оролцогчдын тоо, танхимын зохион байгуулалтад тохируулан орчуулгын системийг бүрдүүлнэ.",
    items: ["Орчуулгын хүлээн авагч төхөөрөмж", "Чихэвч, receiver систем", "Дамжуулагч төхөөрөмж", "Interpreter console", "Interpreter microphone", "Орчуулгын бүхээг", "Олон сувгийн орчуулгын систем", "Холболтын болон нэмэлт тоноглол"] },
  { icon: Mic, title: "Хурлын аудио", subtitle: "Үг бүр тод сонсогдох ёстой.", image: "/2a6e1e56-c90c-4bcc-bba3-d16f5478dc6f.jpeg", alt: "Микрофон, чихэвч болон аудио миксерийн холболт",
    text: "Илтгэл, хэлэлцүүлэг, орчуулгын дууны холболтод шаардлагатай микрофон, аудио төхөөрөмжийг санал болгоно.",
    items: ["Микрофон систем", "Утасгүй микрофон", "Ширээний микрофон", "Podium microphone", "Аудио систем", "Mixer болон холбогдох тоног төхөөрөмж"] },
  { icon: Wrench, title: "Техникийн үйлчилгээ", subtitle: "Бэлтгэлээс сүүлийн мөч хүртэл.", image: "/1fcbab5a-2370-4281-a047-dd1592705445.jpeg", alt: "Орчуулгын бүхээг доторх техникийн суурилуулалт",
    text: "Техникийн шаардлагыг урьдчилан тодорхойлж, төхөөрөмжийг хүргэхээс буцаан хураах хүртэлх ажлыг хариуцна.",
    items: ["Хэрэгцээ, техникийн шаардлагыг тодорхойлох", "Тоног төхөөрөмжийн хүргэлт", "Суурилуулалт, системийн холболт", "Туршилт, урьдчилсан тохиргоо", "Арга хэмжээний үеийн техникийн дэмжлэг", "Тоног төхөөрөмжийг буцаан хураах"] },
];
export function ServicesSection() {
  const [selected, setSelected] = useState(0);
  const service = services[selected];
  return <section className="section services-section" id="services"><div className="container">
    <SectionTitle eyebrow="01 / БИДНИЙ ҮЙЛЧИЛГЭЭ" description="Төхөөрөмжөөс гадна түүнийг зөв ажиллуулах баг. Танд хэрэгтэй үйлчилгээг хамт төлөвлөнө.">Дуу, хэл, техник.<br />Бүгд нэг дор.</SectionTitle>
    <div className="service-selector">{services.map((item, index) => <button key={item.title} aria-pressed={selected === index} aria-controls="service-detail" onClick={() => setSelected(index)} className={selected === index ? "service-option selected" : "service-option"}><span className="service-number">0{index + 1}</span><item.icon size={22} strokeWidth={1.5} /><span>{item.title}</span><ArrowRight className="service-option-arrow" size={21} /></button>)}</div>
    <div className="service-detail" id="service-detail" aria-live="polite"><div className="service-photo"><Image src={service.image} alt={service.alt} fill sizes="(max-width: 760px) 100vw, 40vw" /><span>INTERPRO / ҮЙЛЧИЛГЭЭ</span></div><div className="service-copy" key={service.title}><span className="eyebrow">0{selected + 1} / {service.title}</span><h3>{service.subtitle}</h3><p>{service.text}</p><ul>{service.items.map(item => <li key={item}>{item}</li>)}</ul><ContactButton subject={service.title} className="text-button">Энэ үйлчилгээг лавлах <ArrowUpRight size={18} /></ContactButton></div></div>
    <div className="service-process"><span>БИД ХЭРХЭН АЖИЛЛАДАГ ВЭ</span><ol>{["Хэрэгцээгээ ярилцах", "Тохирох системээ сонгох", "Суурилуулах, турших", "Арга хэмжээг дэмжих"].map((step, index) => <li key={step}><span>0{index + 1}</span>{step}</li>)}</ol></div>
  </div></section>;
}
