import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, type Appointment, ApiError } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAppointments = async () => {
    setError("");
    try {
      const data = await api.getMyAppointments();
      setAppointments(data.appointments);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          logout();
          navigate("/login");
          return;
        }
        setError(err.message);
      } else setError("Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const today = new Date().toISOString().split("T")[0];

  const todayAppointments = appointments.filter(
    (a) => a.date.split("T")[0] === today && a.status !== "CANCELLED",
  );

  const upcomingAppointments = appointments.filter(
    (a) => a.date.split("T")[0] > today && a.status === "SCHEDULED",
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary to-blue-800 px-6 pb-20 pt-8 text-white">
        <div className="mx-auto max-w-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100">Welcome back,</p>
              <h1 className="text-2xl font-bold">{user?.name}</h1>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur hover:bg-white/20"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto -mt-14 max-w-lg space-y-5 px-6 pb-12">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Primary CTA */}
        <Link
          to="/book"
          className="card flex items-center gap-4 transition hover:border-primary hover:shadow-md"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl">
            📅
          </div>
          <div className="flex-1">
            <div className="font-bold text-slate-900">Book Appointment</div>
            <div className="text-sm text-slate-500">
              Choose a clinic and pick a time
            </div>
          </div>
          <div className="text-2xl text-slate-300">›</div>
        </Link>

        {/* Today's appointment */}
        {todayAppointments.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
              Today
            </h2>
            <div className="space-y-3">
              {todayAppointments.map((appt) => (
                <Link
                  key={appt.id}
                  to={`/queue/${appt.clinic.id}?date=${appt.date.split("T")[0]}`}
                  className="card block transition hover:border-primary hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-900">
                        {appt.clinic.name}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        {appt.time} • {appt.reason || "No reason given"}
                      </div>
                    </div>
                    <StatusBadge status={appt.status} />
                  </div>
                  {appt.queuePosition && appt.status === "SCHEDULED" && (
                    <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                      You are number <strong>{appt.queuePosition}</strong> in
                      the queue — tap to track
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming */}
        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
            Upcoming
          </h2>
          {isLoading ? (
            <div className="card py-8 text-center text-sm text-slate-500">
              Loading...
            </div>
          ) : upcomingAppointments.length === 0 &&
            todayAppointments.length === 0 ? (
            <div className="card py-10 text-center">
              <div className="text-4xl">📭</div>
              <p className="mt-3 text-sm font-medium text-slate-700">
                No appointments yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Book your first visit to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((appt) => (
                <div key={appt.id} className="card">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-900">
                        {appt.clinic.name}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        {new Date(appt.date).toLocaleDateString("en-ZA", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        at {appt.time}
                      </div>
                    </div>
                    <StatusBadge status={appt.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    SCHEDULED: "bg-slate-100 text-slate-700",
    CHECKED_IN: "bg-amber-100 text-amber-800",
    IN_CONSULTATION: "bg-blue-100 text-blue-800",
    DONE: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-700",
    NO_SHOW: "bg-red-100 text-red-700",
  };
  const labels: Record<string, string> = {
    SCHEDULED: "Scheduled",
    CHECKED_IN: "Checked In",
    IN_CONSULTATION: "In Consult",
    DONE: "Done",
    CANCELLED: "Cancelled",
    NO_SHOW: "Missed",
  };
  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] || styles.SCHEDULED
      }`}
    >
      {labels[status] || status}
    </span>
  );
}
