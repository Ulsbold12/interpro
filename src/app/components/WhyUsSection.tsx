import { SectionTitle } from "./SectionTitle";

const reasons = [
  { title: "Найдвартай тоног төхөөрөмж", text: "Арга хэмжээ эхлэхээс өмнө системийн ажиллагааг шалгаж, шаардлагатай тохиргоог хийж бэлтгэнэ." },
  { title: "Тохирсон шийдэл", text: "Оролцогчдын тоо, хэлний суваг, танхимын хэмжээ, арга хэмжээний форматаас хамаарч тоног төхөөрөмжийг тооцоолно." },
  { title: "Мэргэжлийн техникийн дэмжлэг", text: "Суурилуулалтаас арга хэмжээ дуусах хүртэл системийн ажиллагаа, техникийн асуудлыг манай баг хариуцна." },
  { title: "Уян хатан үйлчилгээ", text: "Нэг удаагийн арга хэмжээ болон урт хугацааны хэрэгцээнд тохирсон түрээсийн шийдлийг санал болгоно." },
];
const values = [
  { title: "Найдвартай байдал", text: "Тоног төхөөрөмж, үйлчилгээг тохирсон хугацаанд, төлөвлөсөн стандартын дагуу хүргэнэ." },
  { title: "Чанар", text: "Тоног төхөөрөмж, техникийн шийдлийг арга хэмжээний бодит хэрэгцээнд нийцүүлэн сонгоно." },
  { title: "Хариуцлага", text: "Арга хэмжээний тасралтгүй ажиллагааг техникийн талаас нь дэмжинэ." },
  { title: "Мэргэжлийн үйлчилгээ", text: "Болзошгүй асуудлыг урьдчилан тооцож, тоног төхөөрөмж болон үйлчилгээг хамтад нь төлөвлөнө." },
];
export function WhyUsSection() {
  return <section className="section company-standards" id="why-interpro"><div className="container">
    <SectionTitle>Яагаад бид?</SectionTitle>
    <div className="company-reasons">{reasons.map((reason, index) => <article key={reason.title}><span aria-hidden="true">0{index + 1}</span><h3>{reason.title}</h3><p>{reason.text}</p></article>)}</div>
    <div className="company-values"><h3>Бидний үнэт зүйлс</h3><dl>{values.map(value => <div key={value.title}><dt>{value.title}</dt><dd>{value.text}</dd></div>)}</dl></div>
  </div></section>;
}
