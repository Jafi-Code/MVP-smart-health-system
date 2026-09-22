import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../lib/api";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await register({
        name,
        phone,
        idNumber: idNumber || undefined,
        password,
      });
      navigate("/home");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="bg-gradient-to-br from-secondary to-teal-700 px-6 py-12 text-white">
        <div className="mx-auto max-w-md">
          <h1 className="text-3xl font-bold leading-tight">
            Create your account
          </h1>
          <p className="mt-2 text-teal-50">
            Book clinic visits from your phone — no more waiting in line.
          </p>
        </div>
      </div>

      <div className="flex flex-1 justify-center px-6 py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="Gogo Maria Dlamini"
              required
            />
          </div>

          <div>
            <label className="label">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input"
              placeholder="0821234567"
              inputMode="numeric"
              pattern="0[0-9]{9}"
              title="10 digits starting with 0"
              required
            />
          </div>

          <div>
            <label className="label">
              ID Number{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              className="input"
              placeholder="5501015800083"
              inputMode="numeric"
              pattern="[0-9]{13}"
              title="13 digits"
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
