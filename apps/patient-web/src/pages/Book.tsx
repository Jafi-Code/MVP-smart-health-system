import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, type Clinic, ApiError } from "../lib/api";

// Time slots available at VUT-style clinic
const TIME_SLOTS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
];

export default function Book() {
  const navigate = useNavigate();

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [isLoadingClinics, setIsLoadingClinics] = useState(true);
  const [search, setSearch] = useState("");

  const [clinicId, setClinicId] = useState("");
  const [date, setDate] = useState(() => {
    // Default to tomorrow
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load clinics
  useEffect(() => {
    (async () => {
      try {
        const data = await api.listClinics();
        setClinics(data.clinics);
        if (data.clinics.length > 0) setClinicId(data.clinics[0].id);
      } catch (err) {
        if (err instanceof ApiError) setError(err.message);
      } finally {
        setIsLoadingClinics(false);
      }
    })();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!clinicId || !date || !time) {
      setError("Please select a clinic, date, and time");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.bookAppointment({
        clinicId,
        date,
        time,
        reason: reason || undefined,
      });
      navigate("/home");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Booking failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const filteredClinics = clinics.filter((clinic) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      clinic.name.toLowerCase().includes(term) ||
      clinic.address?.toLowerCase().includes(term) ||
      false
    );
  });

  const popularClinics = clinics.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <Link
            to="/home"
            className="text-2xl text-slate-400 transition hover:text-slate-600"
          >
            ←
          </Link>
          <h1 className="text-lg font-bold text-slate-900">Book Appointment</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Clinic */}
          <div className="card">
            <label className="label">1. Choose a clinic</label>
            {isLoadingClinics ? (
              <div className="py-3 text-sm text-slate-500">
                Loading clinics...
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="🔍 Search clinic or town"
                    className="input pr-10"
                  />
                </div>

                {!search ? (
                  <>
                    <div>
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Popular
                      </div>
                      <div className="space-y-2">
                        {popularClinics.map((clinic) => (
                          <ClinicOption
                            key={clinic.id}
                            clinic={clinic}
                            selected={clinicId === clinic.id}
                            onSelect={setClinicId}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    {filteredClinics.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-200 p-3 text-sm text-slate-500">
                        No matching clinics found.
                      </div>
                    ) : (
                      filteredClinics.map((clinic) => (
                        <ClinicOption
                          key={clinic.id}
                          clinic={clinic}
                          selected={clinicId === clinic.id}
                          onSelect={setClinicId}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Date */}
          <div className="card">
            <label className="label">2. Pick a date</label>
            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className="input"
              required
            />
          </div>

          {/* Time */}
          <div className="card">
            <label className="label">3. Pick a time</label>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={`rounded-xl border-2 py-3 text-sm font-semibold transition ${
                    time === slot
                      ? "border-primary bg-primary text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div className="card">
            <label className="label">
              Reason{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input min-h-[80px] resize-none"
              placeholder="e.g., Chronic medication refill"
              maxLength={500}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !time}
            className="btn-primary w-full disabled:opacity-60"
          >
            {isSubmitting ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </main>
    </div>
  );
}

function ClinicOption({
  clinic,
  selected,
  onSelect,
}: {
  clinic: Clinic;
  selected: boolean;
  onSelect: (value: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(clinic.id)}
      className={`flex w-full items-start gap-3 rounded-xl border-2 p-4 text-left transition ${
        selected
          ? "border-primary bg-primary/5"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="mt-0.5 h-5 w-5 rounded-full border-2 border-slate-300 bg-white p-0.5">
        {selected && <div className="h-full w-full rounded-full bg-primary" />}
      </div>
      <div>
        <div className="font-semibold text-slate-900">{clinic.name}</div>
        {clinic.address && (
          <div className="text-sm text-slate-500">{clinic.address}</div>
        )}
      </div>
    </button>
  );
}
