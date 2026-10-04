import { ArrowRight } from "lucide-react";
import { ContactButton } from "./ContactProvider";
import { SectionTitle } from "./SectionTitle";

const events = ["Олон улсын хурал, форум", "Бизнес уулзалт", "Семинар, сургалт", "Төрийн болон байгууллагын хурал", "Олон улсын төсөл, хөтөлбөрийн арга хэмжээ", "Үзэсгэлэн, танилцуулга", "Хэлэлцүүлэг, панел", "Hybrid болон олон хэлний арга хэмжээ"];
export function SolutionsSection() {
  return <section className="section event-solutions" id="event-solutions"><div className="container">
    <SectionTitle>Бидний шийдэл</SectionTitle>
    <div className="event-solutions-layout"><div className="event-solutions-copy"><h3>Бизнес уулзалтаас<br />олон улсын форум хүртэл.</h3><p>Жижиг уулзалт болон олон зуун оролцогчтой хуралд шаардагдах тоног төхөөрөмж өөр. Оролцогчдын тоо, хэлний сувгийн тоо, танхимын хэмжээ, арга хэмжээний форматаар нь хэрэгцээг тооцож, түрээсийн шийдлээ санал болгоно.</p><ContactButton subject="Арга хэмжээний техникийн шийдэл" className="text-button">Арга хэмжээнийхээ талаар ярилцах <ArrowRight size={17} /></ContactButton></div><div className="event-types"><span className="eyebrow">ҮЙЛЧИЛГЭЭ ҮЗҮҮЛЭХ АРГА ХЭМЖЭЭ</span><ul>{events.map(event => <li key={event}>{event}</li>)}</ul></div></div>
  </div></section>;
}
