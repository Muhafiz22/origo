import { useEffect, useId, useRef, useState } from "react";
import { createVideo, updateVideo } from "../services/videoServices";

function VideoForm({
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
  const [duration, setDuration] = useState(initialData?.duration ?? 0);

  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [metaDataReady, setMetaDataReady] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  function handleFileChange(event) {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    const validExts = [".mp4", ".webm", ".ogg"]; 
    const validFileTypes = ["video/mp4", "video/webm", "video/ogg"]

    const ext = selectedFile.name
      .slice(selectedFile.name.lastIndexOf("."))
      .toLowerCase();

    if (!validExts.includes(ext) || !validFileTypes.includes(selectedFile.type)) {
      setFile(null);
      setDuration(0);
      setMetaDataReady(false);
      setError("Video must be a mp4, webm or ogg file");

      event.target.value = "";
      return;
    }

    setFile(selectedFile);
    setDuration(0);
    setMetaDataReady(false);
    setError(null);

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(selectedFile);

    objectUrlRef.current = objectUrl;
    videoRef.current.src = objectUrl;
  }

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

  function handleLoadedMetadata() {
    const video = videoRef.current;

    if (!video || !Number.isFinite(video.duration)) {
      setError("Unable to read video duration");
      setMetaDataReady(false);
      return;
    }

    setDuration(Math.round(video.duration));
    setMetaDataReady(true);
  }

  function handleMetadataError() {
    setDuration(0);
    setMetaDataReady(false);
    setError("Unable to read video metadata. Please select another MP4.");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      setError("Title cannot be empty");
      return;
    }

  // Creating a video requires a new video file.
    if (mode === "create" && (!file || !metaDataReady)) {
      setError("Select a valid video and wait for its metadata to load");
      return;
    }

  // If replacing a video, wait for its metadata.
    if (mode === "edit" && file && !metaDataReady) {
      setError("Wait for the video metadata to load");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();

      formData.append("title", trimmedTitle);
      formData.append("description", trimmedDescription);
      formData.append("duration", String(duration));

    // Include video only when a new file is selected.
      if (file) {
        formData.append("video", file);
      }

    // Thumbnail is optional in both modes.
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      let result;

      if (mode === "create") {
        result = await createVideo(chapterId, formData);
      } else {
        result = await updateVideo(
          initialData.videoId ?? initialData.id,
          formData,
        );
      }

      onSuccess?.(result);
    } catch (error) {
      setError(error.message || "Failed to save video");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {mode === "create" ? "New Video" : "Edit Video"}
        </p>

        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
          {mode === "create" ? "Add a video" : "Edit video"}
        </h2>

        <p className="mt-2 text-sm text-base-content/60">
          {mode === "create"
            ? "Add a video lesson to this chapter."
            : "Update the video's title and description."}
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
            required
            placeholder="e.g. Introduction to Variables"
            className="input input-bordered w-full"
          />

          <div className="mt-1 text-right font-mono text-xs text-base-content/40">
            {title.length}/100
          </div>
        </div>

        <div>
          <label
            htmlFor={`${id}-description`}
            className="mb-2 block text-sm font-medium"
          >
            Description <span className="text-xs text-base-content/50">(optional)</span>
          </label>

          <textarea
            id={`${id}-description`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={500}
            disabled={loading}
            rows={4}
            placeholder="Briefly describe what this video covers..."
            className="textarea textarea-bordered w-full resize-none"
          />

          <div className="mt-1 text-right font-mono text-xs text-base-content/40">
            {description.length}/500
          </div>
        </div>

        <div>
          <label
            htmlFor={`${id}-video`}
            className="mb-2 block text-sm font-medium"
          >
            Video
          </label>

          <input
            id={`${id}-video`}
            type="file"
            accept="video/mp4,video/webm,video/ogg"
            onChange={handleFileChange}
            disabled={loading}
            required={mode === "create"}
            className="file-input file-input-bordered w-full"
          />

          <p className="mt-2 text-xs text-base-content/50">
            {mode === "edit"
              ? "MP4, WEBM or OGG. Leave empty to keep the current video."
              :  "MP4, WebM or OGG video."}
          </p>

          {metaDataReady && (
            <p className="mt-2 font-mono text-xs text-base-content/60">
              Duration: {duration} seconds
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={`${id}-thumbnail`}
            className="mb-2 block text-sm font-medium"
          >
            Thumbnail <span className="text-xs text-base-content/50">(optional)</span>
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

        <video
          ref={videoRef}
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleMetadataError}
          className="hidden"
          preload="metadata"
        />

        <div className="flex justify-end gap-3 pt-2">
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
            className="btn btn-primary min-w-24"
            disabled={
              loading ||
              (mode === "create" && (!file || !metaDataReady)) ||
              (mode === "edit" && file !== null && !metaDataReady)
            }
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Saving...
              </>
            ) : mode === "create" ? (
              "Add Video"
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default VideoForm;
