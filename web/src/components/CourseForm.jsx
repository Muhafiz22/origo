import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { createCourse, updateCourse } from "../services/courseServices";

function CourseForm({
  mode="create",
  initialData = null,
  onSuccess,
  onCancel,
}) {
  const [name, setName] = useState(initialData?.name?? "")
  const [description, setDescription] = useState(initialData?.description?? "");
  const [price, setPrice] = useState(initialData?.price?? 0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const isCreateMode = mode === "create"
  
  const heading = isCreateMode ? "Create Course" : "Edit Course"
  const formDescription = isCreateMode 
  ? " Add the basic information for your new course."
  : "Edit the course informations"

  const submitLabel = isCreateMode ? "Create Course" : "Save Changes"
  const loadingLabel = isCreateMode ? "Creating Course" : "Saving Changes"


  useEffect(() => {
    setName(initialData?.name?? "")
    setDescription(initialData?.description??"")
    setPrice(initialData?.price?? 0)
    setError(null)
  }, [initialData])

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const data = {
        name,
        description,
        price,
      };
      const response = 
        mode === "create"
        ? await createCourse(data)
        : await updateCourse(initialData.courseId, data)
      
      onSuccess?.(response)

      if(mode === "create"){
        navigate("/dashboard")
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-2xl space-y-8 rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm md:p-8"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-base-content">
            {heading}
          </h1>

          <p className="text-sm text-base-content/60">
           {formDescription}
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-base-content"
            >
              Title
            </label>

            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. JavaScript Beginner to Advance"
              className="input input-bordered w-full"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-base-content"
            >
              Description
            </label>

            <textarea
              id="description"
              autoComplete="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe what students will learn in this course..."
              rows={6}
              className="textarea textarea-bordered w-full resize-none"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="text-sm font-medium text-base-content"
            >
              Price
            </label>

            <input
              id="price"
              type="number"
              autoComplete="price"
              value={price}
              onChange={(event) => setPrice(Number(event.target.value))}
              placeholder="Set the price for your course (default zero - free)"
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {error && (
          <div role="alert" className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-ghost hover:text-accent"
          >
            Cancel
          </button>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary hover:bg-primary/80">
            {loading ? loadingLabel : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CourseForm;
