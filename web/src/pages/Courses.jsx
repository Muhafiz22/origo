import CourseList from "../components/CourseList";

function Courses() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            The Collection
          </p>

          <h1 className="mt-3 font-display text-5xl font-semibold tracking-light sm:text-6xl">
            Courses
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-base-content/70">
            Course-length lessons, practical projects, and notes designed to
            help you build something that lasts.
          </p>
        </div>

        <div className="mt-14">
          <CourseList />
        </div>
      </section>
    </main>
  );
}

export default Courses;
