function ProgressCard({
  course,
  chapterCount,
  percent,
  totalVideos,
  completedIds,
  videoIds,
}) {
  const isCompleted = percent === 100;
  const barCount = videoIds.length;

  const gapClass =
    barCount > 100
      ? "gap-0"
      : barCount > 40
        ? "gap-px"
        : barCount > 15
          ? "gap-0.5"
          : barCount > 6
            ? "gap-1"
            : "gap-2";

  const radiusClass = barCount > 15 ? "rounded-none" : "rounded-sm";

  return (
    <aside className="rounded-box border border-base-300 bg-base-100 p-3">
      <h2 className="line-clamp-2 font-display text-lg font-semibold leading-snug tracking-tight">
        {course.name}
      </h2>

      <p className="mt-1 truncate text-xs text-accent">
        By {course.creatorName}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 text-xs text-base-content/60">
        <span>{course.price === 0 ? "Free course" : `₹${course.price}`}</span>
        <span aria-hidden="true">·</span>
        <span>
          {chapterCount} {chapterCount === 1 ? "chapter" : "chapters"}
        </span>
      </div>

      <div className="my-3 border-t border-base-300" />

      <div className="flex items-baseline justify-between gap-2">
        <p className="font-mono text-xs tracking-wide text-base-content/60">
          {isCompleted ? "Completed" : "Your progress"}
        </p>

        <p className="text-xs text-base-content/60">
          {completedIds.size}/{totalVideos} videos
        </p>

        <p className="font-display text-xl font-semibold tracking-tight text-accent">
          {percent}%
        </p>
      </div>

      <div
        role="progressbar"
        aria-label="Course progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${percent}% complete; ${completedIds.size} of ${totalVideos} videos completed`}
        className={`mt-2 flex h-3 w-full overflow-hidden ${gapClass}`}
      >
        {videoIds.map((id) => {
          const done = completedIds.has(id);

          return (
            <div
              key={id}
              aria-hidden="true"
              className={[
                "min-w-0 flex-1 transition-colors duration-200",
                radiusClass,
                done
                  ? isCompleted
                    ? "bg-success"
                    : "bg-accent"
                  : "bg-base-300",
              ].join(" ")}
            />
          );
        })}
      </div>
    </aside>
  );
}

export default ProgressCard;
