import { useEffect, useState } from "react";
import { getCourses } from "../services/courseServices";
import CourseCard from "./CourseCard";

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
        setError(error);
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
    return <p>Error: {error.message}</p>;
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
