const SECTION_GRID =
  "grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:items-start";

function CourseHero({ course, chapterCount }) {
  return (
    <section className={SECTION_GRID}>
      <div>
        <h1 className="mt-2 max-w-4xl font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-5xl">
          {course.name}
        </h1>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs tracking-[0.1em] text-base-content/60">
          <span className="text-accent">By {course.creatorName}</span>

          <span className="h-1 w-1 rounded-full bg-base-content/30" />

          <span>
            {course.price === 0 ? "Free Course" : `₹${course.price}`}
          </span>

          <span className="h-1 w-1 rounded-full bg-base-content/30" />

          <span>
            {chapterCount} {chapterCount === 1 ? "chapter" : "chapters"}
          </span>
        </div>

        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-base-content/70">
          {course.description}
        </p>
      </div>
    </section>
  );
}

export default CourseHero;
