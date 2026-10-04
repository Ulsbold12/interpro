import { ArrowUpRight, Headphones, Mic, Wrench } from "lucide-react";
import { ContactButton } from "./ContactProvider";
import { SectionTitle } from "./SectionTitle";
const services = [
  {
    icon: Headphones, title: "Синхрон орчуулгын тоног төхөөрөмжийн түрээс",
    text: "Ашиглах хэл, оролцогчдын тоо, танхимын зохион байгуулалтад тохируулан орчуулгын системийг бүрдүүлнэ.",
    items: ["Орчуулгын хүлээн авагч төхөөрөмж", "Чихэвч, receiver систем", "Дамжуулагч төхөөрөмж", "Interpreter console", "Interpreter microphone", "Орчуулгын бүхээг", "Олон сувгийн орчуулгын систем", "Холболтын болон нэмэлт тоноглол"],
  },
  {
    icon: Mic, title: "Хурлын аудио тоног төхөөрөмж",
    text: "Илтгэл, хэлэлцүүлэг, орчуулгын дууны холболтод шаардлагатай микрофон, аудио төхөөрөмжийг санал болгоно.",
    items: ["Микрофон систем", "Утасгүй микрофон", "Ширээний микрофон", "Podium microphone", "Аудио систем", "Mixer болон холбогдох тоног төхөөрөмж"],
  },
  {
    icon: Wrench, title: "Техникийн үйлчилгээ",
    text: "Техникийн шаардлагыг урьдчилан тодорхойлж, төхөөрөмжийг хүргэхээс буцаан хураах хүртэлх ажлыг хариуцна.",
    items: ["Хэрэгцээ, техникийн шаардлагыг тодорхойлох", "Тоног төхөөрөмжийн хүргэлт", "Суурилуулалт, системийн холболт", "Туршилт, урьдчилсан тохиргоо", "Арга хэмжээний үеийн техникийн дэмжлэг", "Тоног төхөөрөмжийг буцаан хураах"],
  },
];
export function ServicesSection() {
  return <section className="section services-section" id="services"><div className="container">
    <SectionTitle>Бидний үйлчилгээ</SectionTitle>
    <div className="services-grid company-services-grid">{services.map(service => <article className="service-card company-service-card" key={service.title}>
      <div className="service-card-icon"><service.icon size={37} strokeWidth={1.3} /></div><h3>{service.title}</h3><p>{service.text}</p>
      <ul>{service.items.map(item => <li key={item}>{item}</li>)}</ul>
      <ContactButton subject={service.title} className="text-button">Үйлчилгээний талаар лавлах <ArrowUpRight size={16} /></ContactButton>
    </article>)}</div>
  </div></section>;
}
