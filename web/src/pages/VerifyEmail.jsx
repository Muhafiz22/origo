import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import { verifyEmail } from "../services/authServices";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState(token ? "loading" : "error");
  const [errorMessage, setErrorMessage] = useState(
    token ? "" : "Invalid verification link",
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    verifyEmail(token)
      .then(() => {
        if (!cancelled) {
          setStatus("success");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage(err.message || "Verification failed");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <main>
      {status === "error" && (
        <div>
          <h1>Verification Failed</h1>
          <p>{errorMessage}</p>
          <p>Need a new link?</p>
          <ResendVerification />
          <Link to="/login">Back to login</Link>
        </div>
      )}

      {status === "loading" && (
        <div>
          <h1>Verifying Your Email</h1>
          <p>Please wait while we verify your email address.</p>
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {status === "success" && (
        <div>
          <h1>Email Verified Successfully</h1>
          <Link to="/login">Log in</Link>
        </div>
      )}
    </main>
  );
}

export default VerifyEmail;
