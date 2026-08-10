/** Format milliseconds as MM:SS (or H:MM:SS when >= 1h) */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const mm = hours > 0 ? minutes.toString().padStart(2, "0") : minutes.toString().padStart(2, "0");
  const ss = seconds.toString().padStart(2, "0");

  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Format a 0–1 confidence as a percentage string */
export function formatConfidence(value: number): string {
  return `${Math.round(Math.min(1, Math.max(0, value)) * 100)}%`;
}