import type { QuestionType } from "@/lib/types";
import { TYPE_META } from "@/content/types";

const PATHS: Record<string, React.ReactNode> = {
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  list: <><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4.5" cy="6" r="1" /><circle cx="4.5" cy="12" r="1" /><circle cx="4.5" cy="18" r="1" /></>,
  shield: <><path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" /><path d="M9 12l2 2 4-4" /></>,
  bulb: <><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0012 3z" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
  login: <><path d="M14 4h5a1 1 0 011 1v14a1 1 0 01-1 1h-5" /><path d="M10 8l4 4-4 4M14 12H4" /></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  play: <path d="M8 5l11 7-11 7V5z" />,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  chat: <path d="M4 5h16v11H9l-5 4V5z" />,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  book: <><path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5z" /><path d="M19 19v2H6" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" />,
  gift: <><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M5 12v8h14v-8M12 8v12M12 8S9 8 8 6.5 9 3 10.5 4 12 8 12 8zm0 0s3 0 4-1.5S15 3 13.5 4 12 8 12 8z" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></>,
  hash: <path d="M5 9h14M5 15h14M10 4L8 20M16 4l-2 16" />,
  grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
  shapes: <><circle cx="7" cy="7" r="3.5" /><rect x="13" y="3.5" width="7" height="7" rx="1" /><path d="M7 14l4 7H3l4-7zM15 14h5v7h-5z" /></>,
  rotate: <><path d="M20 12a8 8 0 11-2.3-5.6" /><path d="M20 4v5h-5" /></>,
  branch: <><circle cx="6" cy="5" r="2" /><circle cx="18" cy="5" r="2" /><circle cx="12" cy="19" r="2" /><path d="M6 7v3a3 3 0 003 3h6a3 3 0 003-3V7M12 13v4" /></>,
  letters: <><path d="M3 18l4.5-12L12 18M4.8 14h5.4" /><path d="M15 6v12h3a3 3 0 000-6h-3" /></>,
};

export type IconName = keyof typeof PATHS;

export function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}

const TYPE_ICON: Record<QuestionType, IconName> = {
  number_series: "hash", matrix: "grid", odd_one_out: "shapes", rotation: "rotate", logic: "branch", verbal: "letters",
};

/** Rounded tile with the type's icon in its own color. */
export function TypeIcon({ type, size = "md" }: { type: QuestionType; size?: "sm" | "md" | "lg" }) {
  const m = TYPE_META[type];
  const box = size === "lg" ? "h-14 w-14 rounded-2xl" : size === "sm" ? "h-8 w-8 rounded-lg" : "h-11 w-11 rounded-xl";
  const ico = size === "lg" ? "h-7 w-7" : size === "sm" ? "h-4 w-4" : "h-6 w-6";
  return (
    <span className={`inline-flex shrink-0 items-center justify-center ${box} ${m.tint} ${m.ink}`}>
      <Icon name={TYPE_ICON[type]} className={ico} />
    </span>
  );
}

/** Tiny hand-drawn preview of what a question of this type looks like. */
export function TypeIllustration({ type, className = "h-24 w-full" }: { type: QuestionType; className?: string }) {
  const c = { number_series: "#3b82f6", matrix: "#14b8a6", odd_one_out: "#f59e0b", rotation: "#8b5cf6", logic: "#f43f5e", verbal: "#10b981" }[type];
  const common = { viewBox: "0 0 200 96", className, role: "img" as const, "aria-label": TYPE_META[type].label };
  switch (type) {
    case "number_series":
      return (
        <svg {...common}>
          {["2", "4", "8", "16"].map((n, i) => (
            <g key={n}><rect x={8 + i * 46} y="28" width="38" height="40" rx="8" fill="#fff" stroke={c} strokeWidth="2" /><text x={27 + i * 46} y="54" textAnchor="middle" fontSize="18" fontWeight="700" fill="#1f2a44">{n}</text></g>
          ))}
          <rect x="192" y="28" width="0" height="40" />
        </svg>
      );
    case "matrix":
      return (
        <svg {...common}>
          {[0, 1, 2].flatMap((r) => [0, 1, 2].map((k) => {
            const x = 52 + k * 32, y = 6 + r * 28, last = r === 2 && k === 2;
            return (
              <g key={`${r}${k}`}>
                <rect x={x} y={y} width="28" height="24" rx="5" fill={last ? "#fff" : "#fff"} stroke={last ? c : "#cbd5e1"} strokeWidth={last ? 2 : 1.2} strokeDasharray={last ? "4 3" : undefined} />
                {last ? <text x={x + 14} y={y + 17} textAnchor="middle" fontSize="15" fontWeight="700" fill={c}>?</text> : <circle cx={x + 14} cy={y + 12} r={3 + ((r + k) % 3) * 2} fill={c} opacity={0.35 + 0.2 * ((r + k) % 3)} />}
              </g>
            );
          }))}
        </svg>
      );
    case "odd_one_out":
      return (
        <svg {...common}>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${14 + i * 46} 28)`}>
              <rect width="38" height="40" rx="8" fill="#fff" stroke={i === 2 ? c : "#cbd5e1"} strokeWidth={i === 2 ? 2.2 : 1.2} />
              {i === 2 ? <polygon points="19,9 31,31 7,31" fill={c} /> : <circle cx="19" cy="20" r="11" fill="#94a3b8" opacity="0.6" />}
            </g>
          ))}
        </svg>
      );
    case "rotation":
      return (
        <svg {...common}>
          <g transform="translate(26 22)"><path d="M0 0h14v36h22v14H0z" fill={c} opacity="0.85" /></g>
          <path d="M84 48h26m-8-8l8 8-8 8" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <g transform="translate(124 70) rotate(-90)"><path d="M0 0h14v36h22v14H0z" fill={c} opacity="0.85" /></g>
        </svg>
      );
    case "logic":
      return (
        <svg {...common}>
          {["A", "B", "C"].map((l, i) => (
            <g key={l}>
              <circle cx={32 + i * 68} cy="48" r="20" fill="#fff" stroke={c} strokeWidth="2" />
              <text x={32 + i * 68} y="55" textAnchor="middle" fontSize="18" fontWeight="700" fill="#1f2a44">{l}</text>
              {i < 2 && <path d={`M${56 + i * 68} 48h24m-7-7l7 7-7 7`} fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />}
            </g>
          ))}
        </svg>
      );
    case "verbal":
      return (
        <svg {...common}>
          <rect x="10" y="30" width="68" height="36" rx="18" fill="#fff" stroke={c} strokeWidth="2" /><text x="44" y="53" textAnchor="middle" fontSize="15" fontWeight="700" fill="#1f2a44">Bút</text>
          <text x="97" y="55" textAnchor="middle" fontSize="20" fontWeight="700" fill="#64748b">:</text>
          <rect x="110" y="30" width="80" height="36" rx="18" fill={c} opacity="0.15" /><text x="150" y="53" textAnchor="middle" fontSize="15" fontWeight="700" fill="#1f2a44">viết</text>
        </svg>
      );
  }
}
