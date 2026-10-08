"use client";

import { Reveal } from "@/components/Reveal";
import { HorizontalMarquee } from "@/components/HorizontalMarquee";
import { BrandIcon } from "@/components/BrandIcon";
import { skills, type Skill } from "@/data/skills";

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <div className="flex w-56 items-center gap-3 rounded-control border border-ink/15 bg-paper px-4 py-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-control bg-ink/5 text-ink">
        {skill.brandIcon ? (
          <BrandIcon icon={skill.brandIcon} className="h-4 w-4" />
        ) : skill.fallbackIcon ? (
          <skill.fallbackIcon size={16} strokeWidth={1.75} />
        ) : null}
      </span>
      <span className="truncate text-sm font-medium text-ink">{skill.name}</span>
    </div>
  );
}

export function Skills() {
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
