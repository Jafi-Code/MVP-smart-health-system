import { useEffect, useState } from "react";
import { api, ApiError, type DailyReport } from "../lib/api";
import { StatusBadge } from "./Dashboard";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function formatTimestamp(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Reports() {
  const [date, setDate] = useState(today);
  const [report, setReport] = useState<DailyReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = async () => {
    setIsLoading(true);
    setError("");
    try {
      setReport(await api.getDailyReport(date));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load report");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadReport();
  }, [date]);

  const download = async () => {
    try {
      await api.downloadDailyReportCSV(date);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to download report",
      );
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Daily Report</h1>
          <p className="mt-1 text-sm text-slate-500">
            Operational summary for {report?.clinicName || "your clinic"}
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm font-medium text-slate-600">
            Report date
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="input mt-1 min-w-44"
            />
          </label>
          <button
            onClick={loadReport}
            className="btn-ghost"
            disabled={isLoading}
          >
            Refresh
          </button>
          <button
            onClick={download}
            className="btn-primary"
            disabled={!report || isLoading}
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
        <div className="card py-16 text-center text-sm text-slate-500">
          Loading report...
        </div>
      ) : report ? (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
            <Metric label="Total" value={report.summary.totalAppointments} />
            <Metric
              label="Completed"
              value={report.summary.completed}
              tone="green"
            />
            <Metric
              label="No-Shows"
              value={report.summary.noShows}
              tone="red"
            />
            <Metric
              label="Waiting"
              value={report.summary.stillWaiting}
              tone="amber"
            />
            <Metric label="Cancelled" value={report.summary.cancelled} />
            <Metric
              label="No-Show Rate"
              value={`${report.summary.noShowRate}%`}
            />
            <Metric
              label="Completion Rate"
              value={`${report.summary.completionRate}%`}
              tone="green"
            />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <section className="card">
              <h2 className="text-lg font-bold text-slate-900">Wait Times</h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <WaitMetric
                  label="Total visit"
                  value={report.waitTimes.averageTotalMinutes}
                />
                <WaitMetric
                  label="Triage to consult"
                  value={report.waitTimes.averageTriageToConsultMinutes}
                />
                <WaitMetric
                  label="Consult to done"
                  value={report.waitTimes.averageConsultToDoneMinutes}
                />
              </div>
            </section>

            <section className="card">
              <h2 className="text-lg font-bold text-slate-900">
                Station Activity
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                      <th className="pb-3 font-medium">Station</th>
                      <th className="pb-3 text-right font-medium">
                        Patients processed
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.stationActivity.map((station) => (
                      <tr
                        key={station.station}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="py-3 font-medium text-slate-700">
                          {station.station}
                        </td>
                        <td className="py-3 text-right font-semibold text-slate-900">
                          {station.patientsProcessed}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <section className="card mt-8">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Appointment Timeline
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Every appointment recorded for {report.date}
                </p>
              </div>
              <span className="text-sm text-slate-500">
                {report.timeline.length} appointments
              </span>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="pb-3 font-medium">Scheduled</th>
                    <th className="pb-3 font-medium">Patient</th>
                    <th className="pb-3 font-medium">Checked in</th>
                    <th className="pb-3 font-medium">Consult started</th>
                    <th className="pb-3 font-medium">Completed</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {report.timeline.map((entry) => (
                    <tr
                      key={entry.appointmentId}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="py-3 font-medium text-slate-900">
                        {entry.scheduledTime}
                      </td>
                      <td className="py-3">
                        <div className="font-medium text-slate-900">
                          {entry.patientName}
                        </div>
                        {entry.phone && (
                          <div className="text-xs text-slate-500">
                            {entry.phone}
                          </div>
                        )}
                      </td>
                      <td className="py-3 text-slate-600">
                        {formatTimestamp(entry.checkedInAt)}
                      </td>
                      <td className="py-3 text-slate-600">
                        {formatTimestamp(entry.consultationStartedAt)}
                      </td>
                      <td className="py-3 text-slate-600">
                        {formatTimestamp(entry.completedAt)}
                      </td>
                      <td className="py-3">
                        <StatusBadge status={entry.status} />
                      </td>
                      <td className="py-3 text-right text-slate-600">
                        {entry.totalMinutes === null
                          ? "-"
                          : `${entry.totalMinutes} min`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

function Metric({
  label,
  value,
  tone = "slate",
}: {
  label: string;
  value: number | string;
  tone?: "slate" | "green" | "red" | "amber";
}) {
  const colors = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    amber: "bg-amber-100 text-amber-700",
  };
  return (
    <div className="card !p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div
        className={`mt-2 inline-flex rounded-lg px-3 py-1 text-2xl font-bold ${colors[tone]}`}
      >
        {value}
      </div>
    </div>
  );
}

function WaitMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">
        {value} <span className="text-sm font-medium text-slate-500">min</span>
      </div>
    </div>
  );
}
