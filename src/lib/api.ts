import type { ApiResponse } from "@/types/api";

/** Lightweight API response helper for mock/supabase calls */
export async function apiCall<T>(
  fn: () => Promise<T>,
): Promise<ApiResponse<T>> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return { data: null as unknown as T, error: { message } };
  }
}

/** Simulate network delay (for mock service calls) */
export function delay(ms = 300): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}