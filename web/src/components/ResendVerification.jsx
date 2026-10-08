import { useState } from "react";
import { resendVerificationEmail } from "../services/authServices";

function ResendVerification({ initialEmail = "" }) {
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      await resendVerificationEmail(email.trim());
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "Could not resend the verification email");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        className="input input-bordered"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending..." : "Resend verification email"}
      </button>

      {status === "sent" && (
        <div className="alert alert-success" role="status">
          If that account exists and isn't verified yet, a new link is on its way.
        </div>
      )}
      {status === "error" && (
        <div className="alert alert-error" role="alert">
          {errorMessage}
        </div>
      )}
    </form>
  );
}

export default ResendVerification;
