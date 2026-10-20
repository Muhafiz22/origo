import Quote from "../Quotes";

const AUTHOR = {
  name: "Muhafiz",
  github: "https://github.com/muhafiz22",
  linkedin: "https://www.linkedin.com/in/mohammed-muhafiz-hussain",
};

const linkClass =
  "underline-offset-4 transition-colors hover:text-accent hover:underline";

function Footer() {
  return (
    <footer className="border-t border-base-300">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <Quote />
      </div>

      <div className="border-t border-base-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-7 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex flex-col gap-1">
            <p className="font-display text-lg font-semibold">Origo</p>
            <p className="font-mono text-xs tracking-wide text-base-content/60">
              Educate. Agitate. Organize.
            </p>
          </div>

          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs tracking-wide text-base-content/60">
            <span>Made by {AUTHOR.name}</span>
            <span aria-hidden="true">·</span>
            <a
              href={AUTHOR.github}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              GitHub
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={AUTHOR.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              LinkedIn
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
