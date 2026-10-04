import Image from "next/image";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { ContactButton } from "./ContactProvider";

const shots = [
  { src: "/b81401a3-25d8-4e76-944f-cee57cc53de3.jpeg", alt: "Арга хэмжээний танхимд суурилуулсан синхрон орчуулгын кабин", className: "project-shot-main" },
  { src: "/1fcbab5a-2370-4281-a047-dd1592705445.jpeg", alt: "Хурлын танхим руу харсан орчуулгын бүхээгийн доторх суурилуулалт", className: "" },
  { src: "/fc8ff681-271a-48e1-b495-ea9f4d95a674.jpeg", alt: "Оролцогчдод бэлтгэсэн синхрон орчуулгын хүлээн авагчид", className: "" },
];

export function ProjectShowcase() {
  return <section className="section projects-section" id="projects">
    <div className="container projects-grid">
      <div className="projects-copy">
        <span className="eyebrow">БИДНИЙ АЖЛААС</span>
        <h2>Орчуулгын системийн<br />суурилуулалт.</h2>
        <p>Орчуулгын бүхээг, микрофон, хүлээн авагч, чихэвчийг танхимын зохион байгуулалтад тохируулан суурилуулна. Арга хэмжээ эхлэхээс өмнө хэлний суваг, дууны холболт, төхөөрөмжүүдийн ажиллагааг шалгана.</p>
        <div className="project-facts">
          <span><CheckCircle2 size={17} /> Дуу тусгаарлах кабин</span>
          <span><CheckCircle2 size={17} /> Утасгүй хүлээн авагч</span>
          <span><CheckCircle2 size={17} /> Арга хэмжээний үеийн техникийн дэмжлэг</span>
        </div>
        <ContactButton subject="Синхрон орчуулгын тоног төхөөрөмж, суурилуулалт" className="text-button project-cta">Суурилуулалтын талаар лавлах <ArrowUpRight size={18} /></ContactButton>
      </div>
      <div className="project-gallery">
        {shots.map((shot, index) => <figure className={shot.className} key={shot.src}>
          <Image src={shot.src} alt={shot.alt} fill sizes={index === 0 ? "(max-width: 760px) 100vw, 32vw" : "(max-width: 760px) 50vw, 18vw"} />
          {index === 0 && <figcaption><span>СИНХРОН ОРЧУУЛГА</span><strong>Хурлын танхимын суурилуулалт</strong></figcaption>}
        </figure>)}
      </div>
    </div>
  </section>;
}
