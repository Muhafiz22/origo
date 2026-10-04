import { useEffect, useState } from "react";
import { Link } from "react-router";
import OrigoStamp from "../components/ui/origoStamp";
import CourseCard from "../components/CourseCard";
import { getCourses } from "../services/courseServices";

function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await getCourses();
        setCourses(data.slice(0, 3));
      } catch (error) {
        console.error("Failed to load courses:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_auto]">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              SEEK · LEARN · BECOME
            </p>

            <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-8xl">
              Every craft begins,
              <br />
              with a single page.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-base-content/70 sm:text-xl">
              Course-length screencasts, real projects, and notes that stay
              attached to the moment you took them.
            </p>

            <Link
              to="/courses"
              className="btn mt-9 border-none bg-primary px-6 font-mono text-sm text-primary-content hover:bg-primary/80"
            >
              Start reading →
            </Link>
          </div>

          <div className="flex flex-col items-center">
            <OrigoStamp size={240} className="h-auto w-44 sm:w-52 lg:w-60" />

            <span className="mt-3 font-mono text-[14px] uppercase tracking-[0.3em] text-base-content/60">
              Iqra — Read
            </span>
          </div>
        </div>
      </section>

      <section className="border-y border-base-300">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="flex items-end justify-between gap-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                The collection
              </p>

              <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
                Featured courses
              </h2>
            </div>

            <Link
              to="/courses"
              className="hidden font-mono text-sm text-base-content/60 transition-colors hover:text-base-content sm:block"
            >
              View all →
            </Link>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p className="font-mono text-xs text-base-content/50">
                Loading courses...
              </p>
            ) : (
              courses.map((course) => (
                <CourseCard key={course.courseId} course={course} />
              ))
            )}
          </div>
         </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <span className="font-mono text-xs text-accent">STRUCTURE</span>

            <h2 className="mt-4 font-display text-2xl font-semibold">
              Learn with structure.
            </h2>

            <p className="mt-3 leading-relaxed text-base-content/65">
              Courses are broken into chapters so you always know where you are
              and what comes next.
            </p>
          </div>

          <div>
            <span className="font-mono text-xs text-accent">PRACTICE</span>

            <h2 className="mt-4 font-display text-2xl font-semibold">
              Build as you learn.
            </h2>

            <p className="mt-3 leading-relaxed text-base-content/65">
              Concepts become useful when you put them into practice. Origo
              keeps the focus on making things.
            </p>
          </div>

          <div>
            <span className="font-mono text-xs text-accent">PROGRESS</span>

            <h2 className="mt-4 font-display text-2xl font-semibold">
              Keep your progress.
            </h2>

            <p className="mt-3 leading-relaxed text-base-content/65">
              Your course and chapter progress gives you a visible record of how
              far you've travelled.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-base-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p className="font-display text-lg font-semibold">Origo</p>

          <p className="font-mono text-xs text-base-content/45">
            Learn. Build. Continue.
          </p>
        </div>
      </footer>
    </main>
  );
}

export default Home;
