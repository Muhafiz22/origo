import { useState, useEffect } from "react";
import { getVideoContent } from "../services/videoServices";
import { Link, useLocation } from "react-router";
import { useToast } from "./ToastProvider";

function videoErrorMessage(error) {
  switch (error?.status) {
    case 401:
      return "Sign in to watch this lesson.";
    case 403:
      return "This is a paid course. Purchase the course to access its contents.";
    default:
      return "Unable to load this video";
  }
}

function VideoPlayer({
  chapterNumber,
  videoNumber,
  video,
  onPrevious,
  previousVideo,
  onNext,
  nextVideo,
}) {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const toast = useToast();

  useEffect(() => {
    if (!video) {
      setVideoUrl(null);
      return;
    }

    let cancelled = false;
    let objectUrl = null;

    async function loadVideo() {
      try {
        setLoading(true);
        setError(null);

        const blob = await getVideoContent(video.id);
        if (cancelled) return;

        objectUrl = URL.createObjectURL(blob);
        setVideoUrl(objectUrl);
      } catch (err) {
        if (cancelled) return;
        setError(err);
        setVideoUrl(null);
        toast.error(videoErrorMessage(err))
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadVideo();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [video]);

  function handleSubscribe(){
    toast.info("This feature hasn't been implemented yet. Stay tuned!");
  }

  return (
    <div>
      {!video && (
        <div className="flex aspect-video items-center justify-center rounded-lg bg-base-200">
          <p className="text-base-content/70">
            No lessons have been uploaded yet. Check back later.
          </p>
        </div>
      )}

      {video && loading && (
        <div className="flex aspect-video items-center justify-center rounded-lg bg-base-200">
          <span className="loading loading-spinner loading-md" />
        </div>
      )}

      {video && error && (
        <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-lg bg-base-200 px-4 text-center">
          <p className="font-semibold text-error">{videoErrorMessage(error)}</p>

          {error.status === 401 && (
            <Link
              to="/login"
              state={{ from: location.pathname + location.search }}
              className="btn btn-primary btn-sm"
            >
              Sign in
            </Link>
          )}

          {error.status === 403 && (
            <button 
              onClick={handleSubscribe}
              className="btn btn-primary btn-sm">
              Subscribe
            </button>
          )}
        </div>
      )}

      {video && videoUrl && !loading && !error && (
        <video
          key={video.id}
          src={videoUrl}
          controls
          className="aspect-video w-full rounded-lg"
        />
      )}

      {video && (
        <div className="mt-2 grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-6 border-t border-base-300 pt-6">
          <button
            type="button"
            onClick={onPrevious}
            disabled={!previousVideo}
            className="btn btn-ghost border border-base-content/60 bg-base-200 hover:text-accent"
          >
            Previous
          </button>

          <div className="min-w-0 font-display text-xl font-semibold">
            {chapterNumber && videoNumber && (
              <span className="mr-4 font-mono text-sm font-normal text-base-content/50">
                Ch {chapterNumber} · Vid {videoNumber}
              </span>
            )}
            <span className="block sm:inline">{video.title}</span>
          </div>

          <button
            type="button"
            onClick={onNext}
            disabled={!nextVideo}
            className="btn btn-primary hover:btn-primary/80"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
