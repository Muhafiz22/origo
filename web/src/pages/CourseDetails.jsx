import { useState } from "react";
import { useParams } from "react-router";
import useCourseWithChapters from "../hooks/useCourseWithChapters";
import useCourseProgress from "../hooks/useCourseProgress";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ToastProvider";
import VideoPlayer from "../components/VideoPlayer";
import CourseTree from "../components/CourseTree";
import ProgressCard from "../components/ProgressCard";
import CourseInformation from "../components/CourseInformation";

const SECTION_GRID =
  "grid gap-4 lg:h-[calc(100vh-10rem)] lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]";

function progressErrorMessage(error) {
  if (error?.isNetwork) {
    return "Unable to reach the server. Check your connection.";
  }
  switch (error?.status) {
    case 401:
      return "Your session has expired. Sign in again to save progress.";
    case 403:
      return "You don't have access to this course's progress.";
    case 404:
      return "This video no longer exists.";
    default:
      return error?.isServer
        ? "Something went wrong on our end. Try again in a moment."
        : "Couldn't update progress. Try again.";
  }
}

export default function CourseDetails() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { courseId } = useParams();
  const { course, chapters, loading, error } = useCourseWithChapters(courseId);

  const { status } = useAuth();
  const toast = useToast();
  const progress = useCourseProgress(
    courseId,
    status === "authenticated",
    (err) => toast.error(progressErrorMessage(err)),
  );

  const showProgress =
    Boolean(progress) &&
    !progress.unavailable &&
    progress.completedIds != null &&
    progress.totalVideos > 0;

  const allVideos = chapters.flatMap((chapter) => chapter.videos ?? []);

  const activeVideo = selectedVideo ?? allVideos[0] ?? null;

  const currentIndex = allVideos.findIndex(
    (video) => video.id === activeVideo?.id,
  );

  const previousVideo = currentIndex > 0 ? allVideos[currentIndex - 1] : null;

  const nextVideo =
    currentIndex >= 0 && currentIndex < allVideos.length - 1
      ? allVideos[currentIndex + 1]
      : null;

  const currentChapterIndex = chapters.findIndex((chapter) =>
    chapter.videos?.some((video) => video.id === activeVideo?.id),
  );

  const currentVideoIndex =
    currentChapterIndex >= 0
      ? chapters[currentChapterIndex].videos.findIndex(
          (video) => video.id === activeVideo?.id,
        )
      : -1;

  const chapterNumber =
    currentChapterIndex >= 0 ? currentChapterIndex + 1 : null;

  const videoNumber = currentVideoIndex >= 0 ? currentVideoIndex + 1 : null;

  function handleVideoSelect(video) {
    setSelectedVideo(video);
  }

  function handlePreviousVideo() {
    if (previousVideo) setSelectedVideo(previousVideo);
  }

  function handleNextVideo() {
    if (nextVideo) setSelectedVideo(nextVideo);
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-3 w-20 rounded bg-base-300" />
          <div className="h-12 w-3/4 rounded bg-base-300" />
          <div className="h-5 w-full max-w-2xl rounded bg-base-300" />
          <div className="h-5 w-2/3 max-w-2xl rounded bg-base-300" />
        </div>
      </main>
    );
  }

  if (error?.status === 404) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Course
        </p>

        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
          Course not found
        </h1>

        <p className="mt-4 text-base-content/60">
          The course you're looking for doesn't exist or is no longer available.
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-error">
          Error
        </p>

        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
          Something went wrong
        </h1>

        <p className="mt-4 text-base-content/60">{error.message}</p>
      </main>
    );
  }
  return (
    <main className="mx-auto px-4 py-4 lg:px-4">
      <section className={SECTION_GRID}>
        <div className="min-w-0 min-h-0">
          <VideoPlayer
            chapterNumber={chapterNumber}
            videoNumber={videoNumber}
            video={activeVideo}
            onPrevious={handlePreviousVideo}
            previousVideo={previousVideo}
            onNext={handleNextVideo}
            nextVideo={nextVideo}
          />
        </div>

        <div className="grid min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-4">
          {showProgress && (
            <ProgressCard
              course={course}
              chapterCount={chapters.length}
              percent={progress.percent}
              totalVideos={progress.totalVideos}
              completedIds={progress.completedIds}
              videoIds={allVideos.map((video) => video.id)}
            />
          )}

          <section className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-base-300 bg-base-100">
            <h2 className="shrink-0 border-b border-base-300 px-3 py-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-base-content/60">
              Contents
            </h2>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <CourseTree
                chapters={chapters}
                onVideoSelect={handleVideoSelect}
                progressUnavailable={progress.unavailable}
                isVideoDone={progress.isDone}
                onToggleVideoDone={progress.toggleVideo}
              />
            </div>
          </section>
        </div>
      </section>

      <CourseInformation course={course} chapterCount={chapters.length} />
    </main>
  );
}
