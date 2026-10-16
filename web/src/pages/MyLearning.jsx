import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getMyLearning } from "../services/courseServices";
import { useToast } from "../components/ToastProvider";
import LearningCourseCard from "../components/LearningCourseCard";

function learningErrorMessage(error) {
  if (error?.isNetwork) {
    return "Unable to reach the server. Check your connection.";
  }
  switch (error?.status) {
    case 401:
      return "Your session has expired. Sign in again.";
    default:
      return error?.isServer
        ? "Something went wrong on our end. Try again in a moment."
        : "Couldn't load your courses. Try again.";
  }
}

function MyLearning() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;

    async function loadLearning() {
      try {
        setLoading(true);
        setError(null);

        const data = await getMyLearning();
        if (cancelled) return;

        setCourses(data ?? []);
      } catch (err) {
        if (cancelled) return;

        setError(err);
        toast.error(learningErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadLearning();

    return () => {
      cancelled = true;
    };
  }, [attempt, toast]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
        My Learning
      </p>

      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
        Pick up where you left off
      </h1>

      <div className="mt-10">
        {loading && (
          <div className="space-y-4" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-32 animate-pulse border border-base-300 bg-base-200 sm:h-36"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-start gap-3">
            <p className="text-base-content/70">{learningErrorMessage(error)}</p>
            <button
              type="button"
              onClick={() => setAttempt((n) => n + 1)}
              className="btn btn-primary btn-sm"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="flex flex-col items-start gap-3">
            <p className="text-base-content/70">
              Mark a lesson as done in any course and it will show up here.
            </p>
            <Link to="/courses" className="btn btn-primary btn-sm">
              Browse courses
            </Link>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="space-y-4">
            {courses.map((course) => (
              <LearningCourseCard key={course.courseId} course={course} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyLearning;
