import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { AppShell } from "@/components/layout/app-shell";
import { AuthGuard } from "@/features/auth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Public pages
const LandingPage = lazy(() =>
  import("@/features/landing/landing-page").then((m) => ({ default: m.LandingPage })),
);
const LoginPage = lazy(() =>
  import("@/features/auth/login-page").then((m) => ({ default: m.LoginPage })),
);
const ForgotPasswordPage = lazy(() =>
  import("@/features/auth/forgot-password-page").then((m) => ({
    default: m.ForgotPasswordPage,
  })),
);

// Dashboard pages (lazy loaded inside AppShell)
const DashboardPage = lazy(() =>
  import("@/features/dashboard/dashboard-page").then((m) => ({
    default: m.DashboardPage,
  })),
);
const FleetPage = lazy(() =>
  import("@/features/fleet/fleet-page").then((m) => ({ default: m.FleetPage })),
);
const AircraftDetailPage = lazy(() =>
  import("@/features/aircraft/aircraft-detail-page").then((m) => ({
    default: m.AircraftDetailPage,
  })),
);
const InspectionPage = lazy(() =>
  import("@/features/inspection/inspection-page").then((m) => ({
    default: m.InspectionPage,
  })),
);
const AnalysisPage = lazy(() =>
  import("@/features/analysis/analysis-page").then((m) => ({
    default: m.AnalysisPage,
  })),
);
const ApprovalPage = lazy(() =>
  import("@/features/approval/approval-page").then((m) => ({
    default: m.ApprovalPage,
  })),
);
const ProcurementPage = lazy(() =>
  import("@/features/procurement/procurement-page").then((m) => ({
    default: m.ProcurementPage,
  })),
);
const ReportsPage = lazy(() =>
  import("@/features/reports/reports-page").then((m) => ({
    default: m.ReportsPage,
  })),
);
const NotificationsPage = lazy(() =>
  import("@/features/notifications/notifications-page").then((m) => ({
    default: m.NotificationsPage,
  })),
);
const SettingsPage = lazy(() =>
  import("@/features/settings/settings-page").then((m) => ({
    default: m.SettingsPage,
  })),
);

function PageLoader() {
  return (
    <div className="flex flex-1 items-center justify-center py-24" role="status">
      <LoadingSpinner size="lg" />
    </div>
  );
}

function lazyPage(Component: React.LazyExoticComponent<() => React.JSX.Element>) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path={ROUTES.landing} element={lazyPage(LandingPage)} />
        <Route path={ROUTES.login} element={lazyPage(LoginPage)} />
        <Route
          path={ROUTES.forgotPassword}
          element={lazyPage(ForgotPasswordPage)}
        />

        {/* Authenticated app shell */}
        <Route
          element={
            <AuthGuard>
              <AppShell />
            </AuthGuard>
          }
        >
          <Route path={ROUTES.dashboard} element={lazyPage(DashboardPage)} />
          <Route path={ROUTES.fleet} element={lazyPage(FleetPage)} />
          <Route
            path="/aircraft/:id"
            element={lazyPage(AircraftDetailPage)}
          />
          <Route path={ROUTES.inspection} element={lazyPage(InspectionPage)} />
          <Route path={ROUTES.analysis} element={lazyPage(AnalysisPage)} />
          <Route path={ROUTES.approval} element={lazyPage(ApprovalPage)} />
          <Route path={ROUTES.procurement} element={lazyPage(ProcurementPage)} />
          <Route path={ROUTES.reports} element={lazyPage(ReportsPage)} />
          <Route
            path={ROUTES.notifications}
            element={lazyPage(NotificationsPage)}
          />
          <Route path={ROUTES.settings} element={lazyPage(SettingsPage)} />
          <Route path="/settings/profile" element={lazyPage(SettingsPage)} />
          <Route
            path="/settings/organization"
            element={lazyPage(SettingsPage)}
          />
          <Route path="/settings/security" element={lazyPage(SettingsPage)} />
          <Route
            path="/settings/ai-services"
            element={lazyPage(SettingsPage)}
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={ROUTES.landing} replace />} />
      </Routes>
    </BrowserRouter>
  );
}