import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

function CourseTree({ chapters, onVideoSelect, selectedVideoId, mode="learner"}) {
  const [expandedChapters, setExpandedChapters] = useState(new Set());

  function toggleChapter(chapterId) {
    setExpandedChapters((current) => {
      const next = new Set(current);

      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }

      return next;
    });
  }

  return (
    <div>
      {chapters.map((chapter, index) => {
        const isExpanded = expandedChapters.has(chapter.id);

        return (
          <article key={chapter.id}>
            <div className="flex w-full items-center gap-3 px-4 py-5 hover:bg-base-200/50">
              <button
                type="button"
                onClick={() => toggleChapter(chapter.id)}
                aria-expanded={isExpanded}
                className="flex flex-1 items-center gap-3 text-left transition-colors"
              >
                <span className="w-4 font-mono text-xs text-accent">
                  {isExpanded ? "▼" : "▶"}
                </span>

                <span className="w-6 font-mono text-base-content/60">
                  {String(index+1).padStart(2, "0")}
                </span>

                <span className="font-display text-lg font-semibold">
                  {chapter.title}
                </span>
              </button>

              {mode === "editor" && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm btn-square"
                  aria-label={`Actions for ${chapter.title}`}
                >
                  <EllipsisHorizontalIcon className="size-6" />
                </button>
              )}
            </div>

            {isExpanded && (
              <div className="border-t border-base-300 px-4 pb-5 pl-11">
                <p className="py-4 text-sm leading-relaxed text-base-content/60">
                  {chapter.description}
                </p>

                <div className="space-y-1">
                  {(chapter.videos ?? []).map((video) => {
                    const isSelected = video.id === selectedVideoId;

                    return (
                      <button
                        key={video.id}
                        type="button"
                        onClick={() => onVideoSelect(video)}
                        aria-selected={isSelected ? true : undefined}
                        className={`block w-full rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
                          isSelected
                            ? "bg-base-200 font-semibold text-accent"
                            : "text-base-content/70 hover:bg-base-200/70 hover:text-base-content"
                        }`}
                      >
                        {video.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

export default CourseTree;
