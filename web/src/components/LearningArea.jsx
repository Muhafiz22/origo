const SECTION_GRID =
  "grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(300px,3fr)] lg:items-start";

import VideoPlayer from "../components/VideoPlayer";
import CourseTree from "../components/CourseTree";

function LearningArea({
  chapters,
  activeVideo,
  previousVideo,
  nextVideo,
  onVideoSelect,
  onPrevious,
  onNext,
}) {
  return (
    <section className={`mt-16 ${SECTION_GRID}`}>
      <div>
        <VideoPlayer
          video={activeVideo}
          onPrevious={onPrevious}
          previousVideo={previousVideo}
          onNext={onNext}
          nextVideo={nextVideo}
        />
      </div>

      <div>
        <div className="mb-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-base-content/50">
            Curriculum
          </p>

          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
            Course contents
          </h2>
        </div>

        <CourseTree
          chapters={chapters}
          onVideoSelect={onVideoSelect}
          selectedVideoId={activeVideo?.id}
        />
      </div>
    </section>
  );
}

export default LearningArea;
