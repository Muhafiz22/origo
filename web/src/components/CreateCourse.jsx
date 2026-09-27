import { useNavigate } from "react-router";
import CourseForm from "./CourseForm";

export function CreateCourse() {
  const navigate = useNavigate();

  return <CourseForm mode="create" onCancel={() => navigate("/dashboard")} />;
}
