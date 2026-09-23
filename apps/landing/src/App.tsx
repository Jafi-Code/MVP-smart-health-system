const PATIENT_APP_URL =
  import.meta.env.VITE_PATIENT_APP_URL || "http://localhost:5175";
const CLINIC_APP_URL =
  import.meta.env.VITE_CLINIC_APP_URL || "http://localhost:5174";

export default function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <Problem />
      <FailedAttempts />
      <Solution />
      <DemoLinks />
      <Waitlist />
      <Footer />
    </div>
  );
}

/* ---------- Navigation ---------- */

function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2">
          <img
            src="/logo.jpg"
            alt="Smart Health System logo"
            className="h-9 w-9 rounded-full object-contain"
          />
          <span className="text-lg font-bold text-slate-900">
            Smart Health System
          </span>
        </a>
        <div className="hidden gap-8 sm:flex">
          <a
            href="#problem"
            className="text-sm font-medium text-slate-600 hover:text-primary"
          >
            Problem
          </a>
          <a
            href="#solution"
            className="text-sm font-medium text-slate-600 hover:text-primary"
          >
            Solution
          </a>
          <a
            href="#demo"
            className="text-sm font-medium text-slate-600 hover:text-primary"
          >
            Demo
          </a>
        </div>
        <a
          href={`${PATIENT_APP_URL}/register`}
          className="btn-primary !px-4 !py-2 !text-sm"
        >
          Get Started
        </a>
      </div>
    </nav>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-surface">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full bg-teal-50 px-4 py-1 text-sm font-medium text-secondary">
            Built for South Africa's public healthcare reality
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Bring order, dignity, and efficiency back to public healthcare.
          </h1>
          <p className="mt-6 text-xl text-slate-600">
            Smart Health System is an offline-first patient flow platform that
            works during load shedding, via USSD, and across the full 4–7 queue
            journey that patients endure every day.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={`${PATIENT_APP_URL}/register`}
              className="btn-primary w-full sm:w-auto"
            >
              Get Started — It's Free
            </a>
            <a
              href={`${PATIENT_APP_URL}/login`}
              className="btn-secondary w-full sm:w-auto"
            >
              Sign In
            </a>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Fast care. Smart care. Everywhere.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Problem ---------- */

