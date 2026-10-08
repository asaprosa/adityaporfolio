import { Reveal } from "@/components/Reveal";
import { achievements, education, experience } from "@/data/experience";

export function Experience() {
  return (
    <section id="experience" className="px-6 py-28 md:px-10">
      <div className="mx-auto max-w-content">
        <Reveal>
          <h2 className="grain-text text-6xl font-semibold tracking-tightest2 sm:text-7xl">
            Experience
          </h2>
        </Reveal>

        <div className="mt-16 border-t border-ink/15">
          {experience.map((role, i) => (
            <Reveal key={`${role.title}-${role.period}`} delay={i * 0.08}>
              <div className="flex flex-col gap-4 border-b border-ink/15 py-8 sm:flex-row sm:gap-10">
                <div className="sm:w-64 sm:shrink-0">
                  <h3 className="text-xl font-semibold text-ink">{role.title}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {role.company} · {role.location}
                  </p>
                  <p className="mt-1 text-sm text-muted">{role.period}</p>
                </div>
                <ul className="flex-1 space-y-2.5">
                  {role.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink/40" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}

          <Reveal delay={0.16}>
            <div className="flex flex-col gap-4 border-b border-ink/15 py-8 sm:flex-row sm:gap-10">
              <div className="sm:w-64 sm:shrink-0">
                <h3 className="text-xl font-semibold text-ink">Education</h3>
                <p className="mt-1 text-sm text-muted">{education.period}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm leading-relaxed text-muted">{education.degree}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {education.school} · {education.detail}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="flex flex-col gap-4 py-8 sm:flex-row sm:gap-10">
              <div className="sm:w-64 sm:shrink-0">
                <h3 className="text-xl font-semibold text-ink">Achievements</h3>
              </div>
              <ul className="flex-1 space-y-3">
                {achievements.map((a) => (
                  <li key={a.label} className="text-sm leading-relaxed text-muted">
                    <span className="font-medium text-ink">{a.label}: </span>
                    {a.detail}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
