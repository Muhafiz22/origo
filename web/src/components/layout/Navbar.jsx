import { Link } from "react-router";
import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ToastProvider";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";

function logoutErrorMessage(error) {
  if (error?.isNetwork) {
    return "Unable to reach the server. Check your connection.";
  }
  return error?.isServer
    ? "Something went wrong on our end. Try again in a moment."
    : "Couldn't log out. Try again.";
}

function Navbar() {
  const { user, status, logout } = useAuth();
  const toast = useToast();
  const [loggingOut, setLoggingOut] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "origo-light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) => {
      return currentTheme === "origo-light" ? "origo-dark" : "origo-light";
    });
  }

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    try {
      await logout();
    } catch (err) {
      toast.error(logoutErrorMessage(err));
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <nav className="border-b border-base-300 bg-base-100">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 lg:px-8">
        <Link
          to="/"
          className="font-display text-2xl font-semibold tracking-tight"
        >
          Origo
        </Link>

        <div className="flex items-center gap-6">
          {/* Search — add later */}

          <button
            type="button"
            onClick={toggleTheme}
            className="btn btn-ghost btn-square"
            aria-label={
              theme === "origo-light"
                ? "switch to origo-dark"
                : "switch to origo-light"
            }
          >
            {theme === "origo-light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>

          {status === "authenticated" ? (
            <>
              <Link
                to="/dashboard"
                className="font-body text-sm font-medium text-base-content transition-colors hover:text-primary"
              >
                Dashboard
              </Link>

              <Link
                to="/my-learning"
                className="font-body text-sm font-medium text-base-content transition-colors hover:text-primary"
              >
                My Learning
              </Link>

              <div className="dropdown dropdown-end">
                <button
                  type="button"
                  tabIndex={0}
                  aria-label="Account menu"
                  className="btn btn-ghost btn-circle avatar placeholder"
                >
                  <div className="w-8 rounded-full bg-neutral text-neutral-content ring-1 ring-base-300 transition-colors hover:ring-accent">
                    <span className="font-mono text-sm">
                      {user?.name?.[0]?.toUpperCase() ?? "?"}
                    </span>
                  </div>
                </button>

                <div
                  tabIndex={0}
                  className="dropdown-content z-50 mt-3 w-72 border border-base-300 bg-base-200"
                >
                  <div className="border-b border-base-300 px-4 py-3">
                    <p className="font-mono text-xs tracking-[0.1em] text-accent">
                      Signed in as
                    </p>

                    <p className="mt-1 truncate font-display text-base font-semibold">
                      {user?.name}
                    </p>

                    {user?.email && (
                      <p
                        className="truncate text-xs text-base-content/60"
                        title={user.email}
                      >
                        {user.email}
                      </p>
                    )}
                  </div>

                  <ul className="menu w-full p-0">
                    <li>
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex w-full items-center justify-start gap-4 rounded-none px-4 py-3 font-mono text-sm text-base-content/70 hover:bg-base-300/60 hover:text-base-content"
                      >
                        <span>{loggingOut ? "Logging out..." : "Log out"}</span>
                        <ArrowRightStartOnRectangleIcon
                          className="size-5"
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="border border-base-300 px-4 py-2 font-body text-sm font-medium text-base-content transition-colors hover:text-primary"
              >
                Log in
              </Link>

              <Link
                to="/signup"
                className="border border-primary bg-primary px-4 py-2 font-body text-xs font-medium text-primary-content transition-colors hover:bg-primary/90"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
