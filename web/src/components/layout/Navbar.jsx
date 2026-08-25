import { Link } from "react-router";
import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

function Navbar() {
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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
