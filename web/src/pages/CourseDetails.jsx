import { useState } from "react";
import { useParams } from "react-router";
import useCourseWithChapters from "../hooks/useCourseWithChapters";
import CourseHero from "../components/CourseHero";
import LearningArea from "../components/LearningArea";

function CourseDetails() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { courseId } = useParams();
  const { course, chapters, loading, error } = useCourseWithChapters(courseId);

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
    <main className="mx-auto px-4 py-4 lg:px-5">
      <CourseHero course={course} chapterCount={chapters.length} />

      <LearningArea
        chapters={chapters}
        activeVideo={activeVideo}
        previousVideo={previousVideo}
        nextVideo={nextVideo}
        onVideoSelect={handleVideoSelect}
        onPrevious={handlePreviousVideo}
        onNext={handleNextVideo}
      />
    </main>
  );
}

export default CourseDetails;
