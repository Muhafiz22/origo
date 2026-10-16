import { useState } from "react";
import { Link } from "react-router";

const API_URL = import.meta.env.VITE_API_URL ?? "";

function LearningCourseCard({ course }) {
  const [imageFailed, setImageFailed] = useState(false);

  const thumbnailSrc =
    course.thumbnailUrl && !imageFailed
      ? `${API_URL}${course.thumbnailUrl}`
      : null;

  const percent = Math.min(100, Math.max(0, course.percent ?? 0));
  const completed = percent === 100;

  return (
    <Link
      to={`/courses/${course.courseId}`}
      className="group flex overflow-hidden rounded-box border border-base-300 bg-base-200 transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <div className="relative w-28 shrink-0 bg-base-300 sm:w-48 md:w-56">
        {thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/30 to-base-300">
            <span className="font-display text-4xl font-semibold text-base-content/40">
              {course.name?.charAt(0).toUpperCase() || "O"}
            </span>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 p-4 sm:p-5">
        <div className="min-w-0">
          <p className="truncate font-mono text-xs tracking-[0.1em] text-accent">
            By {course.creatorName}
          </p>

          <h2 className="mt-1.5 line-clamp-2 font-display text-lg font-semibold leading-snug tracking-tight sm:text-xl">
            {course.name}
          </h2>
        </div>

        <div>
          <progress
            className={`progress h-1.5 w-full ${
              completed ? "progress-success" : "progress-accent"
            }`}
            value={percent}
            max="100"
            aria-label={`${course.name} progress`}
          />

          <div className="mt-2 flex items-center justify-between gap-3 font-mono text-xs">
            <span
              className={`tabular-nums ${
                completed ? "text-success" : "text-base-content/60"
              }`}
            >
              {completed
                ? "Completed ✓"
                : `${course.completedCount}/${course.totalVideos} videos · ${percent}%`}
            </span>

            <span className="text-base-content/60 transition-colors group-hover:text-base-content">
              {completed ? "Review →" : "Continue →"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default LearningCourseCard;
