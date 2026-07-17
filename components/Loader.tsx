interface LoaderProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  fullScreen?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: 28,
  md: 48,
  lg: 72,
};


export default function Loader({
  size = "md",
  label,
  fullScreen = false,
  className = "",
}: LoaderProps) {
  const px = SIZE_MAP[size];

  const spinner = (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 48 48"
        className="reel-spinner"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="reelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E3A857" />
            <stop offset="100%" stopColor="#F5C518" />
          </linearGradient>
        </defs>

        {/* outer reel rim */}
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="url(#reelGradient)"
          strokeWidth="2"
          strokeOpacity="0.25"
        />

        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="url(#reelGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="30 96"
          className="reel-arc"
        />

        <g className="reel-holes">
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i * 360) / 6;
            return (
              <rect
                key={i}
                x="21.5"
                y="6"
                width="5"
                height="7"
                rx="1.5"
                fill="#E3A857"
                transform={`rotate(${angle} 24 24)`}
              />
            );
          })}
        </g>

        <circle cx="24" cy="24" r="4.5" fill="#E3A857" />
        <circle cx="24" cy="24" r="1.6" fill="#0B0F1A" />
      </svg>

      {label ? (
        <p className="text-sm font-medium text-[var(--text-secondary)] tracking-wide">
          {label}
        </p>
      ) : (
        <span className="sr-only">Loading…</span>
      )}
    </div>
  );

  if (!fullScreen) return spinner;

  return (
    <div className="flex items-center justify-center min-h-[50vh] w-full py-16">
      {spinner}
    </div>
  );
}
