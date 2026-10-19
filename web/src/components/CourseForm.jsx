import { useId, useState } from "react";
import { createCourse, updateCourse } from "../services/courseServices";

export function CourseForm({
  mode = "create",
  initialData = null,
  onSuccess,
  onCancel,
}) {
  const id = useId();

  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );

  const [price, setPrice] = useState(String(initialData?.price ?? 0));
  const [thumbnail, setThumbnail] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleThumbnailChange(event) {
    const selected = event.target.files[0];

    if (!selected) {
      setThumbnail(null);
      return;
    }

    const validExts = [".jpg", ".jpeg", ".png", ".webp"];
    const validTypes = ["image/jpeg", "image/png", "image/webp"];

    const ext = selected.name
      .slice(selected.name.lastIndexOf("."))
      .toLowerCase();

    if (!validExts.includes(ext) || !validTypes.includes(selected.type)) {
      setThumbnail(null);
      setError("Thumbnail must be a JPG, PNG, or WebP image");

      event.target.value = "";
      return;
    }

    setThumbnail(selected);
    setError(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setError("Name cannot be empty");
      return;
    }

    const parsedPrice = price === "" ? 0 : Number(price);

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setError("Price must be 0 or more");
      return;
    }

    let result;

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();

      formData.append("name", trimmedName);
      formData.append("description", trimmedDescription);
      formData.append("price", String(parsedPrice));

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      if (mode === "create") {
        result = await createCourse(formData);
      } else {
        result = await updateCourse(
          initialData.courseId ?? initialData.id,
          formData,
        );
      }
    } catch (err) {
      setError(err.message);
      return;
    } finally {
      setLoading(false);
    }

    onSuccess?.(result);
  }

  return (
    <div className="mx-auto w-full max-w-lg rounded-box border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {mode === "create" ? "New Course" : "Edit Course"}
        </p>

        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
          {mode === "create" ? "Create a course" : "Edit course"}
        </h2>

        <p className="mt-2 text-sm text-base-content/60">
          {mode === "create"
            ? "Set up a new course. You can add chapters afterwards."
            : "Update the course details."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-md border border-error/30 bg-error/5 px-4 py-3 text-sm font-medium text-error">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor={`${id}-name`}
            className="mb-2 block text-sm font-medium"
          >
            Name
          </label>

          <input
            id={`${id}-name`}
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={100}
            disabled={loading}
            required
            placeholder="e.g. Go for Backend Developers"
            className="input input-bordered w-full"
          />

          <div className="mt-1 text-right font-mono text-xs text-base-content/40">
            {name.length}/100
          </div>
        </div>

        <div>
          <label
            htmlFor={`${id}-description`}
            className="mb-2 block text-sm font-medium"
          >
            Description
          </label>

          <textarea
            id={`${id}-description`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={500}
            disabled={loading}
            rows={4}
            placeholder="What will students learn in this course?"
            className="textarea textarea-bordered w-full resize-none"
          />

          <div className="mt-1 text-right font-mono text-xs text-base-content/40">
            {description.length}/500
          </div>
        </div>

        <div>
          <label
            htmlFor={`${id}-price`}
            className="mb-2 block text-sm font-medium"
          >
            Price (₹)
          </label>

          <input
            id={`${id}-price`}
            type="number"
            min="0"
            step="1"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            disabled={loading}
            className="input input-bordered w-full"
          />

          <p className="mt-2 text-xs text-base-content/50">
            Leave at 0 for a free course.
          </p>
        </div>

        <div>
          <label
            htmlFor={`${id}-thumbnail`}
            className="mb-2 block text-sm font-medium"
          >
            Thumbnail <span className="text-base-content/40">(optional)</span>
          </label>

          <input
            id={`${id}-thumbnail`}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleThumbnailChange}
            disabled={loading}
            className="file-input file-input-bordered w-full"
          />

          <p className="mt-2 text-xs text-base-content/50">
            {mode === "edit"
              ? "JPEG, PNG, or WebP. Leave empty to keep the current thumbnail."
              : "JPEG, PNG, or WebP image."}
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => onCancel?.()}
            className="btn btn-ghost hover:text-accent"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary min-w-24"
            disabled={loading || 
              (mode === "create" && (!name || !description))
            }
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Saving...
              </>
            ) : mode === "create" ? (
              "Create Course"
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CourseForm;
