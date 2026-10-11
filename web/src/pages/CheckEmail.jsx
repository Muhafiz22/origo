import { useLocation, Link } from "react-router";
import ResendVerification from "../components/ResendVerification";
import { EnvelopeIcon } from "@heroicons/react/16/solid";

function CheckEmail() {
  const { state } = useLocation();
  const email = state?.email ?? "";

  return (
    <main className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center text-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
            <EnvelopeIcon className="size-10" />
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

          <Link
            to="/login"
            className="btn btn-ghost btn-sm mt-2 hover:text-accent"
          >
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}

export default CheckEmail;
