import { useState } from "react";
import { createCourse } from "../services/courseServices";

function CourseForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      const response = await createCourse(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-2xl space-y-8 rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm md:p-8"
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-base-content">
          Create Course
        </h1>

        <p className="text-sm text-base-content/60">
          Add the basic information for your new course.
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
            placeholder="e.g. JavaScript Foundations"
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

      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Creating Course..." : "Create Course"}
        </button>
      </div>
    </form>
  );
}

export default CourseForm;
