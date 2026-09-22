import { useEffect, useState } from "react";
import { api, type Appointment, ApiError } from "../lib/api";

export default function Dashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setError("");
    try {
      const data = await api.getTodayAppointments();
      setAppointments(data.appointments);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = {
    total: appointments.length,
    scheduled: appointments.filter((a) => a.status === "SCHEDULED").length,
    checkedIn: appointments.filter((a) => a.status === "CHECKED_IN").length,
    inConsultation: appointments.filter((a) => a.status === "IN_CONSULTATION")
      .length,
    done: appointments.filter((a) => a.status === "DONE").length,
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Today's Overview</h1>
        <p className="mt-1 text-sm text-slate-500">
          {new Date().toLocaleDateString("en-ZA", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total" value={stats.total} color="slate" />
        <StatCard label="Waiting" value={stats.checkedIn} color="amber" />
        <StatCard
          label="In Consultation"
          value={stats.inConsultation}
          color="blue"
        />
        <StatCard label="Done" value={stats.done} color="green" />
      </div>

      {/* Appointment list */}
      <div className="mt-8 card">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Today's Appointments
          </h2>
          <button onClick={loadData} className="btn-ghost !py-1.5 !px-3">
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-sm text-slate-500">
            Loading...
          </div>
        ) : appointments.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">
            No appointments scheduled for today.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Reason</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr
                    key={appt.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-3 font-medium text-slate-900">
                      {appt.time}
                    </td>
                    <td className="py-3">
                      <div className="font-medium text-slate-900">
                        {appt.patient.name}
                      </div>
                      {appt.patient.phone && (
                        <div className="text-xs text-slate-500">
                          {appt.patient.phone}
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-slate-600">
                      {appt.reason || "—"}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={appt.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────
function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "slate" | "amber" | "blue" | "green";
}) {
  const colors = {
    slate: "bg-slate-100 text-slate-700",
    amber: "bg-amber-100 text-amber-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
  };

  return (
    <div className="card !p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div
        className={`mt-2 inline-flex items-center justify-center rounded-lg px-3 py-1 text-2xl font-bold ${colors[color]}`}
      >
        {value}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
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
    IN_CONSULTATION: "In Consultation",
    DONE: "Done",
    CANCELLED: "Cancelled",
    NO_SHOW: "No Show",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] || styles.SCHEDULED
      }`}
    >
      {labels[status] || status}
    </span>
  );
}
