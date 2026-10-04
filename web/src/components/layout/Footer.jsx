function Footer() {
  return (
    <footer className="border-t border-base-300">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <blockquote className="mx-auto max-w-3xl text-center">
          <p className="font-display text-3xl font-normal leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            The powerful play goes on,
            <br />
            and you may contribute a verse.
          </p>

          <p className="mt-6 font-display text-lg italic text-accent sm:text-xl">
            What will your verse be?
          </p>

          <cite className="mt-5 block font-mono text-xs not-italic uppercase tracking-[0.2em] text-base-content/60">
            — Walt Whitman, “O Me! O Life!”
          </cite>
        </blockquote>
      </div>

      <div className="border-t border-base-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-7 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p className="font-display text-lg font-semibold">Origo</p>

          <p className="font-mono text-xs tracking-wide text-base-content/60">
            Educate. Agitate. Organize.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
