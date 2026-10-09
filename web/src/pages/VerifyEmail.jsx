import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import ResendVerification from "../components/ResendVerification";
import { verifyEmail } from "../services/authServices";

const INVALID_LINK_MESSAGE =
  "This verification link is invalid or has expired.";
const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";
const OFFLINE_MESSAGE =
  "Unable to reach the server. Check your connection and try again.";

function getErrorMessage(err) {
  if (err?.status === 400) return INVALID_LINK_MESSAGE;
  if (err?.status === 0) return OFFLINE_MESSAGE;
  return GENERIC_ERROR_MESSAGE;
}

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState(token ? "loading" : "error");
  const [errorMessage, setErrorMessage] = useState(
    token ? "" : INVALID_LINK_MESSAGE,
  );

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    verifyEmail(token)
      .then(() => {
        if (!cancelled) setStatus("success");
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus("error");
        setErrorMessage(getErrorMessage(err));
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center text-center gap-3">
          {status === "loading" && (
            <>
              <span className="loading loading-spinner loading-lg text-primary" />
              <h1 className="card-title text-2xl">Verifying your email</h1>
              <p className="text-base-content/70">
                Please wait while we verify your email address.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="card-title text-2xl">Email verified</h1>
              <p className="text-base-content/70">
                Your account is ready. You can log in now.
              </p>
              <Link to="/login" className="btn btn-primary w-full mt-2">
                Log in
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error/15 text-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="card-title text-2xl">Verification failed</h1>
              <p className="text-base-content/70">{errorMessage}</p>

              <div className="divider my-1">Need a new link?</div>
              <ResendVerification />

              <Link to="/login" className="btn btn-ghost btn-sm mt-2">
                Back to login
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default VerifyEmail;
