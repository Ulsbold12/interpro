import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { InquiryForm } from "./InquiryForm";
import { SectionTitle } from "./SectionTitle";
export function ContactSection() {
  return <section className="section contact-section" id="contact"><div className="container">
    <SectionTitle>Бидэнтэй холбогдоорой.</SectionTitle>
    <div className="contact-layout"><div className="contact-copy"><span className="eyebrow">БИДНИЙ АМЛАЛТ</span><h3>Олон хэлний харилцааг<br />тасалдалгүй хүргэх.</h3><p>Арга хэмжээний төрөл, ашиглах хэл, оролцогчдын тоогоо хэлээрэй. Шаардлагатай тоног төхөөрөмж, техникийн үйлчилгээг хамт төлөвлөе.</p><div className="contact-direct"><a href="mailto:Pagmasuren@interpro.mn"><Mail size={19} /><span><small>Имэйлээр холбогдох</small>Pagmasuren@interpro.mn</span><ArrowUpRight size={17} /></a><a href="tel:+97680051655"><Phone size={19} /><span><small>Шууд залгах</small>8005 1655</span><ArrowUpRight size={17} /></a></div></div><div className="contact-form-card"><InquiryForm /></div></div>
  </div></section>;
}
