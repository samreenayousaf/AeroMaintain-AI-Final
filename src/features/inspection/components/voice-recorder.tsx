import {
  Mic,
  MicOff,
  Pause,
  Play,
  Square,
  RotateCcw,
  Radio,
  Volume2,
  Gauge,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Waveform } from "@/features/inspection/components/waveform";
import { formatDuration, formatConfidence } from "@/features/inspection/utils";
import type { RecorderState } from "@/features/inspection/use-voice-inspection";
import { cn } from "@/lib/utils";

interface VoiceRecorderProps {
  state: RecorderState;
  isRecording: boolean;
  isPaused: boolean;
  elapsedMs: number;
  noiseLevel: number;
  speechConfidence: number;
  micPermission: "granted" | "denied" | "unknown";
  error: string | null;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReset: () => void;
}

function connectionLabel(state: RecorderState): { label: string; dot: string; pulse?: boolean } {
  switch (state) {
    case "connecting":
      return { label: "Connecting", dot: "bg-info", pulse: true };
    case "recording":
      return { label: "Live", dot: "bg-success", pulse: true };
    case "paused":
      return { label: "Paused", dot: "bg-warning" };
    case "stopped":
      return { label: "Session ended", dot: "bg-muted-foreground" };
    default:
      return { label: "Disconnected", dot: "bg-muted-foreground" };
  }
}

function LevelBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div
        className="h-full rounded-full bg-primary transition-all duration-200"
        style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }}
      />
    </div>
  );
}

export function VoiceRecorder({
  state,
  isRecording,
  isPaused,
  elapsedMs,
  noiseLevel,
  speechConfidence,
  micPermission,
  error,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
}: VoiceRecorderProps) {
  const canStart = state === "idle" || state === "stopped";
  const conn = connectionLabel(state);

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">Voice Inspection</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            {/* Speechmatics connection status */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-xs text-muted-foreground">
              <Radio className="h-3 w-3 text-primary" />
              <span className="inline-flex items-center gap-1.5">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    conn.dot,
                    conn.pulse && "animate-pulse",
                  )}
                />
                {conn.label}
              </span>
            </span>
            {/* Mic permission state */}
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs",
                micPermission === "granted"
                  ? "border-success/30 bg-success/10 text-success"
                  : micPermission === "denied"
                    ? "border-destructive/30 bg-destructive/10 text-destructive"
                    : "border-border bg-muted/40 text-muted-foreground",
              )}
            >
              {micPermission === "granted" ? (
                <Mic className="h-3 w-3" />
              ) : micPermission === "denied" ? (
                <MicOff className="h-3 w-3" />
              ) : (
                <Loader2 className="h-3 w-3 animate-spin" />
              )}
              {micPermission === "granted"
                ? "Mic ready"
                : micPermission === "denied"
                  ? "Mic blocked"
                  : "Mic pending"}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-6">
        {/* ── Big mic button ── */}
        <div className="relative mt-2">
          {isRecording && (
            <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          )}
          <button
            type="button"
            onClick={canStart ? onStart : isPaused ? onResume : onPause}
            aria-label={canStart ? "Start recording" : isPaused ? "Resume recording" : "Pause recording"}
            aria-pressed={isRecording}
            className={cn(
              "relative flex h-24 w-24 items-center justify-center rounded-full border-2 transition-all duration-200 active:scale-95 cursor-pointer",
              isRecording
                ? "border-primary bg-primary/15 text-primary glow-cyan"
                : canStart
                  ? "border-primary/60 bg-primary/10 text-primary hover:bg-primary/20"
                  : "border-warning/60 bg-warning/10 text-warning hover:bg-warning/20",
            )}
          >
            {canStart ? (
              <Mic className="h-10 w-10" />
            ) : isPaused ? (
              <Play className="h-9 w-9" />
            ) : (
              <Square className="h-8 w-8" />
            )}
          </button>
        </div>

        {/* ── Timer ── */}
        <div className="text-center">
          <p className="font-mono text-4xl font-bold tabular-nums tracking-tight text-foreground">
            {formatDuration(elapsedMs)}
          </p>
          <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
            {isRecording ? "Recording" : isPaused ? "Paused" : canStart ? "Ready" : "Stopped"}
          </p>
        </div>

        {/* ── Live waveform ── */}
        <Waveform active={isRecording} muted={false} className="w-full" />

        {/* ── Indicators: speech confidence + noise level ── */}
        <div className="grid w-full grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Gauge className="h-3.5 w-3.5 text-info" /> Speech Confidence
              </span>
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {state === "idle" ? "—" : formatConfidence(speechConfidence)}
              </span>
            </div>
            <LevelBar value={speechConfidence} className="mt-2" />
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Volume2 className="h-3.5 w-3.5 text-warning" /> Noise Level
              </span>
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {state === "idle" ? "—" : `${Math.round(noiseLevel * 100)}%`}
              </span>
            </div>
            <LevelBar value={noiseLevel} className="mt-2" />
          </div>
        </div>

        {/* ── Transport controls ── */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {canStart ? (
            <Button onClick={onStart} size="lg" className="min-w-[10rem]">
              <Mic className="mr-2 h-4 w-4" /> Start Recording
            </Button>
          ) : (
            <>
              {isPaused ? (
                <Button onClick={onResume} size="lg" className="min-w-[10rem]">
                  <Play className="mr-2 h-4 w-4" /> Resume Recording
                </Button>
              ) : (
                <Button onClick={onPause} size="lg" variant="outline" className="min-w-[10rem]">
                  <Pause className="mr-2 h-4 w-4" /> Pause Recording
                </Button>
              )}
              <Button onClick={onStop} size="lg" variant="destructive" className="min-w-[10rem]">
                <Square className="mr-2 h-4 w-4" /> Stop Recording
              </Button>
            </>
          )}
          {(state === "stopped" || (state === "idle" && elapsedMs === 0)) && (
            <Button onClick={onReset} variant="ghost" size="lg">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          )}
        </div>

        {/* ── Error ── */}
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}