import { Link, useNavigate } from "react-router";
import { useState } from "react";
import apiClient from "../services/apiClient";

function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event){
    event.preventDefault()

    setLoading(true)
    setError(null)

    try{
      const data = await apiClient("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
      
      navigate("/login")
    }catch(error){
      setError(error)
    }finally{
      setLoading(false)
    }
  }

  return (
  <main className="mx-auto flex min-h-[calc(100vh-81px)] max-w-7xl items-center justify-center px-6 py-16 lg:px-8">
    <section className="w-full max-w-md">
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Begin here
        </p>

        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Create an account
        </h1>

        <p className="mt-4 text-base leading-relaxed text-base-content/65">
          Start building your learning path with Origo.
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
              htmlFor="username"
              className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-base-content/70"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="input w-full rounded-none border-base-300 bg-base-100 focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-base-content/70"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
              autoComplete="new-password"
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
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-base-content/60">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-base-content transition-colors hover:text-primary"
        >
          Log in
        </Link>
      </p>
    </section>
  </main>
  );
}

export default Signup;
