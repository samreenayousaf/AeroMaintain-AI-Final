export const ROUTES = {
  landing: "/",
  login: "/login",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  dashboard: "/dashboard",
  fleet: "/fleet",
  aircraftDetail: (id: string) => `/aircraft/${id}`,
  inspection: "/inspection",
  analysis: "/analysis",
  approval: "/approval",
  procurement: "/procurement",
  reports: "/reports",
  notifications: "/notifications",
  settings: "/settings",
  settingsProfile: "/settings/profile",
  settingsOrganization: "/settings/organization",
  settingsSecurity: "/settings/security",
  settingsAiServices: "/settings/ai-services",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
