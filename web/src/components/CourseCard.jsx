import { Link } from "react-router";

function CourseCard({ id, title, instructor, description }) {
  return (
    <article>
      <h2>{title}</h2>
      <p>Instructor: {instructor}</p>
      <p>{description}</p>

      <Link to={`/courses/${id}`}>View Course</Link>
    </article>
  );
}

export default CourseCard;
