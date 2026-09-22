import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../lib/api";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("0821234567");
  const [password, setPassword] = useState("PatientPass123!");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(identifier, password);
      navigate("/home");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-blue-800 px-6 py-12 text-white">
        <div className="mx-auto max-w-md">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl font-bold backdrop-blur">
            S
          </div>
          <h1 className="mt-6 text-3xl font-bold leading-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-blue-100">
            Sign in to book appointments and track your queue.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-1 justify-center px-6 py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="label">Phone Number</label>
            <input
              type="tel"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="input"
              placeholder="0821234567"
              inputMode="numeric"
              required
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary hover:underline"
            >
              Create one
            </Link>
          </p>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs text-slate-600">
              <strong>Demo:</strong> 0821234567 / PatientPass123!
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
