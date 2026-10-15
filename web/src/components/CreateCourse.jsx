import { useNavigate } from "react-router";
import CourseForm from "../components/CourseForm";

export function CreateCourse() {
  const navigate = useNavigate();

  return (
    <main className="grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-8">
      <div className="w-full max-w-lg">
        <CourseForm
          mode="create"
          onSuccess={() => navigate("/dashboard")}
          onCancel={() => navigate(-1)}
        />
      </div>
    </main>
  );
}

export default CreateCourse;
