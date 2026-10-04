const SECTION_GRID =
  "grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:items-start";

function CourseHero({ course, chapterCount }) {
  return (
    <section className={SECTION_GRID}>
      <div>
        <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          {course.name}
        </h1>

        <p className="font-mono text-xs tracking-[0.1em] text-accent">
          By {course.creatorName}
        </p>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-base-content/70">
          {course.description}
        </p>

        <div className="mt-8 flex items-center gap-6 font-mono text-sm text-base-content/60">
          <span>{course.price === 0 ? "Free" : `₹${course.price}`}</span>

          <span className="h-1 w-1 rounded-full bg-base-content/30" />

          <span>
            {chapterCount} {chapterCount === 1 ? "chapter" : "chapters"}
          </span>
        </div>
      </div>

      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-base-300 font-mono text-xs uppercase tracking-[0.2em] text-base-content/40">
        Thumbnail
      </div>
    </section>
  );
}

export default CourseHero;
