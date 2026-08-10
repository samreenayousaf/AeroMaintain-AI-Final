import { useState } from "react";
import { Image, AudioLines, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export function InspectionNotes() {
  const [notes, setNotes] = useState("");
  const [attached, setAttached] = useState<string[]>([]);

  const addAttachment = (type: "photo" | "audio") => {
    if (!attached.includes(type)) {
      setAttached((p) => [...p, type]);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
      {/* Notes textarea */}
      <div className="rounded-xl border border-border bg-card p-4">
        <label
          htmlFor="inspection-notes"
          className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"
        >
          <FileText className="h-4 w-4 text-primary" /> Inspection Notes
        </label>
        <textarea
          id="inspection-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Type any additional observations, part numbers, or remarks here…"
          rows={3}
          className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
        />
      </div>

      {/* Attachment placeholders */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
        <button
          type="button"
          onClick={() => addAttachment("photo")}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-5 text-sm transition-all duration-150 active:scale-[0.97] cursor-pointer",
            attached.includes("photo")
              ? "border-success/40 bg-success/5 text-success"
              : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary",
          )}
          aria-label={attached.includes("photo") ? "Photo attached" : "Attach photo"}
        >
          <Image className={cn("h-6 w-6", attached.includes("photo") && "text-success")} />
          <span className="text-xs font-medium">
            {attached.includes("photo") ? "Photo Added" : "Add Photo"}
          </span>
        </button>
        <button
          type="button"
          onClick={() => addAttachment("audio")}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-5 text-sm transition-all duration-150 active:scale-[0.97] cursor-pointer",
            attached.includes("audio")
              ? "border-success/40 bg-success/5 text-success"
              : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary",
          )}
          aria-label={attached.includes("audio") ? "Audio attached" : "Attach audio"}
        >
          <AudioLines className={cn("h-6 w-6", attached.includes("audio") && "text-success")} />
          <span className="text-xs font-medium">
            {attached.includes("audio") ? "Audio Added" : "Add Audio"}
          </span>
        </button>
      </div>
    </div>
  );
}