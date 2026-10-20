import { Fragment, useMemo } from "react";
import { useLocation } from "react-router";
import { quotes } from "./quotes";

function Quote() {
  const { pathname } = useLocation();

  // New random pick on every route change
  const { lines, accent, cite } = useMemo(
    () => quotes[Math.floor(Math.random() * quotes.length)],
    [pathname], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <blockquote className="mx-auto max-w-3xl text-center">
      <p className="font-display text-3xl font-normal leading-tight tracking-tight sm:text-4xl lg:text-5xl">
        {lines.map((line, i) => (
          <Fragment key={i}>
            {i > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </p>

      {accent && (
        <p className="mt-6 font-display text-lg italic text-accent sm:text-xl">
          {accent}
        </p>
      )}

      <cite className="mt-5 block font-mono text-xs not-italic uppercase tracking-[0.2em] text-base-content/60">
        — {cite}
      </cite>
    </blockquote>
  );
}

export default Quote;
