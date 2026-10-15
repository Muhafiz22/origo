import { useState } from "react";
import { useParams } from "react-router";
import useCourseWithChapters from "../hooks/useCourseWithChapters";
import useCourseProgress from "../hooks/useCourseProgress";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ToastProvider";
import CourseHero from "../components/CourseHero";
import LearningArea from "../components/LearningArea";
import CourseInformation from "../components/CourseInformation";

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

function CourseDetails() {
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
      <CourseHero
        course={course}
        chapterCount={chapters.length}
        status={status}
        progress={{
          loading: progress.loading,
          unavailable: progress.unavailable,
          percent: progress.percent,
          totalVideos: progress.totalVideos,
          completedIds: progress.completedIds,
          videoIds: allVideos.map((video) => video.id),
        }}
      />

      <LearningArea
        chapters={chapters}
        activeVideo={activeVideo}
        chapterNumber={chapterNumber}
        videoNumber={videoNumber}
        previousVideo={previousVideo}
        nextVideo={nextVideo}
        onVideoSelect={handleVideoSelect}
        onPrevious={handlePreviousVideo}
        onNext={handleNextVideo}
        progressUnavailable={progress.unavailable}
        isVideoDone={progress.isDone}
        isVideoPending={progress.isPending}
        onToggleVideoDone={progress.toggleVideo}
      />

      <CourseInformation course={course} />
    </main>
  );
}

export default CourseDetails;
