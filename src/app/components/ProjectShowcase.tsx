import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { ContactButton } from "./ContactProvider";
import { SectionTitle } from "./SectionTitle";
import ScrollExpand from "./ScrollExpand";
const shots = [
  { src: "/b38155c1-f35f-4e60-9287-21756ae7fe0b.jpeg", alt: "Хурлын танхимд суурилуулсан орчуулгын бүхээг", label: "01 / Танхимын суурилуулалт" },
  { src: "/1fcbab5a-2370-4281-a047-dd1592705445.jpeg", alt: "Танхим руу харсан орчуулгын бүхээгийн доторх суурилуулалт", label: "02 / Орчуулагчийн ажлын орчин" },
  { src: "/fc8ff681-271a-48e1-b495-ea9f4d95a674.jpeg", alt: "Оролцогчдод бэлтгэсэн синхрон орчуулгын хүлээн авагчид", label: "03 / Оролцогчдын төхөөрөмж" },
];
export function ProjectShowcase() {
  return <section className="section projects-section" id="projects"><div className="container">
    <SectionTitle eyebrow="02 / БИДНИЙ АЖЛААС" description="Танхимын зохион байгуулалтаас төхөөрөмжийн сүүлийн холболт хүртэл. Манай багийн бодит суурилуулалтууд.">Танхим бэлэн.<br />Харилцаа эхэлнэ.</SectionTitle>
    </div><ScrollExpand className="project-expand" src="/b81401a3-25d8-4e76-944f-cee57cc53de3.jpeg" alt="INTERPRO-ийн танхимд суурилуулсан орчуулгын бүхээг" title="Орчуулгын бүхээгээс танхим хүртэл." scrollHint="ДООШ ГҮЙЛГЭЖ ҮЗЭЭРЭЙ" startWidth={62} startHeight={68} startRadius={18} mediaZoom={1.12} scrollDistance={0.7} holdDistance={0.12} overlayScrim={0.8} useWindowScroll><span>INTERPRO / СИНХРОН ОРЧУУЛГА</span><h3>Оролцогч бүрт хүрэх<br />техникийн шийдэл.</h3><p>Орчуулгын бүхээг, микрофон, хүлээн авагчийн холболтыг танхимын зохион байгуулалтад тохируулан суурилуулна.</p><ContactButton subject="Орчуулгын бүхээг, суурилуулалт" className="button button-blue">Суурилуулалтын талаар ярилцах <ArrowUpRight size={17} /></ContactButton></ScrollExpand><div className="container project-after-expand">
    <div className="project-gallery">{shots.map((shot, index) => <figure key={shot.src}><div className="project-image"><Image src={shot.src} alt={shot.alt} fill sizes={index === 0 ? "(max-width: 760px) 100vw, 45vw" : "(max-width: 760px) 50vw, 25vw"} /></div><figcaption>{shot.label}<ArrowUpRight size={17} aria-hidden="true" /></figcaption></figure>)}</div>
    <div className="project-caption"><p>Арга хэмжээ эхлэхээс өмнө хэлний суваг, дууны холболт, төхөөрөмжүүдийн ажиллагааг шалгана.</p><ContactButton subject="Синхрон орчуулгын тоног төхөөрөмж, суурилуулалт" className="text-button">Суурилуулалтын талаар ярилцах <ArrowUpRight size={18} /></ContactButton></div>
  </div></section>;
}
