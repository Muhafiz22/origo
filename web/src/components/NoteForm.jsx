import { useId, useState } from "react";
import { createNote, updateNote } from "../services/noteServices";

function NoteForm({
  mode = "create",
  chapterId,
  initialData = null,
  onSuccess,
  onCancel,
}) {
  const id = useId();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleFileChange(event) {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    const validExts = [
      ".pdf",
      ".ppt",
      ".pptx",
      ".doc",
      ".docx",
      ".txt",
      ".md",
      ".png",
      ".jpg",
      ".jpeg",
      ".webp",
    ];

    const validTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/markdown",
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    const ext = selectedFile.name
      .slice(selectedFile.name.lastIndexOf("."))
      .toLowerCase();

    if (!validExts.includes(ext) || !validTypes.includes(selectedFile.type)) {
      setFile(null);
      setError("File not supported");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
    setError(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Title cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (mode === "create") {
        if (!file) {
          setError("Select a valid file first");
          return;
        }

        const formData = new FormData();

        formData.append("title", trimmedTitle);
        formData.append("description", description);
        formData.append("note", file);

        const newNote = await createNote(chapterId, formData);

        onSuccess(newNote);
        return;
      }

      const updatedNote = await updateNote(
        initialData.noteId ?? initialData.id,
        {
          title: trimmedTitle,
          description,
        },
      );

      onSuccess(updatedNote);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {mode === "create" ? "New Note" : "Edit Note"}
        </p>

        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
          {mode === "create" ? "Add a note" : "Edit note"}
        </h2>

        <p className="mt-2 text-sm text-base-content/60">
          {mode === "create"
            ? "Add a study note or supporting material to this chapter."
            : "Update the note title and description."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label
            htmlFor={`${id}-title`}
            className="mb-2 block text-sm font-medium"
          >
            Title
          </label>

          <input
            id={`${id}-title`}
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={100}
            disabled={loading}
            placeholder="e.g. JavaScript Arrays"
            className="input input-bordered w-full"
          />

          <div className="mt-1 text-right font-mono text-xs text-base-content/40">
            {title.length}/100
          </div>
        </div>

        {/* Description */}
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
            placeholder="Briefly describe this note..."
            className="textarea textarea-bordered w-full resize-none"
          />

          <div className="mt-1 text-right font-mono text-xs text-base-content/40">
            {description.length}/500
          </div>
        </div>

        {/* File */}
        {mode === "create" && (
          <div>
            <label
              htmlFor={`${id}-file`}
              className="mb-2 block text-sm font-medium"
            >
              File
            </label>

            <input
              id={`${id}-file`}
              type="file"
              onChange={handleFileChange}
              disabled={loading}
              accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.md,.png,.jpg,.jpeg,.webp"
              className="file-input file-input-bordered w-full"
            />

            <p className="mt-2 text-xs text-base-content/50">
              PDF, PowerPoint, Word, text, Markdown, or image files.
            </p>

            {file && (
              <p className="mt-2 truncate font-mono text-xs text-base-content/60">
                Selected: {file.name}
              </p>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-md border border-error/30 bg-error/5 px-4 py-3 text-sm font-medium text-error">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn btn-ghost hover:text-accent"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || (mode === "create" && !title)}
            className="btn btn-primary min-w-24"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Saving...
              </>
            ) : mode === "create" ? (
              "Add Note"
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NoteForm;
