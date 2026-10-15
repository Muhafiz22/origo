import ProgressCard from "./ProgressCard";

const SECTION_GRID =
  "grid gap-4 lg:grid-cols-[minmax(0,7.5fr)_minmax(300px,2.5fr)] lg:items-start";

function CourseHero({ course, chapterCount, progress }) {
  const showProgress =
    Boolean(progress) &&
    !progress.unavailable &&
    progress.completedIds != null &&
    progress.totalVideos > 0;

  return (
    <section className={showProgress ? SECTION_GRID : undefined}>
      <div>
        <h1 className="mt-2 max-w-4xl font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-5xl">
          {course.name}
        </h1>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs tracking-[0.1em] text-base-content/60">
          <span className="text-accent">By {course.creatorName}</span>

          <span className="h-1 w-1 rounded-full bg-base-content/30" />

          <span>{course.price === 0 ? "Free Course" : `₹${course.price}`}</span>

          <span className="h-1 w-1 rounded-full bg-base-content/30" />

          <span>
            {chapterCount} {chapterCount === 1 ? "chapter" : "chapters"}
          </span>
        </div>
      </div>

      {showProgress && (
        <ProgressCard
          percent={progress.percent}
          totalVideos={progress.totalVideos}
          completedIds={progress.completedIds}
          videoIds={progress.videoIds}
        />
      )}
    </section>
  );
}

export default CourseHero;
