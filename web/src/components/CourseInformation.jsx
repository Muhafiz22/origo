function CourseInformation({ course }) {
  return (
    <section className="mt-12 max-w-4xl">
      <h2 className="font-display text-2xl font-semibold">About this course</h2>

      <p className="mt-4 text-base leading-relaxed text-base-content/70">
        {course.description}
      </p>
    </section>
  );
}

export default CourseInformation;
