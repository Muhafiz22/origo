import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { verifyEmail } from "../services/authServices";
import {Link} from "react-router";
function VerifyEmail() {
  const [verify, setVerify] = useState(false)
  const [error, setError] = useState(null)

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      return;
    }

    verifyEmail(token)
      .then(() => {
        setVerify(true);
      })
      .catch((err) => {
        setError(err.message || "Verification failed");
      });
  }, [token]);


  return (
    <main>
    {error ? (
      <div>
        <h1>Verification Failed</h1>
        <p>{error}</p>
        <Link to="/login">Go to Login</Link>
      </div>
    ) : verify ? (
      <div>
        <h1>Email Verified</h1>
        <p>Your email has been successfully verified.</p>
        <Link to="/login">Go to Login</Link>
        </div>
    ) : (
      <div>
        <h1>Check Your Email</h1>
          <p>
            A verification link has been sent to your email address.
            Click the link to verify your account.
          </p>
      </div>    
    )}
  </main>
  );
}

export default VerifyEmail;
