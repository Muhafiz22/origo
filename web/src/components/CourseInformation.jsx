function CourseInformation({ course }) {
  return (
    <section className="mt-16 border-t border-base-300 pt-8 sm:mt-20 sm:pt-10">
      <div className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Course overview
        </p>

        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          About this course
        </h2>

        <p className="mt-5 max-w-2xl text-base leading-8 text-base-content/70">
          {course.description ||
            "No description is available for this course yet."}
        </p>
      </div>
    </section>
  );
}

export default CourseInformation;
