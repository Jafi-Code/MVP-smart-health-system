const PATIENT_APP_URL =
  import.meta.env.VITE_PATIENT_APP_URL || "http://localhost:5175";
const CLINIC_APP_URL =
  import.meta.env.VITE_CLINIC_APP_URL || "http://localhost:5174";

const ArrowUpRight = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
    aria-hidden="true"
  >
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

const ArrowRight = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

const Check = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
    aria-hidden="true"
  >
    <path d="m5 12 4 4L19 6" />
  </svg>
);

const WifiOff = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
    aria-hidden="true"
  >
    <path d="M3 8.5a14.7 14.7 0 0 1 13.4-1.4" />
    <path d="M5.5 12a10.8 10.8 0 0 1 8.2-1.9" />
    <path d="M8.4 15.5a6.2 6.2 0 0 1 3.5-.8" />
    <path d="M3 3l18 18" />
    <path d="M16.8 14.4c.7.3 1.4.7 2 1.2" />
    <path d="M20.2 11.6a10.7 10.7 0 0 1 .8.6" />
  </svg>
);

const Queue = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
    aria-hidden="true"
  >
    <rect x="4" y="5" width="16" height="4" rx="1" />
    <rect x="4" y="10" width="16" height="4" rx="1" />
    <rect x="4" y="15" width="16" height="4" rx="1" />
  </svg>
);

const Route = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
    aria-hidden="true"
  >
    <circle cx="6" cy="6" r="2" />
    <circle cx="18" cy="18" r="2" />
    <path d="M8 6h4a4 4 0 0 1 4 4v2a4 4 0 0 0 4 4h-2" />
  </svg>
);

const Shield = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 3 19 6v5c0 4.6-2.7 8.1-7 10-4.3-1.9-7-5.4-7-10V6l7-3Z" />
    <path d="m8.7 12 2.1 2.1 4.6-4.6" />
  </svg>
);

const Activity = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
    aria-hidden="true"
  >
    <path d="M3 12h4l2.2-5.5L13 18l2.2-5H21" />
  </svg>
);

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 selection:bg-teal-200 selection:text-slate-950">
      <Nav />
      <Hero />
      <ProofStrip />
      <Problem />
      <WhyDifferent />
      <Journey />
      <Resilience />
      <ReferralLoop />
      <GetStarted />
      <Security />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-slate-50/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <a
          href="#"
          className="flex items-center gap-3"
          aria-label="Smart Health System home"
        >
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <img
              src="/logo.jpg"
              alt=""
              className="h-full w-full object-contain"
            />
          </div>
          <div className="leading-none">
            <div className="text-[15px] font-bold tracking-tight text-slate-950">
              Smart Health System
            </div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Patient flow infrastructure
            </div>
          </div>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          <a
            href="#why"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            Why SHS
          </a>
          <a
            href="#journey"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            Journey
          </a>
          <a
            href="#resilience"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            Resilience
          </a>
          <a
            href="#get-started"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            Get Started
          </a>
        </nav>

        <a
          href={`${PATIENT_APP_URL}/register`}
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-950"
        >
          Get started
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-14 lg:px-8 lg:pb-28 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-800">
              Built for real clinic conditions
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-[76px]">
              Keep the patient journey moving.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              SHS connects check-in, queues, referrals and outcomes into one
              clinic journey — with essential workflow designed to keep running
              when connectivity fails.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={`${PATIENT_APP_URL}/register`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-950"
              >
                Get started
                <ArrowRight />
              </a>
              <a
                href={`${CLINIC_APP_URL}/login`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:border-slate-500"
              >
                Open clinic dashboard
                <ArrowUpRight />
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-teal-500" />
                Patient flow
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-800" />
                Offline operation
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                Referral visibility
              </span>
            </div>
          </div>

          <HeroSystemCard />
        </div>
      </div>
    </section>
  );
}

