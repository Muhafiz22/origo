import { useState } from "react";
import { Link } from "react-router"; 
import { forgotPassword } from "../services/authServices"; 
import { useApiErrorHandler } from "../hooks/useApiErrorHandler";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const handleApiError = useApiErrorHandler();

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setFieldErrors({});
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setFieldErrors(handleApiError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl">Forgot your password?</h1>

          {sent ? (
            <>
              <div role="status" className="alert alert-success alert-soft">
                <span>
                  If an account exists for <strong>{email.trim()}</strong>, a
                  password reset link is on its way. Check your spam folder if
                  it doesn't show up.
                </span>
              </div>
              <div className="card-actions justify-between mt-2">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setSent(false)}
                >
                  Use a different email
                </button>
                <Link to="/login" className="btn btn-primary btn-sm">
                  Back to login
                </Link>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <p className="text-base-content/70">
                Enter your email and we'll send you a link to reset it.
              </p>

              <label className="form-control w-full">
                <span className="label-text mb-1">Email</span>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`input input-bordered w-full ${
                    fieldErrors.email ? "input-error" : ""
                  }`}
                  aria-invalid={Boolean(fieldErrors.email)}
                />
                {fieldErrors.email && (
                  <span className="text-error text-sm mt-1">{fieldErrors.email}</span>
                )}
              </label>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting || email.trim() === ""}
              >
                {submitting && <span className="loading loading-spinner loading-sm" />}
                Send reset link
              </button>

              <Link to="/login" className="link link-hover text-sm text-center">
                Back to login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

