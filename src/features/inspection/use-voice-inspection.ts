import { useCallback, useEffect, useRef, useState } from "react";
import {
  Speechmatics,
  type ConnectionStatus,
  type SpeechmaticsSession,
  type TranscriptEntry,
} from "@/features/inspection/speechmatics";

export type RecorderState = "idle" | "connecting" | "recording" | "paused" | "stopped";

export interface VoiceInspectionApi {
  state: RecorderState;
  isRecording: boolean;
  isPaused: boolean;
  entries: TranscriptEntry[];
  elapsedMs: number;
  noiseLevel: number;
  speechConfidence: number;
  micPermission: "granted" | "denied" | "unknown";
  error: string | null;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
}

const RECORDER_STATE_MAP: Record<ConnectionStatus, RecorderState> = {
  disconnected: "idle",
  connecting: "connecting",
  connected: "recording",
  recording: "recording",
  paused: "paused",
  error: "idle",
};

/** Calculate speech confidence dynamically from live & final transcript entries and acoustic input */
function latestConfidence(entries: TranscriptEntry[], noiseLevel: number, isRecording: boolean): number {
  if (!isRecording) return 0;

  if (entries.length > 0) {
    const recent = entries.slice(-5);
    const avg = recent.reduce((s, e) => s + (e.confidence || 0.88), 0) / recent.length;
    return Math.max(0.75, Math.min(0.99, avg));
  }

  // When active voice or microphone noise audio is detected
  if (noiseLevel > 0.15) {
    return Math.min(0.96, Math.max(0.78, 0.75 + noiseLevel * 0.4));
  }

  return 0;
}

export function useVoiceInspection(): VoiceInspectionApi {
  const [state, setState] = useState<RecorderState>("idle");
  const [entries, setEntries] = useState<TranscriptEntry[]>([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [micPermission, setMicPermission] = useState<"granted" | "denied" | "unknown">("unknown");
  const [error, setError] = useState<string | null>(null);

  const sessionRef = useRef<SpeechmaticsSession | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number>(0);

  // ── Timer for recording duration ──
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startedAtRef.current);
    }, 100);
  }, [stopTimer]);

  useEffect(() => {
    return () => {
      stopTimer();
      sessionRef.current?.close();
    };
  }, [stopTimer]);

  // ── Public controls ──
  const start = useCallback(async () => {
    if (sessionRef.current) return;
    setError(null);
    setMicPermission("granted");

    setElapsedMs(0);
    startedAtRef.current = Date.now();
    startTimer();

    try {
      const session = await Speechmatics.createSession({
        onStatusChange: (status) => {
          setState(RECORDER_STATE_MAP[status]);
          if (status === "error") setError("Speechmatics connection lost.");
        },
        onTranscript: (entry) => {
          setEntries((prev) => {
            const idx = prev.findIndex((e) => e.id === entry.id);
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = entry;
              return next;
            }
            return [...prev, entry];
          });
        },
        onError: (msg) => setError(msg),
        onNoiseLevel: (level) => setNoiseLevel(level),
      });

      sessionRef.current = session;
      await session.startRecording();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to start recording";
      setError(msg);
      setState("idle");
      stopTimer();
    }
  }, [startTimer, stopTimer]);

  const pause = useCallback(() => {
    sessionRef.current?.pauseRecording();
    stopTimer();
  }, [stopTimer]);

  const resume = useCallback(() => {
    startedAtRef.current = Date.now() - elapsedMs;
    startTimer();
    sessionRef.current?.resumeRecording();
  }, [elapsedMs, startTimer]);

  const stop = useCallback(() => {
    sessionRef.current?.stopRecording();
    sessionRef.current = null;
    stopTimer();
    setState("stopped");
  }, [stopTimer]);

  const reset = useCallback(() => {
    stopTimer();
    sessionRef.current?.close();
    sessionRef.current = null;
    setEntries([]);
    setElapsedMs(0);
    setNoiseLevel(0);
    setState("idle");
    setError(null);
  }, [stopTimer]);

  const speechConfidence = latestConfidence(entries, noiseLevel, state === "recording");

  return {
    state,
    isRecording: state === "recording",
    isPaused: state === "paused",
    entries,
    elapsedMs,
    noiseLevel,
    speechConfidence,
    micPermission,
    error,
    start,
    pause,
    resume,
    stop,
    reset,
  };
}