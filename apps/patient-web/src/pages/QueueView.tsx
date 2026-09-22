import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { api, type QueueItem, type QueueStats, ApiError } from "../lib/api";

export default function QueueView() {
  const { clinicId } = useParams<{ clinicId: string }>();
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date") || undefined;

  const [stats, setStats] = useState<QueueStats | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadQueue = async () => {
    if (!clinicId) return;
    try {
      const data = await api.getClinicQueue(clinicId, date);
      setStats(data.stats);
      setQueue(data.appointments);
      setLastUpdated(new Date());
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Failed to load queue");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadQueue, 30000);
    return () => clearInterval(interval);
  }, [clinicId, date]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading queue...
      </div>
    );
  }

  const inConsultation = queue.filter((q) => q.status === "IN_CONSULTATION");
  const waiting = queue.filter((q) => q.status === "CHECKED_IN");
  const scheduled = queue.filter((q) => q.status === "SCHEDULED");
  const done = queue.filter((q) => q.status === "DONE");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary to-blue-800 px-6 pb-16 pt-6 text-white">
        <div className="mx-auto max-w-lg">
          <Link to="/home" className="text-2xl text-blue-100 hover:text-white">
            ←
          </Link>
          <h1 className="mt-4 text-2xl font-bold">Live Queue</h1>
          <p className="mt-1 text-sm text-blue-100">Updates every 30 seconds</p>
        </div>
      </header>

      {/* Stats */}
      <main className="mx-auto -mt-12 max-w-lg space-y-5 px-6 pb-12">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {stats && (
          <div className="card">
            <div className="grid grid-cols-4 gap-2 text-center">
              <StatBox label="Waiting" value={stats.checkedIn} color="amber" />
              <StatBox
                label="In Consult"
                value={stats.inConsultation}
                color="blue"
              />
              <StatBox label="Done" value={stats.done} color="green" />
              <StatBox label="Total" value={stats.total} color="slate" />
            </div>
          </div>
        )}

        {/* Now serving */}
        {inConsultation.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
              Now Serving
            </h2>
            <div className="space-y-2">
              {inConsultation.map((item) => (
                <div
                  key={item.id}
                  className="card !border-blue-200 !bg-blue-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-blue-900">{item.time}</div>
                    <div className="text-xs font-semibold text-blue-700">
                      IN CONSULTATION
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Waiting */}
        {waiting.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
              Waiting ({waiting.length})
            </h2>
            <div className="space-y-2">
              {waiting.map((item) => (
                <div key={item.id} className="card !py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-800">
                      {item.queuePosition}
                    </div>
                    <div className="font-semibold text-slate-900">
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scheduled (not yet checked in) */}
        {scheduled.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
              Scheduled ({scheduled.length})
            </h2>
            <div className="space-y-2">
              {scheduled.map((item) => (
                <div key={item.id} className="card !py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                      {item.queuePosition}
                    </div>
                    <div className="font-semibold text-slate-900">
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Done */}
        {done.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
              Completed ({done.length})
            </h2>
            <div className="space-y-2">
              {done.map((item) => (
                <div key={item.id} className="card !py-3 opacity-60">
                  <div className="font-semibold text-slate-500 line-through">
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty */}
        {queue.length === 0 && (
          <div className="card py-10 text-center">
            <div className="text-4xl">☕</div>
            <p className="mt-3 text-sm font-medium text-slate-700">
              No one in the queue right now
            </p>
          </div>
        )}

        <p className="text-center text-xs text-slate-400">
          Last updated:{" "}
          {lastUpdated.toLocaleTimeString("en-ZA", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </main>
    </div>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "slate" | "amber" | "blue" | "green";
}) {
  const colors = {
    slate: "text-slate-700",
    amber: "text-amber-600",
    blue: "text-blue-600",
    green: "text-green-600",
  };
  return (
    <div>
      <div className={`text-2xl font-bold ${colors[color]}`}>{value}</div>
      <div className="mt-1 text-xs text-slate-500">{label}</div>
    </div>
  );
}
