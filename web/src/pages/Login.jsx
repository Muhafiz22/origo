import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError(null);

    try {
      await login({
        identity,
        password,
      });
      navigate("/");
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="mx-auto flex min-h-[calc(100vh-81px)] max-w-7xl items-center justify-center px-6 py-16 lg:px-8">
      <section className="w-full max-w-md">
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Welcome back
          </p>

          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Log in
          </h1>

          <p className="mt-4 text-base leading-relaxed text-base-content/65">
            Continue where you left off.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-base-300 bg-base-200 p-6 sm:p-8"
        >
          {error && (
            <div className="mb-6 border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label
                htmlFor="identity"
                className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-base-content/70"
              >
                Email
              </label>

              <input
                id="identity"
                type="email"
                autoComplete="username"
                value={identity}
                onChange={(event) => setIdentity(event.target.value)}
                className="input w-full rounded-none border-base-300 bg-base-100 focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-base-content/70"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="input w-full rounded-none border-base-300 bg-base-100 focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn mt-7 w-full rounded-none border-none bg-primary font-mono text-sm text-primary-content hover:bg-primary/90"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-base-content/60">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-base-content transition-colors hover:text-primary"
          >
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
