import { useEffect, useState } from "react";
import { getCourses } from "../services/courseServices";
import { useToast } from "./ToastProvider";
import CourseCard from "./CourseCard";

function courseListErrorMessage(error) {
  if (error?.isNetwork) {
    return "Unable to reach the server. Check your connection.";
  }
  return error?.isServer
    ? "Something went wrong on our end. Try again in a moment."
    : "Couldn't load courses. Try again.";
}

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;

    async function loadCourses() {
      try {
        setLoading(true);
        setError(null);

        const data = await getCourses();
        if (cancelled) return;

        setCourses(data ?? []);
      } catch (err) {
        if (cancelled) return;

        setError(err);
        toast.error(courseListErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCourses();

    return () => {
      cancelled = true;
    };
  }, [attempt, toast]);

  if (loading) {
    return <p>Loading courses...</p>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-base-content/70">{courseListErrorMessage(error)}</p>
        <button
          type="button"
          onClick={() => setAttempt((n) => n + 1)}
          className="btn btn-primary btn-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  if (courses.length === 0) {
    return <p>No courses available.</p>;
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.courseId} course={course} />
      ))}
    </div>
  );
}

export default CourseList;
