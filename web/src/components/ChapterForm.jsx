import { useState, useEffect } from "react";
import { createChapter, updateChapter } from "../services/chapterServices";

function ChapterForm({
  courseId,
  mode = "create",
  initialData = null,
  onSuccess,
  onCancel,
  isOpen,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isCreateMode = mode === "create";

  const formTitle = isCreateMode ? "Create Chapter" : "Edit Chapter";
  const formDescription = isCreateMode
    ? "Add the basic information for your new chapter"
    : "Update the information for this chapter";

  const submitLabel = isCreateMode ? "Create Chapter" : "Save Changes";
  const loadingLabel = isCreateMode ? "Creating..." : "Saving Changes...";

  useEffect(() => {
    if (!isOpen) return;
    setTitle(initialData?.title ?? "");
    setDescription(initialData?.description ?? "");
    setError(null);
  }, [isOpen, initialData]);

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const data = {
        title,
        description,
      };

      if (isCreateMode) {
        const response = await createChapter(courseId, data);
        onSuccess(response);
      } else {
        const response = await updateChapter(initialData.id, data);
        onSuccess?.(response);
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
            {formTitle}
          </h1>
          <p className="text-sm text-base-content/60">{formDescription}</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-base-content"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              autoComplete="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Introduction"
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
              placeholder="Describe what students will learn in this chapter..."
              rows={6}
              className="textarea textarea-bordered w-full resize-none"
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
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              loading || (mode === "create" && (!title || !description))
            }
            className="btn btn-primary hover:bg-primary/80"
          >
            {loading ? loadingLabel : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChapterForm;
