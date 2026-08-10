/* ═══════════════════════════════════════════════════════════════════
   AeroMaintain AI — Premium Enterprise Aviation Landing Page
   ═══════════════════════════════════════════════════════════════════ */

import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  Mic,
  BrainCircuit,
  PackageSearch,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { APP_NAME } from "@/constants/config";

/* ── Feature Data ── */
const features = [
  {
    icon: Mic,
    title: "Voice-First Inspections",
    description:
      "Mechanics dictate defects hands-free. Speechmatics STT transcribes in real time with 95%+ accuracy.",
  },
  {
    icon: BrainCircuit,
    title: "AI Root-Cause Analysis",
    description:
      "Featherless LLMs analyze defects, predict failures, and recommend corrective actions instantly.",
  },
  {
    icon: PackageSearch,
    title: "Smart Procurement",
    description:
      "Enriched supplier data in real time — compare prices, stock levels, and delivery schedules.",
  },
  {
    icon: ShieldCheck,
    title: "Approval Workflows",
    description:
      "Managers review defects, inspections, and purchase orders in a single, streamlined queue.",
  },
];

/* ── KPI Data ── */
const kpis = [
  { value: "120+", label: "Aircraft" },
  { value: "98.6%", label: "Accuracy" },
  { value: "$2.7M+", label: "Savings" },
];

/* ═══════════════════════════════════════════════════════════════════
   HeroBackground — Animated aerospace engineering background
   Uses only CSS/SVG. No Three.js, no Canvas, no aircraft models.
   ═══════════════════════════════════════════════════════════════════ */
function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <style>{`
        .hbg-perspective-grid { opacity: 0.04; }
        .hbg-dot-matrix { opacity: 0.012; }

        .hbg-node {
          position: absolute;
          width: 3px; height: 3px;
          border-radius: 50%;
          background: #525EA7;
          box-shadow: 0 0 6px rgba(82,94,167,0.5), 0 0 12px rgba(82,94,167,0.2);
        }

        @keyframes nd-1 {
          0%, 100% { transform: translate(0, 0); opacity: 0.15; }
          20% { transform: translate(50px, 80px); opacity: 0.85; }
          40% { transform: translate(20px, 180px); opacity: 0.25; }
          65% { transform: translate(-30px, 260px); opacity: 0.7; }
          85% { transform: translate(10px, 300px); opacity: 0.35; }
        }
        @keyframes nd-2 {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          25% { transform: translate(-60px, 120px); opacity: 0.9; }
          50% { transform: translate(-20px, 250px); opacity: 0.3; }
          75% { transform: translate(40px, 360px); opacity: 0.65; }
        }
        @keyframes nd-3 {
          0%, 100% { transform: translate(0, 0); opacity: 0.1; }
          30% { transform: translate(80px, 60px); opacity: 0.75; }
          60% { transform: translate(30px, 210px); opacity: 0.2; }
          90% { transform: translate(-50px, 320px); opacity: 0.6; }
        }
        @keyframes nd-4 {
          0%, 100% { transform: translate(0, 0); opacity: 0.25; }
          35% { transform: translate(-40px, 150px); opacity: 1; }
          70% { transform: translate(20px, 280px); opacity: 0.35; }
        }
        @keyframes nd-5 {
          0%, 100% { transform: translate(0, 0); opacity: 0.15; }
          28% { transform: translate(30px, 90px); opacity: 0.8; }
          55% { transform: translate(-20px, 230px); opacity: 0.2; }
          82% { transform: translate(50px, 340px); opacity: 0.5; }
        }

        .hbg-n1 { animation: nd-1 24s ease-in-out infinite; }
        .hbg-n2 { animation: nd-2 28s ease-in-out infinite; }
        .hbg-n3 { animation: nd-3 20s ease-in-out infinite; }
        .hbg-n4 { animation: nd-4 32s ease-in-out infinite; }
        .hbg-n5 { animation: nd-5 26s ease-in-out infinite; }

        @keyframes scan-sweep {
          0%   { transform: translateX(-120%) skewX(-18deg); opacity: 0; }
          8%   { opacity: 0.3; }
          45%  { opacity: 0.1; }
          82%  { opacity: 0.3; }
          100% { transform: translateX(250%) skewX(-18deg); opacity: 0; }
        }
        .hbg-scan {
          animation: scan-sweep 10s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .hbg-n1, .hbg-n2, .hbg-n3, .hbg-n4, .hbg-n5,
          .hbg-scan { animation: none !important; opacity: 0.12 !important; }
        }
      `}</style>

      {/* 1. Deep field background */}
      <div className="absolute inset-0" style={{ backgroundColor: "#07111F" }} />

      {/* 2. Enhanced #525EA7 atmospheric glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 75% 60% at 50% 40%, rgba(82,94,167,0.09) 0%, transparent 65%),
            radial-gradient(ellipse 45% 40% at 25% 30%, rgba(107,123,200,0.035) 0%, transparent 50%),
            radial-gradient(ellipse 40% 35% at 75% 55%, rgba(82,94,167,0.045) 0%, transparent 50%)
          `,
        }}
      />

      {/* 3. Perspective engineering blueprint grid */}
      <svg
        className="absolute inset-0 w-full h-full hbg-perspective-grid"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="18%" stopColor="rgba(82,94,167,0.5)" />
            <stop offset="100%" stopColor="rgba(82,94,167,0.05)" />
          </linearGradient>
        </defs>
        {Array.from({ length: 21 }, (_, i) => {
          const t = (i / 20) * 2 - 1;
          const spanTop = 720;
          const spanBot = 720 * 0.1;
          return (
            <line
              key={`pv-${i}`}
              x1={720 + t * spanTop}
              y1={0}
              x2={720 + t * spanBot}
              y2={800}
              stroke="url(#gridFade)"
              strokeWidth="0.5"
            />
          );
        })}
        {Array.from({ length: 16 }, (_, i) => {
          const y = 20 + (i / 15) ** 2 * 760;
          return (
            <line
              key={`ph-${i}`}
              x1={0}
              y1={y}
              x2={1440}
              y2={y}
              stroke="url(#gridFade)"
              strokeWidth="0.5"
            />
          );
        })}
        <line x1={720} y1={0} x2={720} y2={800} stroke="rgba(82,94,167,0.06)" strokeWidth="0.5" />
      </svg>

      {/* 4. Animated glow nodes drifting along grid vectors */}
      <div className="absolute inset-0">
        <div className="hbg-node hbg-n1" style={{ left: '16%', top: '8%' }} />
        <div className="hbg-node hbg-n2" style={{ left: '78%', top: '12%' }} />
        <div className="hbg-node hbg-n3" style={{ left: '55%', top: '5%' }} />
        <div className="hbg-node hbg-n4" style={{ left: '35%', top: '15%' }} />
        <div className="hbg-node hbg-n5" style={{ left: '65%', top: '7%' }} />
      </div>

      {/* 5. Horizontal scanning light sweep */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-[48%] h-[80px] w-[400px] hbg-scan"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(82,94,167,0.035) 20%, rgba(82,94,167,0.07) 50%, rgba(82,94,167,0.035) 80%, transparent 100%)',
            filter: 'blur(30px)',
          }}
        />
      </div>

      {/* 6. Vignette — darker at edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(7,17,31,0.7) 100%)",
        }}
      />

      {/* 7. Data-point matrix — tiny engineering dots */}
      <div
        className="absolute inset-0 hbg-dot-matrix"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(82,94,167,0.35) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}

