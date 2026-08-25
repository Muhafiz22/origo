import { useId } from "react";

export default function OrigoStamp({
  size = 180,
  waxColor = "#6b2e2f",
  edgeColor = "#8b2c1f",
  inkColor = "#ede0c8",
  sealed = true,
  title = "Iqra seal — read",
  className,
}) {
  const uid = useId();
  const roughId = `origo-stamp-rough-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 180 180"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
      style={{ opacity: sealed ? 1 : 0.35 }}
    >
      <title>{title}</title>

      <defs>
        <filter id={roughId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
        </filter>
      </defs>

      <circle
        cx="90"
        cy="90"
        r="78"
        fill={waxColor}
        filter={`url(#${roughId})`}
      />

      <circle
        cx="90"
        cy="90"
        r="78"
        fill="none"
        stroke={edgeColor}
        strokeWidth="1"
        filter={`url(#${roughId})`}
      />

      <circle
        cx="90"
        cy="90"
        r="66"
        fill="none"
        stroke={inkColor}
        strokeWidth="1"
        strokeDasharray="2,4"
        opacity="0.55"
      />

      <text
        x="90"
        y="103"
        textAnchor="middle"
        fontFamily="Amiri, serif"
        fontWeight="700"
        fontSize="40"
        fill={inkColor}
      >
        اقرأ
      </text>
    </svg>
  );
}
