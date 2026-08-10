import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterChip {
  key: string;
  label: string;
  value: string;
}

interface FilterBarProps {
  chips: FilterChip[];
  onRemove: (key: string) => void;
  onClearAll: () => void;
  className?: string;
}

export function FilterBar({ chips, onRemove, onClearAll, className }: FilterBarProps) {
  if (chips.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-xs font-medium text-muted-foreground">Filters:</span>
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground"
        >
          <span className="text-muted-foreground">{chip.label}:</span> {chip.value}
          <button
            type="button"
            onClick={() => onRemove(chip.key)}
            className="ml-0.5 rounded-full p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
            aria-label={`Remove ${chip.label} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs text-muted-foreground underline-offset-2 hover:underline hover:text-foreground cursor-pointer transition-colors"
      >
        Clear all
      </button>
    </div>
  );
}