function Problem() {
  const stats = [
    { value: "89%", label: "of patients say waiting times are too long" },
    { value: "5h 25m", label: "average wait in the Free State" },
    { value: "4–7", label: "separate queues per patient visit" },
    { value: "51.6%", label: "of clinics have no backup power" },
  ];

  return (
    <section id="problem" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="section-heading">
            The problem is not the line. It's the silence.
          </h2>
          <p className="section-subheading">
            Every day, thousands of South Africans stand in clinic queues for
            hours — not knowing if they'll be seen, not knowing how long they'll
            wait. That silence costs people their jobs, their school hours, and
            their dignity.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-surface p-6 text-center"
            >
              <div className="text-3xl font-extrabold text-primary">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-16 mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-surface p-8">
          <h3 className="text-xl font-bold text-slate-900">Meet Gogo Maria</h3>
          <p className="mt-3 text-slate-600">
            She's 67. She manages hypertension and diabetes. She's the primary
            caregiver for three grandchildren. Every month, she wakes at 3am,
            travels 5km, and waits up to <strong>8 hours</strong> — sometimes
            leaving without being seen, because her file is lost again.
          </p>
          <p className="mt-4 text-slate-600">
            This isn't a statistic. It's a daily reality for millions of South
            Africans. And it's the problem we're solving.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Failed Attempts ---------- */

function FailedAttempts() {
  const failures = [
    {
      name: "IPQMS (Gauteng, 2024)",
      failure:
        "No backup power. Failed during load shedding. Users report it made waits worse.",
      lesson: "Offline-first is not optional — it is essential.",
    },
    {
      name: "Electronic Patient System (Joburg, 2015)",
      failure: "Abandoned. The government underestimated the work required.",
      lesson: "Simple beats complex. Staff cannot be forced into hard systems.",
    },
    {
      name: "Speedy Q (Edenvale Hospital)",
      failure:
        "78% reduction in waits — but it never scaled beyond one department.",
      lesson: "Simple interventions work — but they need a scalable model.",
    },
    {
      name: "Gauteng eHealth (12-year effort)",
      failure: "Only 2–5% of records digitised. Adoption collapsed.",
      lesson: "Training and simplicity matter more than technology.",
    },
  ];

  return (
    <section className="bg-slate-900 py-20 sm:py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            This problem has been solved before — and failed every time.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            We studied every attempt to solve clinic queues in South Africa. We
            learned from every failure. Here's what we found.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {failures.map((f) => (
            <div
              key={f.name}
              className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6"
            >
              <h3 className="text-lg font-bold text-white">{f.name}</h3>
              <p className="mt-2 text-sm text-slate-300">
                <span className="font-semibold text-red-400">
                  Why it failed:{" "}
                </span>
                {f.failure}
              </p>
              <p className="mt-3 text-sm text-teal-300">
                <span className="font-semibold">What we learned: </span>
                {f.lesson}
              </p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-2xl text-center text-lg font-medium text-teal-300">
          We didn't just build a solution. We built one that avoids every single
          mistake they made.
        </p>
      </div>
    </section>
  );
}

/* ---------- Solution ---------- */

function Solution() {
  const pillars = [
    {
      title: "Offline-first",
      body: "Works during load shedding and in rural clinics. Data saves locally and syncs automatically when connectivity returns.",
    },
    {
      title: "Multi-queue tracking",
      body: "Reflects the real 4–7 station journey of a South African clinic — registration, vitals, consultation, pharmacy.",
    },
    {
      title: "USSD access",
      body: "No smartphone required. Patients book, check their queue position, and receive reminders on any basic phone.",
    },
  ];

  return (
    <section id="solution" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="section-heading">What we're doing differently</h2>
          <p className="section-subheading">
            Three design decisions no other solution combines — each one
            directly addresses a reason every previous attempt failed.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              className="rounded-2xl border border-slate-200 bg-surface p-8"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-bold">
                {i + 1}
              </div>
              <h3 className="mt-6 text-lg font-bold text-slate-900">
                {p.title}
              </h3>
              <p className="mt-3 text-sm text-slate-600">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Demo Links ---------- */

function DemoLinks() {
  return (
    <section id="demo" className="bg-surface py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="section-heading">Try it live</h2>
          <p className="section-subheading">
            SHS is not a concept. It's a working system. Open any app below.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          <a
            href={`${PATIENT_APP_URL}/register`}
            className="group rounded-2xl border-2 border-slate-200 bg-white p-8 transition hover:border-primary hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
              📱
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Patient App
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Book an appointment, track your queue position, and see your
              upcoming visits.
            </p>
            <div className="mt-4 text-sm font-semibold text-primary group-hover:underline">
              Open patient app →
            </div>
          </a>

          <a
            href={`${CLINIC_APP_URL}/login`}
            className="group rounded-2xl border-2 border-slate-200 bg-white p-8 transition hover:border-primary hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-2xl">
              🏥
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Clinic Dashboard
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Manage today's appointments, update queue status, and view daily
              reports. For clinic staff.
            </p>
            <div className="mt-4 text-sm font-semibold text-secondary group-hover:underline">
              Open clinic dashboard →
            </div>
          </a>
        </div>

        {/* Demo credentials box */}
        <div className="mt-10 mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6">
          <h4 className="text-sm font-bold text-slate-900">Demo credentials</h4>
          <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Patient
              </div>
              <div className="mt-1 font-mono text-xs text-slate-700">
                0821234567
              </div>
              <div className="font-mono text-xs text-slate-700">
                PatientPass123!
              </div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Receptionist
              </div>
              <div className="mt-1 font-mono text-xs text-slate-700">
                reception@vut-clinic.test
              </div>
              <div className="font-mono text-xs text-slate-700">
                StaffPass123!
              </div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Nurse
              </div>
              <div className="mt-1 font-mono text-xs text-slate-700">
                nurse@vut-clinic.test
              </div>
              <div className="font-mono text-xs text-slate-700">
                StaffPass123!
              </div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Manager
              </div>
              <div className="mt-1 font-mono text-xs text-slate-700">
                manager@vut-clinic.test
              </div>
              <div className="font-mono text-xs text-slate-700">
                StaffPass123!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Waitlist / CTA ---------- */

function Waitlist() {
  return (
    <section id="waitlist" className="bg-primary py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 text-center text-white">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to skip the queue?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
          Create your free account in under 60 seconds. Book your first
          appointment in less than two minutes.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={`${PATIENT_APP_URL}/register`}
            className="rounded-lg bg-teal-500 px-8 py-3 text-base font-semibold text-white transition hover:bg-teal-400"
          >
            Create Free Account
          </a>
          <a
            href={`${PATIENT_APP_URL}/login`}
            className="rounded-lg border-2 border-white/30 px-8 py-3 text-base font-semibold text-white transition hover:bg-white/10"
          >
            Sign In
          </a>
        </div>

        <p className="mt-6 text-sm text-blue-200">
          No credit card. No fees. Public clinic patients always free.
        </p>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Smart Health System"
              className="h-8 w-8 rounded-full object-contain"
            />
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Smart Health System
              </div>
            </div>
          </div>
          <div className="text-center sm:text-right"></div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          © 2026 Smart Health System. Offline-first patient flow management for
          South Africa.
        </div>
      </div>
    </footer>
  );
}
