import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useApiErrorHandler } from "../hooks/useApiErrorHandler";
import { ApiError } from "../services/apiClient";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function Login() {
  const navigate = useNavigate();
  const { login, emailAuth } = useAuth();
  const location = useLocation();

  const [identity, setIdentity] = useState(location.state?.email ?? "");
  const [password, setPassword] = useState("");
  const registered = location.state?.registered;

  const [showPassword, setShowPassword] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleApiError = useApiErrorHandler();

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
    } catch (err) {
      if (err instanceof ApiError && err.status >= 400 && err.status < 500) {
        if (err.hasFields) {
          setError(Object.values(err.fields)[0]); // e.g. "email cannot be empty"
        } else if (err.status === 400 || err.status === 401) {
          setError("Incorrect email or password.");
        } else {
          setError(err.message);
        }
      } else {
        handleApiError(err); // network failure / 5xx -> toast
      }
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
          {registered && !error && (
            <div className="mb-6 border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
              Account created. Please sign in.
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-center gap-2 border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
              <XMarkIcon className="size-4" />
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

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="input w-full rounded-none border-base-300 bg-base-100 pr-10 focus:border-accent focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-base-content/50 hover:text-base-content"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="size-5" />
                  ) : (
                    <EyeIcon className="size-5" />
                  )}
                </button>
              </div>
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

        {emailAuth && (
          <div className="mt-4 flex justify-center">
            <Link
              to="/forgot-password"
              className="text-sm items-center text-base-content transition-colors hover:text-primary"
            >
              Forgot password?
            </Link>
          </div>
        )}

        <p className="mt-2 text-center text-sm text-base-content/60">
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
