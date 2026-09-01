import { Link } from "react-router";

function CourseCard({course}) {
  return (
    <article className="card border border-base-300 bg-base-200 shadow-none transitions-colors hover:border-accent">
      <div className="card-body">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-accent">
          Course
        </p>

        <h2 className="font-display text-2xl font-semi-bold tracking-tight">
          {course.name}
        </h2>

        <p className="mt-2 leading-relaxed text-base-content/65">
          {course.description}
        </p>

        <p className="font-mono text-sm text-base-content/60">
          {course.price === 0 ? "Free" : `₹${course.price}`}
        </p>

        <div className="card-actions mt-5">
          <Link
            to={`/courses/${course.courseId}`}
            className="font-mono text-xs text-base-content/60 transition-colors hover:text-base-content"
          >
            View course →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default CourseCard;
