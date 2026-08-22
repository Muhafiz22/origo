import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router";
import { getCourse } from "../services/courseServices";

function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCourse() {
      try {
        const data = await getCourse(id);
        setCourse(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [id]);

  if (loading) {
    return <p>Loading course...</p>;
  }

  if (error?.status === 404) {
    return <p>Course not found</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <main>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <p>Instructor: {course.instructor}</p>
    </main>
  );
}

export default CourseDetails;
