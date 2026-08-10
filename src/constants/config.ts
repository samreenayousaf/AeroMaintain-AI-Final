/**
 * Public, publishable configuration.
 * Never put secrets here — API keys live in Supabase Secret Manager
 * and are only read inside Edge Functions.
 */
export const APP_NAME = "AeroMaintain AI";

export const SUPABASE_URL = "https://cjawctzikzmotjzfmkdo.supabase.co";
export const SUPABASE_ANON_KEY =
  "sb_publishable_2JhTtIwtSx3lHXkaSlkfPA_VkTHpLnp";

export const APP_CONFIG = {
  name: APP_NAME,
  version: "0.1.0",
  supportedModels: ["A320", "A330", "A350", "B737", "B777", "B787"],
} as const;
