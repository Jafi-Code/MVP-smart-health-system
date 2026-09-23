import { useEffect, useState } from "react";
import { api, type DailyReport, ApiError } from "../lib/api";

export default function Reports() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [report, setReport] = useState<DailyReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = async () => {
    setError("");
    setIsLoading(true);
    try {
      const data = await api.getDailyReport(date);
      setReport(data);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to load report");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [date]);

  const handleDownloadCSV = () => {
    api.downloadDailyReportCSV(date);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Daily Report</h1>
          <p className="mt-1 text-sm text-slate-500">
            Full activity summary for the selected day
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
            className="input !w-auto"
          />
          <button onClick={loadReport} className="btn-ghost">
            Refresh
          </button>
          <button
            onClick={handleDownloadCSV}
            disabled={!report}
            className="btn-primary disabled:opacity-50"
          >
            Download CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="card py-12 text-center text-sm text-slate-500">
          Loading report...
        </div>
      ) : !report ? (
        <div className="card py-12 text-center text-sm text-slate-500">
          No report available.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <StatCard label="Total" value={report.summary.totalAppointments} />
            <StatCard
              label="Completed"
              value={report.summary.completed}
              color="green"
            />
            <StatCard
              label="Waiting"
              value={report.summary.stillWaiting}
              color="amber"
            />
            <StatCard
              label="No-Shows"
              value={report.summary.noShows}
              color="red"
            />
            <StatCard
              label="Cancelled"
              value={report.summary.cancelled}
              color="red"
            />
            <StatCard
              label="Completion"
              value={`${report.summary.completionRate}%`}
              color="blue"
            />
          </div>

          {/* Wait times */}
          <div className="card">
            <h2 className="mb-4 text-lg font-bold text-slate-900">
              Average Wait Times
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <MetricRow
                label="Total visit time"
                value={`${report.waitTimes.averageTotalMinutes} min`}
              />
              <MetricRow
                label="Triage → Consult"
                value={`${report.waitTimes.averageTriageToConsultMinutes} min`}
              />
              <MetricRow
                label="Consult → Done"
                value={`${report.waitTimes.averageConsultToDoneMinutes} min`}
              />
            </div>
          </div>

          {/* Station activity */}
          <div className="card">
            <h2 className="mb-4 text-lg font-bold text-slate-900">
              Station Activity
            </h2>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-3 font-medium">Station</th>
                  <th className="pb-3 font-medium">Patients Processed</th>
                </tr>
              </thead>
              <tbody>
                {report.stationActivity.map((s) => (
                  <tr
                    key={s.station}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-3 font-medium text-slate-900">
                      {s.station}
                    </td>
                    <td className="py-3 text-slate-700">
                      {s.patientsProcessed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Timeline */}
          <div className="card">
            <h2 className="mb-4 text-lg font-bold text-slate-900">
              Full Timeline
            </h2>
            {report.timeline.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No appointments for this day.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                      <th className="pb-3 font-medium">Time</th>
                      <th className="pb-3 font-medium">Patient</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Checked In</th>
                      <th className="pb-3 font-medium">Consult</th>
                      <th className="pb-3 font-medium">Done</th>
                      <th className="pb-3 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.timeline.map((t) => (
                      <tr
                        key={t.appointmentId}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="py-3 font-medium text-slate-900">
                          {t.scheduledTime}
                        </td>
                        <td className="py-3 text-slate-700">{t.patientName}</td>
                        <td className="py-3 text-slate-600">{t.status}</td>
                        <td className="py-3 text-slate-500">
                          {formatTime(t.checkedInAt)}
                        </td>
                        <td className="py-3 text-slate-500">
                          {formatTime(t.consultationStartedAt)}
                        </td>
                        <td className="py-3 text-slate-500">
                          {formatTime(t.completedAt)}
                        </td>
                        <td className="py-3 text-slate-600">
                          {t.totalMinutes ? `${t.totalMinutes} min` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  color = "slate",
}: {
  label: string;
  value: number | string;
  color?: "slate" | "green" | "amber" | "red" | "blue";
}) {
  const colors = {
    slate: "text-slate-700",
    green: "text-green-600",
    amber: "text-amber-600",
    red: "text-red-600",
    blue: "text-blue-600",
  };
  return (
    <div className="card !p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className={`mt-2 text-2xl font-bold ${colors[color]}`}>{value}</div>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

function formatTime(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
