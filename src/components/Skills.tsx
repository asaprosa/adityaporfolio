"use client";

import { Reveal } from "@/components/Reveal";
import { HorizontalMarquee } from "@/components/HorizontalMarquee";
import { SkillCard } from "@/components/SkillCard";
import { HorizontalSkills } from "@/components/effects/HorizontalSkillsEffect";
import { effects } from "@/config/effects";
import { skills } from "@/data/skills";

export function Skills() {
  if (effects.horizontalSkills) return <HorizontalSkills />;

  return (
    <section id="skills" className="px-6 py-28 md:px-10">
      <div className="mx-auto max-w-content">
        <Reveal>
          <h2 className="grain-text text-6xl font-semibold tracking-tightest2 sm:text-7xl">Skills</h2>
        </Reveal>

        <Reveal delay={0.1}>
          <HorizontalMarquee
            items={skills}
            rows={2}
            speed={26}
            gap={14}
            blurSize={80}
            className="mt-14"
            getKey={(skill, copyIndex) => `${skill.name}-${copyIndex}`}
            renderItem={(skill) => <SkillCard skill={skill} />}
          />
        </Reveal>
      </div>
    </section>
  );
}
