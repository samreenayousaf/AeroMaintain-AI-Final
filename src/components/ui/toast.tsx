import { createContext, useContext, useCallback, useRef } from "react";
import { X, AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { create } from "zustand";

/* ── Toast Store ── */

export type ToastVariant = "success" | "error" | "warning" | "info" | "default";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
}

let toastCounter = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${++toastCounter}`;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    return id;
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function toast(
  title: string,
  options?: {
    description?: string;
    variant?: ToastVariant;
    duration?: number;
  },
) {
  return useToastStore.getState().addToast({
    title,
    description: options?.description,
    variant: options?.variant,
    duration: options?.duration ?? 4000,
  });
}

/* ── Context hook for auto-dismiss ── */

const ToastDurationContext = createContext(4000);
export function useToastDuration() {
  return useContext(ToastDurationContext);
}

/* ── Toast Component ── */

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  default: Info,
};

const colorMap = {
  success: "border-l-success text-success",
  error: "border-l-destructive text-destructive",
  warning: "border-l-warning text-warning",
  info: "border-l-info text-info",
  default: "border-l-primary text-foreground",
};

export function ToastItem({ toast: t }: { toast: Toast }) {
  const removeToast = useToastStore((s) => s.removeToast);
  const duration = t.duration ?? 4000;
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleDismiss = useCallback(() => {
    removeToast(t.id);
  }, [removeToast, t.id]);

  // Auto-dismiss
  const startTimer = useCallback(() => {
    if (duration > 0) {
      timerRef.current = setTimeout(handleDismiss, duration);
    }
  }, [duration, handleDismiss]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useCallback(() => {
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer]);

  const Icon = iconMap[t.variant ?? "default"];

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-lg",
        "animate-in slide-in-from-right-5 fade-in duration-200",
        colorMap[t.variant ?? "default"],
        "border-l-4",
      )}
      onMouseEnter={clearTimer}
      onMouseLeave={startTimer}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{t.title}</p>
        {t.description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{t.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className="shrink-0 rounded-md p-0.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ── Toaster (render at root) ── */

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-h-[80vh] overflow-y-auto pointer-events-none"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} />
        </div>
      ))}
    </div>
  );
}