/* ── Main Component ── */
export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ══════════════════════════════════════════
          NAVIGATION — fixed, translucent, premium
          ══════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/[0.04]"
        style={{ backgroundColor: "rgba(7,17,31,0.85)" }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 group-hover:shadow-[0_0_12px_rgba(82,94,167,0.25)]"
              style={{ backgroundColor: "rgba(82,94,167,0.12)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#525EA7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-wide text-foreground/90">
              {APP_NAME}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              asChild
              className="text-muted-foreground hover:text-foreground text-sm h-9 px-4"
            >
              <Link to={ROUTES.login}>Sign In</Link>
            </Button>
            <Button asChild className="shadow-md h-9 text-sm px-5">
              <Link to={ROUTES.login}>
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          HERO
          ══════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">

        {/* ── Animated aerospace engineering background ── */}
        <HeroBackground />

        {/* ── Content ── */}
        <div className="mx-auto max-w-7xl px-4 md:px-8 w-full relative z-10 pt-20 pb-6">
          <div className="flex flex-col items-center text-center min-h-[55vh] justify-center">
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-[0.15em] mb-6 animate-slide-in-up-hero"
              style={{
                backgroundColor: "rgba(82,94,167,0.08)",
                border: "1px solid rgba(82,94,167,0.18)",
                color: "#8B97D0",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full animate-pulse-opacity" style={{ backgroundColor: "#525EA7" }} />
              AI-POWERED AVIATION
            </div>

            <h1 className="text-[clamp(2rem,5vw,4rem)] font-extrabold tracking-tight leading-[1.08] mb-6">
              <span className="text-foreground">AI-Powered</span>
              <br />
              <span style={{ color: "#525EA7" }}>Aviation Maintenance</span>
              <br />
              <span className="text-foreground">Intelligence</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-[540px] leading-relaxed tracking-wide mb-6">
              Predictive maintenance, real-time fleet health, and intelligent
              inspection insights — built for modern MRO operations.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                asChild
                className="shadow-lg hover:shadow-xl transition-all duration-300 px-9"
              >
                <Link to={ROUTES.login}>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="transition-all duration-300 px-9"
              >
                <a href="#features">
                  Watch Demo
                </a>
              </Button>
            </div>
          </div>

          {/* ── KPI Strip ── */}
          <div className="mt-10 md:mt-14">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5 rounded-2xl"
              style={{
                backgroundColor: "rgba(16,27,45,0.4)",
                border: "1px solid rgba(30,42,65,0.4)",
                backdropFilter: "blur(8px)",
              }}
            >
              {kpis.map((kpi, i) => (
                <div key={kpi.label} className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                      {kpi.value}
                    </p>
                    <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                      {kpi.label}
                    </p>
                  </div>
                  {i < kpis.length - 1 && (
                    <div className="h-8 w-px" style={{ backgroundColor: "rgba(82,94,167,0.15)" }} />
                  )}
                </div>
              ))}
              <div className="h-8 w-px" style={{ backgroundColor: "rgba(82,94,167,0.15)" }} />
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40" style={{ backgroundColor: "#10B981" }} />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: "#10B981" }} />
                </span>
                <div className="text-left">
                  <p className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-none">
                    24/7
                  </p>
                  <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase leading-tight mt-0.5">
                    AI Monitoring
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PRODUCT POSITIONING
          ══════════════════════════════════════════ */}
      <section className="relative border-t" style={{ borderColor: "rgba(30,42,65,0.4)" }}>
        <div className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(82,94,167,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(82,94,167,0.2) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28 text-center">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold tracking-[0.15em] mb-8"
            style={{
              backgroundColor: "rgba(82,94,167,0.08)",
              border: "1px solid rgba(82,94,167,0.18)",
              color: "#8B97D0",
            }}
          >
            <ShieldCheck className="h-3 w-3" />
            ENTERPRISE-GRADE MRO PLATFORM
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1] max-w-3xl mx-auto">
            Everything your <span style={{ color: "#525EA7" }}>MRO team</span> needs
          </h2>

          <p className="mx-auto mt-6 max-w-[580px] text-base md:text-lg text-muted-foreground leading-relaxed">
            From the hangar to the boardroom, one platform connects your entire
            maintenance operation with AI-powered insights and automation.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES
          ══════════════════════════════════════════ */}
      <section id="features" className="relative">
        <div className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(82,94,167,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(82,94,167,0.2) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8 pb-24 md:pb-32">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative rounded-xl p-6 transition-all duration-300 hover:-translate-y-[3px]"
                style={{
                  backgroundColor: "rgba(16,27,45,0.5)",
                  border: "1px solid rgba(30,42,65,0.4)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse at 50% 0%, rgba(82,94,167,0.08) 0%, transparent 70%)",
                  }}
                />

                <div className="relative mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "rgba(82,94,167,0.1)" }}
                >
                  <f.icon className="h-4.5 w-4.5" style={{ color: "#8B97D0" }} />
                </div>

                <h3 className="relative text-base font-semibold text-foreground mb-2">
                  {f.title}
                </h3>

                <p className="relative text-sm text-muted-foreground leading-relaxed">
                  {f.description}
                </p>

                <div className="relative mt-4 flex items-center gap-1 text-xs font-medium transition-colors duration-200 group-hover:gap-1.5"
                  style={{ color: "#525EA7" }}
                >
                  <span>Learn more</span>
                  <ChevronRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA
          ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-t" style={{ borderColor: "rgba(30,42,65,0.4)" }}>
        <div className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(82,94,167,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(82,94,167,0.2) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />
        <div className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, rgba(82,94,167,0.04) 0%, transparent 60%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.08] max-w-3xl mx-auto">
            Ready to transform your <span style={{ color: "#525EA7" }}>maintenance operations?</span>
          </h2>

          <p className="mx-auto mt-6 max-w-[560px] text-base md:text-lg text-muted-foreground leading-relaxed">
            Bring predictive intelligence, real-time fleet visibility, and smarter
            maintenance workflows into one platform.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-all duration-300 px-9">
              <Link to={ROUTES.login}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="transition-all duration-300 px-9">
              <a href="#features">Explore Platform</a>
            </Button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════ */}
      <footer className="border-t px-4 md:px-8 py-8" style={{ borderColor: "rgba(30,42,65,0.3)" }}>
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#525EA7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" />
              <path d="M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors duration-200">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors duration-200">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}