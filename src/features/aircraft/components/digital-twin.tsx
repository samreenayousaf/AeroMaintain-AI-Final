import { useCallback } from "react";
import { cn } from "@/lib/utils";
import type { ComponentHealth } from "@/features/aircraft/data";
import { healthColor } from "@/features/aircraft/data";

interface DigitalTwinProps {
  components: ComponentHealth[];
  selectedId: string | null;
  onSelect: (component: ComponentHealth) => void;
  className?: string;
}

function comp(components: ComponentHealth[], svgId: string): ComponentHealth | undefined {
  return components.find((c) => c.svgId === svgId);
}

function fillFor(id: string, components: ComponentHealth[], sel: string | null): string {
  const c = comp(components, id);
  if (!c) return "rgba(148,163,184,0.08)";
  const col = healthColor(c.health);
  return id === sel ? col.replace(")", ",0.4)") : col.replace(")", ",0.18)");
}

function strokeFor(id: string, _components: ComponentHealth[], sel: string | null): string | undefined {
  if (id !== sel) return undefined;
  return "#06B6D4";
}

function glowFor(id: string, sel: string | null): string | undefined {
  if (id !== sel) return undefined;
  return "url(#cyan-glow)";
}

export function DigitalTwin({ components, selectedId, onSelect, className }: DigitalTwinProps) {
  const handleClick = useCallback(
    (svgId: string) => {
      const c = comp(components, svgId);
      if (c) onSelect(c);
    },
    [components, onSelect],
  );

  const handleKeyDown = useCallback(
    (svgId: string, e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick(svgId);
      }
    },
    [handleClick],
  );

  const zoneProps = (svgId: string) => ({
    className: "cursor-pointer transition-all duration-200",
    onClick: () => handleClick(svgId),
    onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(svgId, e),
    tabIndex: 0,
    role: "button",
    "aria-label": `Select ${comp(components, svgId)?.name ?? svgId}`,
    "aria-pressed": selectedId === svgId,
    style: { outline: "none" } as React.CSSProperties,
  });

  return (
    <div className={cn("relative overflow-hidden rounded-xl glass-card p-4", className)}>
      {/* Blueprint grid overlay */}
      <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.05)_1px,transparent_1px)] [background-size:30px_30px] pointer-events-none" />
      
      <svg
        viewBox="0 0 800 400"
        className="h-auto w-full relative z-10"
        role="img"
        aria-label="Aircraft digital twin — top view with selectable systems"
      >
        <defs>
          {/* Enhanced cyan glow */}
          <filter id="cyan-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur" />
            <feFlood floodColor="#06B6D4" floodOpacity="0.9" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="body-shadow">
            <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="rgba(6,182,212,0.2)" />
          </filter>

          <linearGradient id="fuselage-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0F1A2E" />
            <stop offset="50%" stopColor="#162540" />
            <stop offset="100%" stopColor="#0F1A2E" />
          </linearGradient>

          <linearGradient id="wing-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#162540" />
            <stop offset="50%" stopColor="#0F1A2E" />
            <stop offset="100%" stopColor="#162540" />
          </linearGradient>
        </defs>

        {/* Grid pattern */}
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(6,182,212,0.04)" strokeWidth="0.5" />
        </pattern>
        <rect width="800" height="400" fill="url(#grid)" opacity="0.5" />

        {/* ═══ Base aircraft outline ═══ */}
        <g filter="url(#body-shadow)">
          {/* Fuselage */}
          <path
            d="M120,200 C140,178 185,172 260,172 L550,172 Q630,172 670,188 Q690,200 670,212 Q630,228 550,228 L260,228 C185,228 140,222 120,200 Z"
            fill="url(#fuselage-grad)"
            stroke="rgba(6,182,212,0.2)"
            strokeWidth="1.5"
          />

          {/* Centerline */}
          <line x1="140" y1="200" x2="660" y2="200" stroke="rgba(6,182,212,0.1)" strokeWidth="1" strokeDasharray="6,4" />

          {/* Left wing */}
          <path
            d="M340,178 L365,48 L515,52 L545,178 Z"
            fill="url(#wing-grad)"
            stroke="rgba(6,182,212,0.2)"
            strokeWidth="1.2"
          />

          {/* Right wing */}
          <path
            d="M340,222 L365,352 L515,348 L545,222 Z"
            fill="url(#wing-grad)"
            stroke="rgba(6,182,212,0.2)"
            strokeWidth="1.2"
          />

          {/* Left horizontal stabilizer */}
          <path
            d="M155,178 L140,120 L205,118 L240,178 Z"
            fill="url(#wing-grad)"
            stroke="rgba(6,182,212,0.15)"
            strokeWidth="1"
          />

          {/* Right horizontal stabilizer */}
          <path
            d="M155,222 L140,280 L205,282 L240,222 Z"
            fill="url(#wing-grad)"
            stroke="rgba(6,182,212,0.15)"
            strokeWidth="1"
          />

          {/* Vertical stabilizer */}
          <rect x="165" y="190" width="45" height="20" rx="6" fill="#0F1A2E" stroke="rgba(6,182,212,0.2)" strokeWidth="1" />

          {/* Cockpit windows */}
          <path
            d="M585,188 Q630,188 655,195 L655,205 Q630,212 585,212 Z"
            fill="rgba(6,182,212,0.06)"
            stroke="rgba(6,182,212,0.15)"
            strokeWidth="1"
          />

          {/* Wing detail lines */}
          <line x1="372" y1="58" x2="530" y2="172" stroke="rgba(6,182,212,0.06)" strokeWidth="1" />
          <line x1="372" y1="342" x2="530" y2="228" stroke="rgba(6,182,212,0.06)" strokeWidth="1" />
        </g>

        {/* ═══ Clickable system zones ═══ */}

        {/* Cockpit */}
        <g {...zoneProps("cockpit")}>
          <path
            d="M560,182 Q630,182 660,192 L660,208 Q630,218 560,218 Z"
            fill={fillFor("cockpit", components, selectedId)}
            stroke={strokeFor("cockpit", components, selectedId)}
            strokeWidth={selectedId === "cockpit" ? 2.5 : 1}
            filter={glowFor("cockpit", selectedId)}
          />
          <text x="590" y="204" fill="#94A3B8" fontSize="9" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif">Cockpit</text>
        </g>

        {/* Cabin Pressure */}
        <g {...zoneProps("cabin-pressure")}>
          <rect x="410" y="178" width="130" height="44" rx="4"
            fill={fillFor("cabin-pressure", components, selectedId)}
            stroke={strokeFor("cabin-pressure", components, selectedId)}
            strokeWidth={selectedId === "cabin-pressure" ? 2.5 : 1}
            filter={glowFor("cabin-pressure", selectedId)} />
          <text x="475" y="204" fill="#94A3B8" fontSize="8" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif">Cabin Pressure</text>
        </g>

        {/* Electrical System */}
        <g {...zoneProps("electrical-system")}>
          <rect x="310" y="180" width="80" height="40" rx="4"
            fill={fillFor("electrical-system", components, selectedId)}
            stroke={strokeFor("electrical-system", components, selectedId)}
            strokeWidth={selectedId === "electrical-system" ? 2.5 : 1}
            filter={glowFor("electrical-system", selectedId)} />
          <text x="350" y="204" fill="#94A3B8" fontSize="8" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif">Electrical</text>
        </g>

        {/* Bleed Air System */}
        <g {...zoneProps("bleed-air-system")}>
          <ellipse cx="500" cy="200" rx="40" ry="14"
            fill={fillFor("bleed-air-system", components, selectedId)}
            stroke={strokeFor("bleed-air-system", components, selectedId)}
            strokeWidth={selectedId === "bleed-air-system" ? 2.5 : 1}
            filter={glowFor("bleed-air-system", selectedId)} />
          <text x="500" y="204" fill="#94A3B8" fontSize="7" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif">Bleed Air</text>
        </g>

        {/* Hydraulic System */}
        <g {...zoneProps("hydraulic-system")}>
          <rect x="290" y="190" width="230" height="36" rx="4"
            fill={fillFor("hydraulic-system", components, selectedId)}
            stroke={strokeFor("hydraulic-system", components, selectedId)}
            strokeWidth={selectedId === "hydraulic-system" ? 2.5 : 1}
            filter={glowFor("hydraulic-system", selectedId)} />
          <text x="405" y="212" fill="#94A3B8" fontSize="7" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif">Hydraulic System</text>
        </g>

        {/* Landing Gear */}
        <g {...zoneProps("landing-gear")}>
          <ellipse cx="580" cy="200" rx="14" ry="10"
            fill={fillFor("landing-gear", components, selectedId)}
            stroke={strokeFor("landing-gear", components, selectedId)}
            strokeWidth={selectedId === "landing-gear" ? 2.5 : 1}
            filter={glowFor("landing-gear", selectedId)} />
          <ellipse cx="430" cy="168" rx="12" ry="6"
            fill={fillFor("landing-gear", components, selectedId)}
            stroke={strokeFor("landing-gear", components, selectedId)}
            strokeWidth={selectedId === "landing-gear" ? 2.5 : 1} />
          <ellipse cx="430" cy="232" rx="12" ry="6"
            fill={fillFor("landing-gear", components, selectedId)}
            stroke={strokeFor("landing-gear", components, selectedId)}
            strokeWidth={selectedId === "landing-gear" ? 2.5 : 1} />
          <text x="580" y="205" fill="#94A3B8" fontSize="7" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif">Gear</text>
        </g>

        {/* Fuel System */}
        <g {...zoneProps("fuel-system")}>
          <rect x="390" y="65" width="65" height="105" rx="6"
            fill={fillFor("fuel-system", components, selectedId)}
            stroke={strokeFor("fuel-system", components, selectedId)}
            strokeWidth={selectedId === "fuel-system" ? 2.5 : 1}
            filter={glowFor("fuel-system", selectedId)}
            transform="skewX(-4)" />
          <rect x="390" y="230" width="65" height="105" rx="6"
            fill={fillFor("fuel-system", components, selectedId)}
            stroke={strokeFor("fuel-system", components, selectedId)}
            strokeWidth={selectedId === "fuel-system" ? 2.5 : 1}
            filter={glowFor("fuel-system", selectedId)}
            transform="skewX(4)" />
          <text x="432" y="122" fill="#94A3B8" fontSize="7" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif">Fuel</text>
        </g>

        {/* Wing Systems */}
        <g {...zoneProps("wing-systems")}>
          <path d="M365,56 L515,60 L540,178 L380,185 Z"
            fill={fillFor("wing-systems", components, selectedId)}
            stroke={strokeFor("wing-systems", components, selectedId)}
            strokeWidth={selectedId === "wing-systems" ? 2.5 : 1}
            filter={glowFor("wing-systems", selectedId)} />
          <path d="M365,344 L515,340 L540,222 L380,215 Z"
            fill={fillFor("wing-systems", components, selectedId)}
            stroke={strokeFor("wing-systems", components, selectedId)}
            strokeWidth={selectedId === "wing-systems" ? 2.5 : 1}
            filter={glowFor("wing-systems", selectedId)} />
          <text x="410" y="65" fill="#94A3B8" fontSize="7" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif">Wing Systems</text>
        </g>

        {/* Left Engine */}
        <g {...zoneProps("left-engine")}>
          <rect x="375" y="94" width="58" height="44" rx="12"
            fill={fillFor("left-engine", components, selectedId)}
            stroke={strokeFor("left-engine", components, selectedId)}
            strokeWidth={selectedId === "left-engine" ? 2.5 : 1.5}
            filter={glowFor("left-engine", selectedId)} />
          <ellipse cx="380" cy="116" rx="4" ry="8" fill="rgba(0,0,0,0.3)" />
          <text x="404" y="120" fill="#94A3B8" fontSize="7" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif">L-ENG</text>
        </g>

        {/* Right Engine */}
        <g {...zoneProps("right-engine")}>
          <rect x="375" y="262" width="58" height="44" rx="12"
            fill={fillFor("right-engine", components, selectedId)}
            stroke={strokeFor("right-engine", components, selectedId)}
            strokeWidth={selectedId === "right-engine" ? 2.5 : 1.5}
            filter={glowFor("right-engine", selectedId)} />
          <ellipse cx="380" cy="284" rx="4" ry="8" fill="rgba(0,0,0,0.3)" />
          <text x="404" y="288" fill="#94A3B8" fontSize="7" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif">R-ENG</text>
        </g>

        {/* Tail Section */}
        <g {...zoneProps("tail-section")}>
          <path d="M155,178 L140,120 L205,118 L240,178 L200,182 Z"
            fill={fillFor("tail-section", components, selectedId)}
            stroke={strokeFor("tail-section", components, selectedId)}
            strokeWidth={selectedId === "tail-section" ? 2.5 : 1}
            filter={glowFor("tail-section", selectedId)} />
          <path d="M155,222 L140,280 L205,282 L240,222 L200,218 Z"
            fill={fillFor("tail-section", components, selectedId)}
            stroke={strokeFor("tail-section", components, selectedId)}
            strokeWidth={selectedId === "tail-section" ? 2.5 : 1}
            filter={glowFor("tail-section", selectedId)} />
          <rect x="165" y="188" width="45" height="24" rx="6"
            fill={fillFor("tail-section", components, selectedId)}
            stroke={strokeFor("tail-section", components, selectedId)}
            strokeWidth={selectedId === "tail-section" ? 2.5 : 1} />
          <text x="185" y="204" fill="#94A3B8" fontSize="7" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif">Tail</text>
        </g>

        {/* Animated data lines */}
        <path d="M120,200 Q200,190 400,200 Q600,210 670,200" fill="none" stroke="rgba(6,182,212,0.08)" strokeWidth="0.5" strokeDasharray="4,6">
          <animate attributeName="stroke-dashoffset" from="0" to="-30" dur="2s" repeatCount="indefinite" />
        </path>
      </svg>

      {/* Gradient legend */}
      <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-muted-foreground flex-wrap">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-success shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
          Healthy (≥80%)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-warning shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
          Warning (50–79%)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-destructive shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
          Critical (&lt;50%)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-3 rounded bg-primary shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          Selected
        </span>
      </div>
    </div>
  );
}