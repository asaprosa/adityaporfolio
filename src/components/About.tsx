import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { personal } from "@/data/personal";
import { TextArrowButton } from "@/components/TextArrowButton";

export function About() {
  return (
    <section id="about" className="px-6 py-28 md:px-10">
      <div className="mx-auto grid max-w-content gap-10 md:grid-cols-[1fr_1.2fr_1fr] md:items-center">
        <Reveal>
          <h2 className="t-title">Hey!</h2>
          <p className="t-body mt-8 max-w-xs">
            I&apos;m {personal.name.split(" ")[0]}, a {personal.role} based in {personal.location}.
          </p>
        </Reveal>

        {/* Real photo is a single floating element (see ProfilePhoto) that morphs here from Hero's slot on scroll. */}
        <div id="about-photo-anchor" className="mx-auto aspect-[4/5] w-full max-w-sm" />

        <Reveal delay={0.2}>
          <p className="t-body">{personal.tagline}</p>
          <p className="t-body mt-5">
            I focus on building and scaling automated testing frameworks that hold up under real
            production traffic, not just demo conditions.
          </p>
          <TextArrowButton
            as="a"
            href="#contact"
            className="t-nav mt-6 text-ink"
          >
            Get in touch
          </TextArrowButton>
        </Reveal>
      </div>
    </section>
  );
}
