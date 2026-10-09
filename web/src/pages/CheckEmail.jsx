import { useLocation, Link } from "react-router";
import ResendVerification from "../components/ResendVerification";

function CheckEmail() {
  const { state } = useLocation();
  const email = state?.email ?? "";

  return (
    <main className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center text-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h1 className="card-title text-2xl">Check your email</h1>

          {email ? (
            <p className="text-base-content/70">
              We sent a verification link to{" "}
              <strong className="text-base-content break-all">{email}</strong>.
              Click it to activate your account.
            </p>
          ) : (
            <p className="text-base-content/70">
              Check your inbox for a verification link.
            </p>
          )}

          <div className="divider my-1">Didn't get it?</div>
          <ResendVerification initialEmail={email} />

          <Link to="/login" className="btn btn-ghost btn-sm mt-2">
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}

export default CheckEmail;
