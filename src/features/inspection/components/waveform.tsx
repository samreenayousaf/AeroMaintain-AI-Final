import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface WaveformProps {
  active: boolean; // true when recording & not muted
  muted: boolean;
  className?: string;
}

const BAR_COUNT = 48;

/** Create a deterministic-looking flat base amplitude array */
function flatBars(): number[] {
  return Array.from({ length: BAR_COUNT }, () => 0.08 + Math.random() * 0.08);
}

let flatCache: number[] | null = null;
function getFlatBars(): number[] {
  if (!flatCache) flatCache = flatBars();
  return flatCache;
}

export function Waveform({ active, muted, className }: WaveformProps) {
  const barsRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(0);

  useEffect(() => {
    const el = barsRef.current;
    if (!el || !active || muted) return;

    const children = el.children as HTMLCollectionOf<HTMLElement>;

    function tick() {
      for (let i = 0; i < children.length; i++) {
        const h = 0.15 + Math.random() * 0.85;
        children[i].style.height = `${Math.max(6, h * 56)}px`;
        children[i].style.opacity = `${0.35 + h * 0.65}`;
      }
      rafId.current = requestAnimationFrame(tick);
    }

    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [active, muted]);

  return (
    <div
      ref={barsRef}
      className={cn("flex h-16 items-center justify-center gap-[3px]", className)}
      aria-hidden="true"
    >
      {getFlatBars().map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-primary/30 transition-none"
          style={{
            height: `${Math.max(6, h * 56)}px`,
            opacity: active && !muted ? 0.35 + h * 0.65 : 0.25,
          }}
        />
      ))}
    </div>
  );
}