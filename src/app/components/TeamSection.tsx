"use client";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import ProfileCard from "./ProfileCard";
import { useContact } from "./ContactProvider";
import { SectionTitle } from "./SectionTitle";

const team = [
  { name: "Amgalan", image: "/inter1.jpeg", email: "Amgalan@interpro.mn", phone: "88012121" },
  { name: "Anand", image: "/inter2.jpeg", email: "Anand@interpro.mn", phone: "88111352" },
  { name: "Onon", image: "/inter3.jpeg", email: "Onon@interpro.mn", phone: "94040752" },
];
export function TeamSection() {
  const contact = useContact();
  return <section className="section team-section" id="solutions" aria-labelledby="team-heading"><div className="container">
    <SectionTitle eyebrow="05 / INTERPRO" id="team-heading" description="Арга хэмжээнийхээ талаар ярилцъя. Манай багтай шууд холбогдоорой.">Манай баг, хамт олон</SectionTitle>
    <div className="team-grid">{team.map(member => <article className="team-card" key={member.email}>
      <ProfileCard name={member.name} title="Chief Operating Officer" avatarUrl={member.image} handle={member.phone} status="INTERPRO" contactText="Холбогдох" showUserInfo enableTilt enableMobileTilt={false} behindGlowEnabled innerGradient="linear-gradient(145deg,#555861 0%,#191a1e 75%)" behindGlowColor="rgba(185,190,205,0.3)" onContactClick={() => contact(`${member.name}-тай холбогдох`)} />
      <div className="team-contacts"><a href={`mailto:${member.email}`}><Mail size={17} aria-hidden="true" /><span>{member.email}</span><ArrowUpRight size={15} className="team-link-arrow" aria-hidden="true" /></a><a href={`tel:+976${member.phone}`}><Phone size={17} aria-hidden="true" /><span>{member.phone}</span><ArrowUpRight size={15} className="team-link-arrow" aria-hidden="true" /></a></div>
    </article>)}</div>
  </div></section>;
}
