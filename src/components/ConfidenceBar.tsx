"use client";

interface ConfidenceBarProps {
  value: number; // 0–1
  label?: string;
  size?: "sm" | "md" | "lg";
  showPercent?: boolean;
}

const colorForValue = (v: number) => {
  if (v >= 0.75) return "#ef4444"; // red for high confidence fake
  if (v >= 0.5) return "#f59e0b"; // amber
  return "#10b981"; // green for low confidence (more real)
};

const fakeProbabilityColor = (isFake: boolean, confidence: number) => {
  if (isFake) return colorForValue(confidence);
  return "#10b981";
};

export default function ConfidenceBar({
  value,
  label,
  size = "md",
  showPercent = true,
}: ConfidenceBarProps) {
  const pct = Math.round(value * 100);
  const color = colorForValue(value);

  const heights = { sm: "h-1.5", md: "h-2.5", lg: "h-3.5" };

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-xs text-slate-400 font-medium">{label}</span>
          )}
          {showPercent && (
            <span
              className="text-xs font-bold tabular-nums"
              style={{ color }}
            >
              {pct}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-white/[0.06] rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}cc, ${color})`,
            boxShadow: `0 0 8px ${color}66`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Radial Confidence Gauge ──────────────────────────────────────────────────
interface ConfidenceGaugeProps {
  value: number; // 0–1
  isFake: boolean;
  size?: number;
}

export function ConfidenceGauge({ value, isFake, size = 120 }: ConfidenceGaugeProps) {
  const pct = Math.round(value * 100);
  const color = fakeProbabilityColor(isFake, value);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value * circumference);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 100 100">
        {/* Track */}
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
        />
        {/* Progress */}
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          style={{
            filter: `drop-shadow(0 0 6px ${color}88)`,
            transition: "stroke-dashoffset 0.8s ease-out",
          }}
        />
        {/* Center text */}
        <text
          x="50" y="45"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontSize="18"
          fontWeight="700"
          fontFamily="var(--font-geist-sans)"
        >
          {pct}%
        </text>
        <text
          x="50" y="62"
          textAnchor="middle"
          fill="rgba(148,163,184,0.8)"
          fontSize="8"
          fontFamily="var(--font-geist-sans)"
        >
          Confidence
        </text>
      </svg>
    </div>
  );
}
