import { Link } from "react-router";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

function CourseCard({ course, variant }) {
  return (
    <article className="card relative border border-base-300 bg-base-200 shadow-none transition-colors hover:border-accent">
      <div className="card-body">
        {variant === "dashboard" && (
          <Link
            to={`/dashboard/courses/${course.courseId}`}
            className="btn btn-ghost btn-sm btn-square absolute right-4 top-4"
            aria-label="Edit course"
          >
            <PencilSquareIcon className="size-5" />
          </Link>
        )}

        <h2 className="font-display text-2xl font-semibold tracking-tight">
          {course.name}
        </h2>

        {variant !== "dashboard" && (
          <p className="font-mono text-xs tracking-[0.1em] text-accent">
            By {course.creatorName}
          </p>
        )}

        <p className="mt-2 leading-relaxed text-base-content/65">
          {course.description}
        </p>

        <p className="font-mono text-sm text-base-content/60">
          {course.price === 0 ? "Free" : `₹${course.price}`}
        </p>

        <div className="card-actions mt-5">
          <Link
            to={`/courses/${course.courseId}`}
            className="font-mono text-s text-base-content/60 transition-colors hover:text-base-content"
          >
            View course →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default CourseCard;
