type PlaceholderProps = {
  label: string;
  className?: string;
  variant?: "photo" | "tile";
};

/**
 * Stand-in for real photography/screenshots until assets are supplied.
 * Styled deliberately (not a broken-image look) so it reads as intentional.
 */
export function Placeholder({ label, className = "", variant = "photo" }: PlaceholderProps) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-ink ${className}`}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(250,247,243,0.08) 0px, rgba(250,247,243,0.08) 1px, transparent 1px, transparent 14px)",
        }}
      />
      <span
        className={`relative font-sans font-semibold uppercase tracking-wide text-paper/50 ${
          variant === "photo" ? "text-xs" : "text-sm"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
