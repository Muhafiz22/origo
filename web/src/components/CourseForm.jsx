import { useState } from "react";

function CourseForm({ onCourseCreated }){
  const [title, setTitle] = useState("");
  const [instructor, setInstructor] = useState("");

  function handleSubmit(event){
    event.preventDefault();

    const course = {
      title, 
      instructor,
    };
    onCourseCreated(course);
  }

  return (
    <form onSubmit = {handleSubmit}>
      <input
        type = "text"
        placeholder = "title"
        value = {title}
        onChange = {(event) => setTitle(event.target.value)}
      />

      <input
        type = "text"
        placeholder = "instructor"
        value = {instructor}
        onChange = {(event) => setInstructor(event.target.value)}
      />

      <button type = "submit">
        Create Course
      </button>
    </form>
  )
}

export default CourseForm;
