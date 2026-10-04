import Image from "next/image";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { SectionTitle } from "./SectionTitle";

const team = [
  { name: "Amgalan", image: "/inter1.jpeg", email: "Amgalan@interpro.mn", phone: "88012121" },
  { name: "Anand", image: "/inter2.jpeg", email: "Anand@interpro.mn", phone: "88111352" },
  { name: "Onon", image: "/inter3.jpeg", email: "Onon@interpro.mn", phone: "94040752" },
];

export function TeamSection() {
  return (
    <section className="section team-section" id="solutions" aria-labelledby="team-heading">
      <div className="container">
        <SectionTitle id="team-heading" description="Арга хэмжээнийхээ талаар ярилцъя. Манай багтай шууд холбогдоорой.">Манай баг, хамт олон</SectionTitle>
        <div className="team-grid">
          {team.map((member) => (
            <article className="team-card" key={member.email}>
              <div className="team-portrait">
                <Image
                  src={member.image}
                  alt={`${member.name} — INTERPRO багийн гишүүн`}
                  fill
                  sizes="(max-width: 760px) calc(100vw - 44px), (max-width: 1240px) 33vw, 379px"
                />
              </div>
              <div className="team-info">
                <h3>{member.name}</h3>
                <p className="team-role">Chief Operating Officer</p>
                <div className="team-contacts">
                  <a href={`mailto:${member.email}`}>
                    <Mail size={17} aria-hidden="true" />
                    <span>{member.email}</span>
                    <ArrowUpRight size={15} className="team-link-arrow" aria-hidden="true" />
                  </a>
                  <a href={`tel:+976${member.phone}`}>
                    <Phone size={17} aria-hidden="true" />
                    <span>Tel : {member.phone}</span>
                    <ArrowUpRight size={15} className="team-link-arrow" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
