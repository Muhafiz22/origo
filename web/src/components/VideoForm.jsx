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

    const ext = selectedFile.name
      .slice(selectedFile.name.lastIndexOf("."))
      .toLowerCase();

    if (ext !== ".mp4" || selectedFile.type !== "video/mp4") {
      setFile(null);
      setDuration(0);
      setMetaDataReady(false);
      setError("Video must be an MP4 file");

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

    if (!selected) return;

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

    let trimmedTitle = title.trim();
    let trimmedDescription = description.trim();

    if (!trimmedTitle) {
      setError("Title cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (mode === "create") {
        if (!file || !thumbnail || !metaDataReady) {
          setError("Select a valid video and thumbnail first");
          return;
        }

        const formData = new FormData();

        formData.append("title", trimmedTitle);
        formData.append("description", trimmedDescription);
        formData.append("duration", String(duration));
        formData.append("video", file);
        formData.append("thumbnail", thumbnail);

        const newVideo = await createVideo(chapterId, formData);

        onSuccess(newVideo);
        return;
      }

      const updatedVideo = await updateVideo(
        initialData.videoId ?? initialData.id,
        {
          title: trimmedTitle,
          description: trimmedDescription,
        },
      );

      onSuccess(updatedVideo);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <h2 className="font-display text-2xl font-semibold">
            {mode === "create" ? "Add Video" : "Edit Video"}
          </h2>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <div>
          <label htmlFor={`${id}-title`} className="label">
            <span className="label-text">Title</span>
          </label>

          <input
            id={`${id}-title`}
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label htmlFor={`${id}-description`} className="label">
            <span className="label-text">Description</span>
          </label>

          <textarea
            id={`${id}-description`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="textarea textarea-bordered w-full"
            rows={4}
          />
        </div>

        {mode === "create" && (
          <div>
            <label htmlFor={`${id}-video`} className="label">
              <span className="label-text">Video (MP4)</span>
            </label>

            <input
              id={`${id}-video`}
              type="file"
              accept="video/mp4"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full"
              required
            />

            {metaDataReady && (
              <p className="mt-2 text-sm text-base-content/60">
                Duration: {duration} seconds
              </p>
            )}
          </div>
        )}

        {mode === "create" && (
          <div>
            <label htmlFor={`${id}-thumbnail`} className="label">
              <span className="label-text">Thumbnail</span>
            </label>

            <input
              id={`${id}-thumbnail`}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleThumbnailChange}
              className="file-input file-input-bordered w-full"
              required
            />
          </div>
        )}

        {mode === "edit" && (
          <div>
            <label htmlFor={`${id}-duration`} className="label">
              <span className="label-text">Duration (seconds)</span>
            </label>

            <input
              id={`${id}-duration`}
              type="number"
              value={duration}
              className="input input-bordered w-full"
              disabled
            />
          </div>
        )}

        <video
          ref={videoRef}
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleMetadataError}
          className="hidden"
          preload="metadata"
        />

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
            className="btn btn-primary hover:bgprimary/80"
            disabled={
              loading ||
              (mode === "create" && (!file || !thumbnail || !metaDataReady))
            }
          >
            {loading
              ? "Saving..."
              : mode === "create"
                ? "Add Video"
                : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default VideoForm;
