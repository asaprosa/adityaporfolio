import { BrandIcon } from "@/components/BrandIcon";
import type { Skill } from "@/data/skills";

export function SkillCard({ skill }: { skill: Skill }) {
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
