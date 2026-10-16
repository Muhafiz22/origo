import { useState } from "react";
import { Link } from "react-router";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

const API_URL = import.meta.env.VITE_API_URL ?? "";

function CourseCard({ course, variant }) {
  const [imageFailed, setImageFailed] = useState(false);

  const thumbnailSrc =
    course.thumbnailUrl && !imageFailed
      ? `${API_URL}${course.thumbnailUrl}`
      : null;

  return (
    <article className="card relative overflow-hidden border border-base-300 bg-base-200 shadow-none transition-colors hover:border-accent">
      <figure className="aspect-video w-full bg-base-300">
        {thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-accent/30 to-base-300">
            <span className="font-display text-5xl font-semibold text-base-content/40">
              {course.name?.charAt(0).toUpperCase() || "O"}
            </span>
          </div>
        )}
      </figure>

      {variant === "dashboard" && (
        <Link
          to={`/dashboard/courses/${course.courseId}`}
          className="btn btn-sm btn-square absolute right-3 top-3 border-none bg-base-100/80 hover:bg-base-100"
          aria-label="Edit course"
        >
          <PencilSquareIcon className="size-5" />
        </Link>
      )}

      <div className="card-body flex-1">
        <h2 className="font-display text-xl font-semibold tracking-tight">
          {course.name}
        </h2>

        {variant !== "dashboard" && (
          <p className="font-mono text-xs tracking-[0.1em] text-accent">
            By {course.creatorName}
          </p>
        )}

        <p className="line-clamp-3 leading-relaxed text-base-content/65">
          {course.description}
        </p>

        <p className="font-mono text-sm text-base-content/60">
          {course.price === 0 ? "Free" : `₹${course.price}`}
        </p>

        <div className="card-actions mt-auto pt-4">
          <Link
            to={`/courses/${course.courseId}`}
            className="font-mono text-sm text-base-content/60 transition-colors hover:text-base-content"
          >
            View course →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default CourseCard;