function HeroSystemCard() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute -right-10 -top-10 hidden h-40 w-40 rounded-full border border-teal-200/70 lg:block" />
      <div className="absolute -bottom-8 -left-8 hidden h-28 w-28 rounded-full border border-slate-300/70 lg:block" />

      <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.16)] sm:p-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
              Clinic flow
            </div>
            <div className="mt-1 text-sm font-semibold text-white">
              Today · 09:42
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-[11px] font-semibold text-amber-200">
            <span className="h-2 w-2 rounded-full bg-amber-300" />
            Working offline
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-white/45">
                  Patient journey
                </div>
                <div className="mt-1 text-lg font-semibold text-white">
                  Student visit #042
                </div>
              </div>
              <span className="rounded-full bg-teal-400/10 px-2.5 py-1 text-[10px] font-bold text-teal-300">
                ACTIVE
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {[
                ["Check-in", true],
                ["Triage", true],
                ["Consultation", false],
                ["Outcome", false],
              ].map(([label, done], index) => (
                <div key={label as string} className="flex items-center gap-3">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border ${done ? "border-teal-300/30 bg-teal-300/10 text-teal-300" : "border-white/10 bg-white/[0.03] text-white/25"}`}
                  >
                    {done ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="text-[10px] font-bold">
                        0{index + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div
                      className={`text-sm font-semibold ${done ? "text-white" : "text-white/45"}`}
                    >
                      {label}
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-white/5">
                      <div
                        className={`h-full rounded-full ${done ? "w-full bg-teal-300" : "w-1/3 bg-white/10"}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <MiniMetric label="Waiting now" value="08" detail="patients" />
            <MiniMetric
              label="Referral"
              value="01"
              detail="awaiting outcome"
              accent="orange"
            />
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-white/45">
                <WifiOff className="h-4 w-4" />
                Connection state
              </div>
              <div className="mt-2 text-sm font-semibold text-white">
                Local workflow active
              </div>
              <div className="mt-1 text-xs leading-5 text-white/45">
                Changes are stored locally and ready to sync when connected.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-teal-400/15 bg-teal-400/[0.06] px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-300/10 text-teal-300">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                3 changes waiting to sync
              </div>
              <div className="text-[11px] text-white/40">
                No patient workflow lost
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-teal-300">
            Resilient
          </span>
        </div>
      </div>
    </div>
  );
}

function MiniMetric({
  label,
  value,
  detail,
  accent = "green",
}: {
  label: string;
  value: string;
  detail: string;
  accent?: "green" | "orange";
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
      <div className="text-xs font-semibold text-white/45">{label}</div>
      <div className="mt-2 flex items-end gap-2">
        <span
          className={`text-3xl font-semibold tracking-tight ${accent === "green" ? "text-white" : "text-orange-300"}`}
        >
          {value}
        </span>
        <span className="pb-1 text-xs text-white/35">{detail}</span>
      </div>
    </div>
  );
}

function ProofStrip() {
  const stats = [
    {
      value: "129 min",
      label: "observed average waiting time nationally",
      source: "SAHRC 2024–25",
    },
    {
      value: "195 min",
      label: "observed average in Gauteng",
      source: "SAHRC 2024–25",
    },
    {
      value: "87%",
      label: "of sampled referral letters missing key clinical information",
      source: "SA study · n=85",
    },
  ];

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-0 px-5 sm:px-6 lg:grid-cols-3 lg:px-8">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`px-0 py-7 sm:py-8 lg:px-8 ${index !== 0 ? "border-t border-slate-200 lg:border-l lg:border-t-0" : ""}`}
          >
            <div className="text-3xl font-semibold tracking-tight text-slate-950">
              {stat.value}
            </div>
            <div className="mt-1 max-w-sm text-sm leading-6 text-slate-600">
              {stat.label}
            </div>
            <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              {stat.source}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section id="problem" className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-700">
              The problem
            </div>
            <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl">
              The queue is visible. The broken journey isn't.
            </h2>
          </div>

          <div>
            <p className="max-w-3xl text-xl leading-8 text-slate-700">
              A patient rarely waits in one place. They move between
              registration, triage, consultation, pharmacy, laboratory services
              and referrals. Each handoff creates another opportunity for delay,
              uncertainty or lost information.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <ProblemPoint
                title="Uncertainty"
                text="Patients cannot reliably see what happens next."
              />
              <ProblemPoint
                title="Fragmented flow"
                text="Different service points create separate queues and handoffs."
              />
              <ProblemPoint
                title="Weak visibility"
                text="Staff and managers may struggle to see where the process is stuck."
              />
              <ProblemPoint
                title="Connectivity gaps"
                text="When digital services depend on the internet, outages can interrupt the workflow."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemPoint({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start gap-3">
        <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-slate-950" />
        <div>
          <h3 className="text-sm font-bold text-slate-950">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
        </div>
      </div>
    </div>
  );
}

function WhyDifferent() {
  const items = [
    {
      icon: Queue,
      title: "Manage the journey",
      text: "Treat the patient journey as one connected flow instead of a collection of isolated queues.",
    },
    {
      icon: WifiOff,
      title: "Keep working offline",
      text: "Core clinic actions can continue locally and synchronise when the connection returns.",
    },
    {
      icon: Route,
      title: "Follow the referral",
      text: "Track the referral from creation through arrival and outcome instead of treating it as a dead-end document.",
    },
    {
      icon: Activity,
      title: "See the bottleneck",
      text: "Turn everyday workflow events into visibility about where patients are waiting and where action is needed.",
    },
  ];

  return (
    <section id="why" className="bg-slate-950 py-20 text-white sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-300">
            Why SHS
          </div>
          <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
            Not another queue app.
            <br />A connected clinic journey.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            We are not trying to replace every healthcare system already in use.
            SHS is designed as the workflow layer around the patient journey.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-[24px] border border-white/10 bg-white/10 md:grid-cols-2">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-slate-950 p-7 sm:p-9">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-teal-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/25">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-8 text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-7 text-slate-400">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Journey() {
  const stages = [
    {
      n: "01",
      title: "Check in",
      text: "Create the visit and give the patient a clear starting point.",
    },
    {
      n: "02",
      title: "Move through care",
      text: "Staff update the same patient journey as the visit progresses.",
    },
    {
      n: "03",
      title: "Refer when needed",
      text: "Create a structured referral with a visible status.",
    },
    {
      n: "04",
      title: "Reach an outcome",
      text: "Close the loop when the patient arrives, receives care and has an outcome.",
    },
  ];

  return (
    <section id="journey" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[.78fr_1.22fr] lg:items-end">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-700">
              One patient. One journey.
            </div>
            <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Every handoff stays visible.
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            SHS turns each step into a clear state so patients and clinic staff
            can see what has happened, what happens next and where a visit
            currently stands.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stages.map((stage, index) => (
            <div
              key={stage.n}
              className="relative rounded-[22px] border border-slate-200 bg-slate-50 p-6"
            >
              {index < stages.length - 1 && (
                <div className="absolute right-[-20px] top-10 z-10 hidden h-px w-10 bg-slate-300 xl:block" />
              )}
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                {stage.n}
              </div>
              <div className="mt-8 text-lg font-semibold text-slate-950">
                {stage.title}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {stage.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Resilience() {
  return (
    <section id="resilience" className="bg-blue-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[30px] border border-teal-200 bg-slate-950 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
          <div className="grid lg:grid-cols-[.9fr_1.1fr]">
            <div className="border-b border-white/10 p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-200">
                Resilience by design
              </div>
              <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                When the network goes down, the clinic shouldn't.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
                SHS is designed so essential workflow can continue locally.
                Changes are kept on the device and synchronised once
                connectivity returns.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/70">
                  Local continuity
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/70">
                  Later sync
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/70">
                  Visible connection state
                </span>
              </div>
            </div>

            <div className="p-7 sm:p-10 lg:p-12">
              <div className="grid gap-3">
                <ResilienceStep
                  label="ONLINE"
                  text="Clinic and cloud are connected."
                  state="Connected"
                />
                <ResilienceArrow />
                <ResilienceStep
                  label="OFFLINE"
                  text="Core workflow continues locally."
                  state="Working locally"
                  warn
                />
                <ResilienceArrow />
                <ResilienceStep
                  label="RESTORED"
                  text="Queued changes synchronise."
                  state="Syncing"
                />
              </div>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
                  The product principle
                </div>
                <div className="mt-2 text-xl font-semibold text-white">
                  The internet should improve the workflow — not decide whether
                  it works.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResilienceStep({
  label,
  text,
  state,
  warn = false,
}: {
  label: string;
  text: string;
  state: string;
  warn?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
          {label}
        </div>
        <div className="mt-1 text-sm font-semibold text-white">{text}</div>
      </div>
      <span
        className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold ${warn ? "bg-amber-400/10 text-amber-200" : "bg-teal-400/10 text-teal-200"}`}
      >
        {state}
      </span>
    </div>
  );
}

function ResilienceArrow() {
  return (
    <div className="flex justify-center text-white/25">
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M12 5v14" />
        <path d="m7 14 5 5 5-5" />
      </svg>
    </div>
  );
}

function ReferralLoop() {
  return (
    <section className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:items-center">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-700">
              Close the referral loop
            </div>
            <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl">
              A referral is not finished when you press "send."
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              SHS keeps the referral visible across the handoff, so the
              originating clinic can see whether it was received and what
              happened to the patient.
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["01", "Created"],
                ["02", "Sent"],
                ["03", "Received"],
                ["04", "Accepted"],
                ["05", "Patient arrived"],
                ["06", "Outcome"],
              ].map(([n, label], index) => (
                <div
                  key={n}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-[10px] font-bold text-white">
                    {n}
                  </div>
                  <div className="text-sm font-semibold text-slate-950">
                    {label}
                  </div>
                  {index < 5 && (
                    <div className="ml-auto hidden text-slate-300 lg:block">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4">
              <Route className="h-5 w-5 text-orange-700" />
              <div className="text-sm font-medium text-orange-900">
                The receiving facility becomes part of the same visible journey.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GetStarted() {
  return (
    <section id="get-started" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-700">
              See it, don't take our word for it
            </div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Get started with SHS.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-slate-600">
            Book a visit in the patient app, then open the clinic dashboard to
            see the same journey from the staff side.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <GetStartedCard
            eyebrow="PATIENT"
            title="Know where you are."
            text="Book a visit, check in and follow the status of your journey."
            href={`${PATIENT_APP_URL}/register`}
            action="Get started"
            tone="dark"
          />
          <GetStartedCard
            eyebrow="CLINIC"
            title="Know what is happening."
            text="View appointments, move patients through the workflow and monitor the day."
            href={`${CLINIC_APP_URL}/login`}
            action="Open clinic dashboard"
            tone="light"
          />
        </div>

        <div className="mt-6 rounded-[22px] border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Pilot note
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use synthetic patient data in demonstrations. Production
                deployment would require appropriate clinical governance, access
                controls and institutional approval.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
              <Shield className="h-4 w-4" /> Security considered from the start
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GetStartedCard({
  eyebrow,
  title,
  text,
  href,
  action,
  tone,
}: {
  eyebrow: string;
  title: string;
  text: string;
  href: string;
  action: string;
  tone: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <a
      href={href}
      className={`group relative overflow-hidden rounded-[28px] border p-7 transition duration-300 sm:p-9 ${dark ? "border-slate-900 bg-slate-950 text-white hover:-translate-y-1" : "border-slate-200 bg-slate-50 text-slate-950 hover:-translate-y-1 hover:border-slate-300"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={`text-[10px] font-bold uppercase tracking-[0.18em] ${dark ? "text-teal-300" : "text-teal-700"}`}
        >
          {eyebrow}
        </span>
        <ArrowUpRight
          className={`h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${dark ? "text-white/40" : "text-slate-400"}`}
        />
      </div>
      <h3 className="mt-16 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        {title}
      </h3>
      <p
        className={`mt-3 max-w-md text-base leading-7 ${dark ? "text-slate-300" : "text-slate-600"}`}
      >
        {text}
      </p>
      <div
        className={`mt-8 inline-flex items-center gap-2 text-sm font-semibold ${dark ? "text-white" : "text-slate-950"}`}
      >
        {action}
        <ArrowRight />
      </div>
    </a>
  );
}

function Security() {
  const controls = [
    "Authentication and role-based access",
    "Clinic-level access checks",
    "Secure data transfer",
    "Audit fields for important changes",
  ];

  return (
    <section className="border-y border-slate-200 bg-slate-50 py-14 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Security by design
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-slate-950">
            Healthcare data needs restraint, not hype.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
            SHS treats security as part of the product architecture. The
            prototype is not presented as formally certified or compliant;
            deployment would require full security and governance assessment.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {controls.map((control) => (
            <div
              key={control}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <Check />
              </div>
              <span className="text-sm font-semibold text-slate-800">
                {control}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="bg-slate-950 py-20 text-white sm:py-24">
      <div className="mx-auto max-w-5xl px-5 text-center sm:px-6">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/60">
          Built to be tested in the real world
        </div>
        <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
          Start with one clinic. Prove the journey. Scale what works.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          SHS is designed to begin with a focused pilot, measure what changes
          and expand only when the evidence supports it.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={`${PATIENT_APP_URL}/register`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Get started <ArrowRight />
          </a>
          <a
            href={`${CLINIC_APP_URL}/login`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
          >
            Open clinic dashboard <ArrowUpRight />
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl border-t border-white/10 px-5 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white">
                <img
                  src="/logo.jpg"
                  alt=""
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <div className="text-sm font-semibold">Smart Health System</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                  Resilient patient-flow infrastructure
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-white/45">
            <a href="#why" className="transition hover:text-white">
              Why SHS
            </a>
            <a href="#journey" className="transition hover:text-white">
              Journey
            </a>
            <a href="#resilience" className="transition hover:text-white">
              Resilience
            </a>
            <a href="#get-started" className="transition hover:text-white">
              Get Started
            </a>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-[11px] text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Smart Health System</span>
          <span>When the network goes down, the clinic shouldn't.</span>
        </div>
      </div>
    </footer>
  );
}
