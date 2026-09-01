import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getCourse } from "../services/courseServices";
import { getChapters } from "../services/chapterServices";
import { getVideos } from "../services/videoServices";
import CourseTree from "../components/courseTree";

function CourseDetails() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadCourse() {
      setLoading(true);
      setError(null);

      try {
        const [courseData, fetchedChapters] = await Promise.all([
          getCourse(courseId),
          getChapters(courseId),
        ]);

        const chaptersWithVideos = await Promise.all(
          fetchedChapters.map(async (chapter) => ({
            ...chapter,
            videos: await getVideos(chapter.id),
          })),
        );

        if (ignore) return;

        setCourse(courseData);
        setChapters(chaptersWithVideos);
      } catch (error) {
        if (!ignore) {
          setError(error);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadCourse();

    return () => {
      ignore = true;
    };
  }, [courseId]);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
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
      <main className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Course
        </p>

        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
          Course not found
        </h1>

        <p className="mt-4 text-base-content/60">
          The course you're looking for doesn't exist or is no longer
          available.
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
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

  function handleVideoSelect(video) {
    setSelectedVideo(video);
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
      <section>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Course
        </p>

        <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          {course.name}
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-base-content/70">
          {course.description}
        </p>

        <div className="mt-8 flex items-center gap-6 font-mono text-sm text-base-content/60">
          <span>
            {course.price === 0 ? "Free" : `₹${course.price}`}
          </span>

          <span className="h-1 w-1 rounded-full bg-base-content/30" />

          <span>
            {chapters.length}{" "}
            {chapters.length === 1 ? "chapter" : "chapters"}
          </span>
        </div>
      </section>

      {/* Curriculum */}
      <section className="mt-16">
        <div className="mb-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-base-content/50">
            Curriculum
          </p>

          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
            Course contents
          </h2>
        </div>

        <div className="border-y border-base-300">
          <CourseTree
            chapters={chapters}
            onVideoSelect={handleVideoSelect}
            selectedVideoId={selectedVideo?.id}
          />
        </div>
      </section>
    </main>
  );
}

export default CourseDetails;
