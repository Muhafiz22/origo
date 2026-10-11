import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useApiErrorHandler } from "../hooks/useApiErrorHandler";
import { useToast } from "../components/ToastProvider";
import { resetPassword } from "../services/authServices";

function InvalidLink() {
  return (
    <>
      <div role="alert" className="alert alert-error alert-soft">
        <span>This reset link is invalid or has expired.</span>
      </div>
      <div className="card-actions justify-end mt-2">
        <Link to="/forgot-password" className="btn btn-primary btn-sm">
          Request a new link
        </Link>
      </div>
    </>
  );
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [linkInvalid, setLinkInvalid] = useState(token === "");

  const navigate = useNavigate();
  const toast = useToast();
  const handleApiError = useApiErrorHandler();

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    if (newPassword !== confirm) {
      setFieldErrors({ confirm: "Passwords don't match" });
      return;
    }

    setSubmitting(true);
    setFieldErrors({});
    try {
      await resetPassword({ token, newPassword });
      toast.success("Password reset. Log in with your new password.");
      navigate("/login", { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 400 && !err.hasFields) {
        setLinkInvalid(true);
      } else {
        setFieldErrors(handleApiError(err));
      }
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl">Reset your password</h1>

          {linkInvalid ? (
            <InvalidLink />
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
              noValidate
            >
              <label className="form-control w-full">
                <span className="label-text mb-1">New password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  autoFocus
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`input input-bordered w-full ${
                    fieldErrors.newPassword ? "input-error" : ""
                  }`}
                  aria-invalid={Boolean(fieldErrors.newPassword)}
                />
                {fieldErrors.newPassword && (
                  <span className="text-error text-sm mt-1">
                    {fieldErrors.newPassword}
                  </span>
                )}
              </label>

              <label className="form-control w-full">
                <span className="label-text mb-1">Confirm password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={`input input-bordered w-full ${
                    fieldErrors.confirm ? "input-error" : ""
                  }`}
                  aria-invalid={Boolean(fieldErrors.confirm)}
                />
                {fieldErrors.confirm && (
                  <span className="text-error text-sm mt-1">
                    {fieldErrors.confirm}
                  </span>
                )}
              </label>

              {fieldErrors.token && (
                <span className="text-error text-sm">{fieldErrors.token}</span>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting || newPassword === "" || confirm === ""}
              >
                {submitting && (
                  <span className="loading loading-spinner loading-sm" />
                )}
                Reset password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
