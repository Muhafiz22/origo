import { useEffect, useState } from "react";
import { getCourses } from "../services/courseServices";

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await getCourses();

        setCourses(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  if (loading) {
    return <p>Loading courses...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (courses.length === 0) {
    return <p>No courses available.</p>;
  }

  return (
    <main>
      {courses.map((course) => (
        <article key={course.id}>
          <h2>{course.title}</h2>
          <p>{course.description}</p>
        </article>
      ))}
    </main>
  );
}

export default CourseList;
