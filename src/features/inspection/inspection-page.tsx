import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InspectionInfoPanel } from "@/features/inspection/components/inspection-info-panel";
import { VoiceRecorder } from "@/features/inspection/components/voice-recorder";
import { TranscriptWindow } from "@/features/inspection/components/transcript-window";
import { EntityExtractionPanel } from "@/features/inspection/components/entity-extraction-panel";
import { InspectionChecklist } from "@/features/inspection/components/inspection-checklist";
import { InspectionNotes } from "@/features/inspection/components/inspection-notes";
import { useVoiceInspection } from "@/features/inspection/use-voice-inspection";
import { Mic } from "lucide-react";

export function InspectionPage() {
  const {
    state,
    isRecording,
    isPaused,
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
  } = useVoiceInspection();

  const isLive = state === "recording" || state === "paused" || state === "connecting";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mechanic Inspection"
        description="Voice-first defect detection with real-time AI analysis"
        actions={
          <span className="flex items-center gap-1.5 text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-full">
            <Mic className="h-3.5 w-3.5" />
            {isLive ? 'Recording Active' : 'Ready'}
          </span>
        }
      />

      {/* ── 3-column workstation layout ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr_300px]">
        {/* LEFT: Inspection Information */}
        <InspectionInfoPanel />

        {/* CENTER: Voice Recorder + Transcript */}
        <div className="flex flex-col gap-4">
          <VoiceRecorder
            state={state}
            isRecording={isRecording}
            isPaused={isPaused}
            elapsedMs={elapsedMs}
            noiseLevel={noiseLevel}
            speechConfidence={speechConfidence}
            micPermission={micPermission}
            error={error}
            onStart={start}
            onPause={pause}
            onResume={resume}
            onStop={stop}
            onReset={reset}
          />

          {/* Transcript window */}
          <Card className="flex-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                Live Transcript
                {entries.length > 0 && (
                  <span className="text-xs font-normal tabular-nums text-muted-foreground">
                    · {entries.length} entries
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TranscriptWindow entries={entries} isLive={isLive} />
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: AI Extraction + Checklist */}
        <div className="flex flex-col gap-4">
          <EntityExtractionPanel entries={entries} isLive={isLive} />
          <InspectionChecklist entries={entries} />
        </div>
      </div>

      {/* ── Bottom: Notes & Attachments ── */}
      <InspectionNotes />
    </div>
  );
}