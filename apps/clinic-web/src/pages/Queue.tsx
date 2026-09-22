import { useEffect, useState } from "react";
import {
  api,
  type Appointment,
  type AppointmentStatus,
  ApiError,
} from "../lib/api";
import { StatusBadge } from "./Dashboard";

export default function Queue() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const loadData = async () => {
    setError("");
    try {
      const data = await api.getTodayAppointments();
      setAppointments(data.appointments);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to load queue");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (
    appointmentId: string,
    status: AppointmentStatus,
  ) => {
    setUpdating(appointmentId);
    setError("");

    try {
      const result = await api.updateStatus(appointmentId, status);
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? result.appointment : a)),
      );
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const sorted = [...appointments].sort((a, b) => {
    const order: Record<string, number> = {
      IN_CONSULTATION: 0,
      AWAITING_MEDICATION: 1,
      IN_VITALS: 2,
      CHECKED_IN: 3,
      SCHEDULED: 4,
      DONE: 5,
      CANCELLED: 6,
      NO_SHOW: 6,
    };
    const diff = (order[a.status] ?? 5) - (order[b.status] ?? 5);
    if (diff !== 0) return diff;
    return a.time.localeCompare(b.time);
  });

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Live Queue</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage patient flow in real time
          </p>
        </div>
        <button onClick={loadData} className="btn-ghost">
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="card py-12 text-center text-sm text-slate-500">
          Loading queue...
        </div>
      ) : appointments.length === 0 ? (
        <div className="card py-12 text-center text-sm text-slate-500">
          No patients in the queue today.
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((appt) => (
            <div key={appt.id} className="card">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-primary">
                      {appt.time}
                    </span>
                    <span className="text-lg font-semibold text-slate-900">
                      {appt.patient.name}
                    </span>
                    {appt.queuePosition && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                        #{appt.queuePosition}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                    {appt.patient.phone && <span>📞 {appt.patient.phone}</span>}
                    {appt.reason && <span>• {appt.reason}</span>}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={appt.status} />

                  {(appt.status === "SCHEDULED" ||
                    appt.status === "CHECKED_IN") && (
                    <button
                      onClick={() =>
                        handleStatusChange(
                          appt.id,
                          appt.status === "SCHEDULED"
                            ? "CHECKED_IN"
                            : "IN_VITALS",
                        )
                      }
                      disabled={updating === appt.id}
                      className="btn-success disabled:opacity-50"
                    >
                      {appt.status === "SCHEDULED"
                        ? "Patient Arrived"
                        : "Start Vitals"}
                    </button>
                  )}

                  {appt.status === "IN_VITALS" && (
                    <button
                      onClick={() =>
                        handleStatusChange(appt.id, "IN_CONSULTATION")
                      }
                      disabled={updating === appt.id}
                      className="btn-primary disabled:opacity-50"
                    >
                      Send to Consult
                    </button>
                  )}

                  {appt.status === "IN_CONSULTATION" && (
                    <button
                      onClick={() =>
                        handleStatusChange(appt.id, "AWAITING_MEDICATION")
                      }
                      disabled={updating === appt.id}
                      className="btn-primary disabled:opacity-50"
                    >
                      Send to Rx
                    </button>
                  )}

                  {appt.status === "AWAITING_MEDICATION" && (
                    <button
                      onClick={() => handleStatusChange(appt.id, "DONE")}
                      disabled={updating === appt.id}
                      className="btn-success disabled:opacity-50"
                    >
                      Dispense
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
