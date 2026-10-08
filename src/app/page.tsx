import { Nav } from "@/components/Nav";
import { IntroSplash } from "@/components/IntroSplash";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { ScrollColorText } from "@/components/ScrollColorText";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ProfilePhoto } from "@/components/ProfilePhoto";
import { personal } from "@/data/personal";
import { CurtainEffect } from "@/components/effects/CurtainEffect";
import { effects } from "@/config/effects";

export default function Home() {
  return (
    <>
      {effects.curtain ? <CurtainEffect /> : <IntroSplash />}
      <Nav />
      <main className="relative">
        <Hero />
        <About />
        <ScrollColorText text={`${personal.manifestoLead} ${personal.manifesto}`} />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
        <ProfilePhoto />
      </main>
      <Footer />
    </>
  );
}
