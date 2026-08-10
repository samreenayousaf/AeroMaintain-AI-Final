import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Plane,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { ROUTES } from "@/constants/routes";
import { APP_NAME } from "@/constants/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";

/* ── Demo hint shown for convenience ── */
const DEMO_CREDENTIALS = [
  { label: "Admin", email: "admin@aeromaintain.com" },
  { label: "Manager", email: "manager@aeromaintain.com" },
  { label: "Mechanic", email: "mechanic@aeromaintain.com" },
  { label: "Procurement", email: "procurement@aeromaintain.com" },
  { label: "Executive", email: "executive@aeromaintain.com" },
];

/* ── Inline SVG for Google logo ── */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

/* ── Inline SVG for Microsoft logo ── */
function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="9.5" height="9.5" fill="#F25022"/>
      <rect x="12.5" y="2" width="9.5" height="9.5" fill="#7FBA00"/>
      <rect x="2" y="12.5" width="9.5" height="9.5" fill="#00A4EF"/>
      <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#FFB900"/>
    </svg>
  );
}

/* ── Form field validation ── */

type FieldErrors = Partial<Record<"email" | "password", string>>;

function validateEmail(email: string): string | null {
  if (!email.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Enter a valid email address.";
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  return null;
}

/* ═══════════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════════ */

export function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  /* ── Form state ── */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  /* ── Submission ── */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError(null);

      // Validate
      const errEmail = validateEmail(email);
      const errPassword = validatePassword(password);
      setFieldErrors({ email: errEmail ?? undefined, password: errPassword ?? undefined });

      if (errEmail || errPassword) return;

      setStatus("loading");

      try {
        const { data: _data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) {
          if (email.toLowerCase().endsWith("@aeromaintain.com") || password === "password123") {
            const role = email.includes("admin")
              ? "admin"
              : email.includes("manager")
                ? "manager"
                : email.includes("procurement")
                  ? "procurement_officer"
                  : email.includes("executive")
                    ? "executive"
                    : "mechanic";

            setSession(
              {
                id: `demo-${role}`,
                email: email.trim(),
                full_name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
                role: role as any,
                organization_id: "org-1",
                avatar_url: null,
                is_active: true,
                last_login_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              "demo-access-token",
            );
          } else {
            throw signInError;
          }
        }

        // Brief success state so the user sees the confirmation
        setStatus("success");

        setTimeout(() => {
          navigate(ROUTES.dashboard, { replace: true });
        }, 300);
      } catch (err) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred.";
        setSubmitError(message);
        setStatus("error");
      }
    },
    [email, password, setSession, navigate],
  );

  /* ── Social login placeholders ── */
  const handleGoogleLogin = useCallback(() => {
    setSubmitError("Google sign-in is coming soon.");
  }, []);

  const handleMicrosoftLogin = useCallback(() => {
    setSubmitError("Microsoft sign-in is coming soon.");
  }, []);

  /* ── Button content ── */
  const buttonContent = (() => {
    switch (status) {
      case "loading":
        return (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in…
          </>
        );
      case "success":
        return (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Signed in! Redirecting…
          </>
        );
      default:
        return "Sign in";
    }
  })();

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      {/* ── Background glow ── */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(6,182,212,0.1)_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full" />

      {/* ── Brand panel (hidden on small screens) ── */}
      <aside className="hidden flex-1 flex-col justify-center px-12 py-16 lg:flex xl:px-20">
        <div className="mx-auto max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20 text-primary glow-cyan">
              <Plane className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-wide text-foreground">
              {APP_NAME}
            </span>
          </div>

          {/* Tagline */}
          <h1 className="mt-10 text-3xl font-extrabold tracking-tight text-foreground xl:text-4xl">
            Keep your fleet
            <br />
            <span className="text-primary">in the air.</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            AI-powered predictive maintenance, voice-first inspections, and
            smart procurement — all in one platform.
          </p>

          {/* Feature highlights */}
          <div className="mt-10 space-y-5">
            {[
              { label: "Voice-first inspections", desc: "Hands-free defect recording with real-time STT" },
              { label: "AI root-cause analysis", desc: "Predict failures before they happen" },
              { label: "Smart procurement", desc: "Compare suppliers, prices, and stock instantly" },
            ].map((f) => (
              <div key={f.label} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary/70" />
                <div>
                  <p className="text-sm font-medium text-foreground">{f.label}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Vertical divider ── */}
      <div className="hidden w-px bg-gradient-to-b from-transparent via-border to-transparent lg:block" />

      {/* ── Login form panel ── */}
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Card */}
          <div className="glass glass-strong rounded-2xl p-8 sm:p-10">
            {/* Logo (visible on mobile, hidden on lg+) */}
            <div className="mb-6 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 text-primary glow-cyan">
                <Plane className="h-4 w-4" />
              </div>
              <span className="text-base font-bold tracking-wide text-foreground">
                {APP_NAME}
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-center text-xl font-bold text-foreground sm:text-2xl">
              Welcome back
            </h2>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="name@airline.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                    }}
                    className={cn(
                      "pl-9",
                      fieldErrors.email && "border-destructive/60 focus-visible:ring-destructive/40",
                    )}
                    autoComplete="email"
                    autoFocus
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  />
                </div>
                {fieldErrors.email && (
                  <p id="email-error" className="flex items-center gap-1 text-xs text-destructive" role="alert">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="login-password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                    }}
                    className={cn(
                      "pl-9 pr-10",
                      fieldErrors.password && "border-destructive/60 focus-visible:ring-destructive/40",
                    )}
                    autoComplete="current-password"
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p id="password-error" className="flex items-center gap-1 text-xs text-destructive" role="alert">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-border bg-card text-primary focus:ring-ring focus:ring-offset-1 focus:ring-offset-background cursor-pointer accent-cyan-500"
                  />
                  Remember me
                </label>
                <Link
                  to={ROUTES.forgotPassword}
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error banner */}
              {submitError && (
                <div
                  className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive animate-slide-in-up"
                  role="alert"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold"
                disabled={status === "loading" || status === "success"}
              >
                {buttonContent}
              </Button>
            </form>

            {/* ── Divider ── */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground">or continue with</span>
              </div>
            </div>

            {/* ── Social buttons ── */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                className="h-10 border-border text-sm font-medium"
              >
                <GoogleIcon className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleMicrosoftLogin}
                className="h-10 border-border text-sm font-medium"
              >
                <MicrosoftIcon className="mr-2 h-4 w-4" />
                Microsoft
              </Button>
            </div>

            {/* ── Sign up link ── */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setSubmitError("Registration is not available in this demo.")}
                className="font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer"
              >
                Sign up
              </button>
            </p>
          </div>

          {/* ── Demo credentials hint ── */}
          <div className="mt-6 rounded-xl border border-border/50 bg-card/40 px-5 py-4 backdrop-blur-sm">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <AlertCircle className="h-3 w-3 text-primary" />
              Demo credentials &mdash; any user, password: <span className="font-mono text-foreground">password123</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {DEMO_CREDENTIALS.map((c) => (
                <button
                  key={c.email}
                  type="button"
                  onClick={() => {
                    setEmail(c.email);
                    setPassword("password123");
                    setFieldErrors({});
                    setSubmitError(null);
                  }}
                  className="group flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                  <span className="font-medium">{c.label}:</span> {c.email}
                </button>
              ))}
            </div>
          </div>

          {/* ── Footer ── */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}