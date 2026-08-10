import { useCallback, useEffect, useRef } from "react";
import { MessageSquareText } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/features/inspection/utils";
import type { TranscriptEntry } from "@/features/inspection/speechmatics";

interface TranscriptWindowProps {
  entries: TranscriptEntry[];
  isLive: boolean; // true when recording or paused
}

export function TranscriptWindow({ entries, isLive }: TranscriptWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  const formatTimestamp = useCallback((ms: number) => formatDuration(ms), []);

  // Latest non-final entry (the "streaming" line), if any
  const latestNonFinalIdx = [...entries].reverse().findIndex((e) => !e.isFinal);
  const streamingEntry = latestNonFinalIdx >= 0 ? entries[entries.length - 1 - latestNonFinalIdx] : null;

  if (entries.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <MessageSquareText className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">No transcript yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Press <span className="font-semibold text-primary">Start Recording</span> and begin
            dictating defects to see the live transcript appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1.5">
        {entries.map((entry) => {
          const isLatestStreaming = entry === streamingEntry;
          return (
            <div
              key={entry.id}
              className={cn(
                "group flex items-start gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-150",
                entry.isFinal
                  ? "text-foreground"
                  : isLatestStreaming
                    ? "bg-primary/5 text-primary-foreground/90 border border-primary/10"
                    : "text-muted-foreground",
                isLatestStreaming && "animate-zoom-in",
              )}
            >
              {/* Timestamp */}
              <span className="mt-0.5 shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground/60">
                {formatTimestamp(entry.timestamp)}
              </span>
              {/* Content */}
              <p className="flex-1 leading-relaxed">
                {entry.text}
                {!entry.isFinal && isLatestStreaming && (
                  <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-primary/60 align-text-bottom" />
                )}
              </p>
              {/* Confidence badge */}
              {entry.isFinal && (
                <span
                  className={cn(
                    "mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                    entry.confidence >= 0.9
                      ? "bg-success/10 text-success"
                      : entry.confidence >= 0.75
                        ? "bg-warning/10 text-warning"
                        : "bg-destructive/10 text-destructive",
                  )}
                >
                  {Math.round(entry.confidence * 100)}%
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Live listening indicator */}
      {isLive && (
        <div className="flex items-center gap-2 px-3 pt-2 pb-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="text-[11px] text-muted-foreground">Listening for defects…</span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}