import Image from "next/image";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { ContactButton } from "./ContactProvider";

const shots = [
  { src: "/b81401a3-25d8-4e76-944f-cee57cc53de3.jpeg", alt: "Арга хэмжээний танхимд суурилуулсан синхрон орчуулгын кабин", className: "project-shot-main" },
  { src: "/2a6e1e56-c90c-4bcc-bba3-d16f5478dc6f.jpeg", alt: "Орчуулгын кабин доторх миксер, микрофон болон чихэвч", className: "" },
  { src: "/fc8ff681-271a-48e1-b495-ea9f4d95a674.jpeg", alt: "Оролцогчдод бэлтгэсэн синхрон орчуулгын хүлээн авагчид", className: "" },
];

export function ProjectShowcase() {
  return <section className="section projects-section" id="projects">
    <div className="container projects-grid">
      <div className="projects-copy">
        <span className="eyebrow">БОДИТ АЖИЛ · БОДИТ ШИЙДЭЛ</span>
        <h2>Үг бүрийг<br />хүн бүрд.</h2>
        <p>Олон улсын хурал, форумын синхрон орчуулгын шийдлийг кабин, микрофон, хүлээн авагч, техникийн хяналттай нь цогцоор суурилуулна.</p>
        <div className="project-facts">
          <span><CheckCircle2 size={17} /> Дуу тусгаарлах кабин</span>
          <span><CheckCircle2 size={17} /> Утасгүй хүлээн авагч</span>
          <span><CheckCircle2 size={17} /> Инженерийн бүрэн хяналт</span>
        </div>
        <ContactButton subject="Синхрон орчуулгын иж бүрэн шийдэл" className="text-button project-cta">Ижил шийдэл лавлах <ArrowUpRight size={18} /></ContactButton>
      </div>
      <div className="project-gallery">
        {shots.map((shot, index) => <figure className={shot.className} key={shot.src}>
          <Image src={shot.src} alt={shot.alt} fill sizes={index === 0 ? "(max-width: 760px) 100vw, 32vw" : "(max-width: 760px) 50vw, 18vw"} />
          {index === 0 && <figcaption><span>INTERPRETATION</span><strong>Conference setup</strong></figcaption>}
        </figure>)}
      </div>
    </div>
  </section>;
}
