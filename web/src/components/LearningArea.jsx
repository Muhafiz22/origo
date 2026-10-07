const SECTION_GRID =
  "grid gap-4 lg:grid-cols-[minmax(0,7.5fr)_minmax(300px,2.5fr)]";

import VideoPlayer from "../components/VideoPlayer";
import CourseTree from "../components/CourseTree";

function LearningArea({
  chapters,
  activeVideo,
  chapterNumber,
  videoNumber,
  previousVideo,
  nextVideo,
  onVideoSelect,
  onPrevious,
  onNext,
}) {
  return (
    <section className={`mt-4 ${SECTION_GRID}`}>
      <div>
        <VideoPlayer
          chapterNumber={chapterNumber}
          videoNumber={videoNumber}
          video={activeVideo}
          onPrevious={onPrevious}
          previousVideo={previousVideo}
          onNext={onNext}
          nextVideo={nextVideo}
        />
      </div>

      <div className="lg:relative">
        <div className="flex flex-col lg:absolute lg:inset-0">
          <div className="mb-4 shrink-0">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-base-content/50">
              Curriculum
            </p>

            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
              Course contents
            </h2>
          </div>

          <div className="max-h-96 min-h-0 overflow-y-auto rounded-lg border border-base-300 lg:max-h-none lg:flex-1">
            <CourseTree
              chapters={chapters}
              onVideoSelect={onVideoSelect}
              selectedVideoId={activeVideo?.id}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default LearningArea;
