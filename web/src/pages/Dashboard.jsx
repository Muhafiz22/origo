import { Link } from "react-router";
import { useState, useEffect } from "react";
import { getMyCourses } from "../services/courseServices";
import CourseCard from "../components/CourseCard";

function Dashboard() {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMyCourses() {
      try {
        const data = await getMyCourses();

        setMyCourses(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    loadMyCourses();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-6 py-10 md:px-8">
        <div className="flex min-h-64 items-center justify-center rounded-xl border border-base-300 bg-base-100">
          <span className="loading loading-spinner loading-md text-primary"></span>
          <span className="ml-3 text-sm text-base-content/60">
            Loading My Courses...
          </span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-7xl px-6 py-10 md:px-8">
        <div role="alert" className="alert alert-error">
          <span>Error: {error.message}</span>
        </div>
      </main>
    );
  }

  if (myCourses.length === 0) {
    return (
      <main className="mx-auto w-full max-w-7xl space-y-8 px-6 py-10 md:px-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-base-content">
            Dashboard
          </h1>

          <p className="text-base-content/60">
            Manage the courses you've created.
          </p>
        </header>

        <section className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-base-300 bg-base-100 p-8 text-center">
          <h2 className="text-lg font-medium text-base-content">
            No Courses Created
          </h2>

          <p className="mt-2 max-w-md text-sm text-base-content/60">
            You haven't created any courses yet. Start building your first
            course.
          </p>

          <button className="btn btn-primary mt-6">Create Course</button>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-6 py-10 md:px-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-base-content">Dashboard</h1>

        <p className="text-base-content/60">
          Manage the courses you've created.
        </p>
      </header>

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-base-content">
            My Courses
          </h2>

          <Link
            to="/courses/create"
            className="btn btn-primary hover:bg-primary/80"
          >
            Create Course
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {myCourses.map((course) => (
            <CourseCard key={course.courseId} course={course} variant="dashboard"/>
          ))}
        </div>
      </section>
    </main>
  );
}
export default Dashboard;
