import { useLocation, Link } from "react-router";
import ResendVerification from "../components/ResendVerification";

function CheckEmail() {
  const { state } = useLocation();
  const email = state?.email ?? "";

  return (
    <main>
      <h1>Check Your Email</h1>
      {email ? (
        <p>
          We sent a verification link to <strong>{email}</strong>. Click it to
          activate your account.
        </p>
      ) : (
        <p>Check your inbox for a verification link.</p>
      )}

      <p>Didn't get it?</p>
      <ResendVerification initialEmail={email} />

      <Link to="/login">Back to login</Link>
    </main>
  );
}

export default CheckEmail;
