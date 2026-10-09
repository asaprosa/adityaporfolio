// Static labels: they are not links, so they carry no hover treatment.
export function TechStackTags({ tech }: { tech: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {tech.map((t) => (
        <span key={t} className="rounded-control border border-ink/15 px-3 py-1.5 text-sm text-ink">
          {t}
        </span>
      ))}
    </div>
  );
}
