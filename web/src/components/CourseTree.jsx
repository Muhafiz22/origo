import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import ActionMenu from "./ActionMenu";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { PlayIcon } from "lucide-react";

function CourseTree({
  chapters,
  onVideoSelect,
  selectedVideoId,
  mode = "learner",
  onEditChapter,
  onDeleteChapter,
  onAddVideo,
  onEditVideo,
  onDeleteVideo,
  onAddNote,
  onEditNote,
  onDeleteNote,
}) {
  const [expandedChapters, setExpandedChapters] = useState(new Set());
  const selectedRowRef = useRef(null);
  const pendingScrollRef = useRef(false);

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

  useEffect(() => {
    if (!selectedVideoId) {
      return;
    }

    const chapter = chapters.find((chapter) =>
      (chapter.videos ?? []).some((video) => video.id === selectedVideoId),
    );

    if (!chapter) {
      return;
    }

    pendingScrollRef.current = true;

    setExpandedChapters((current) => {
      const next = new Set(current);
      next.add(chapter.id);
      return next;
    });
  }, [selectedVideoId, chapters]);


  useEffect(() => {
    if (!pendingScrollRef.current || !selectedRowRef.current) {
      return;
    }

    selectedRowRef.current.scrollIntoView({ block: "nearest" });
    pendingScrollRef.current = false;
  }, [selectedVideoId, expandedChapters]);

  return (
    <div>
      {chapters.map((chapter, index) => {
        const isExpanded = expandedChapters.has(chapter.id);

        return (
          <article key={chapter.id}>
            <div className="group flex w-full items-center gap-3 px-4 py-5 hover:bg-base-200/50">
              <button
                type="button"
                onClick={() => toggleChapter(chapter.id)}
                aria-expanded={isExpanded}
                className="flex flex-1 items-center gap-3 text-left transition-colors"
              >
                <span className="w-4 font-mono text-xs text-accent">
                  {isExpanded 
                    ? <ChevronDownIcon className="size-5" />
                    : <ChevronRightIcon className="size-5" />
                  }
                </span>

                <span className="w-6 font-mono text-base-content/60">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="font-display text-lg font-semibold">
                  {chapter.title}
                </span>
              </button>

              {mode === "editor" && (
                <ActionMenu
                  label={`Actions for ${chapter.title}`}
                  onEdit={() => onEditChapter(chapter)}
                  onDelete={() => onDeleteChapter(chapter)}
                />
              )}
            </div>

            {isExpanded && (
              <div className="border-t border-base-300 px-4 pb-5 pl-11">
                {mode === "editor" && (
                  <p className="py-4 text-sm leading-relaxed text-base-content/70">
                    {chapter.description}
                  </p>
                )}

                <div className="mt-2 space-y-1">
                  {mode === "editor" && (chapter.videos ?? []).length === 0 && (
                    <p className="px-3 py-2 text-sm text-base-content/50">
                      No Videos yet
                    </p>
                  )}

                  {(chapter.videos ?? []).map((video) => {
                    const isSelected = video.id === selectedVideoId;

                    return (
                      <div
                        key={video.id}
                        ref={isSelected ? selectedRowRef : null}
                        className="group flex items-center gap-2"
                      >
                        <PlayIcon 
                        className={`size-4 shrink-0 ${
                          isSelected ? "text-accent" : "text-base-content/40"
                          }`}
                        />

                        <button
                          type="button"
                          onClick={() => onVideoSelect(video)}
                          aria-selected={isSelected ? true : undefined}
                          className={`min-w-0 flex-1 rounded-md border-l-2 px-3 py-2.5 text-left text-base transition-colors ${
                            isSelected
                              ? "border-accent bg-accent/20 font-semibold text-base-content/80"
                              : "border-transparent text-base-content/70 hover:bg-base-200/70 hover:text-base-content"
                          }`}
                        >
                          {video.title}
                        </button>

                        {mode === "editor" && (
                          <ActionMenu
                            label={`Actions for ${video.title}`}
                            onEdit={() => onEditVideo(chapter, video)}
                            onDelete={() => onDeleteVideo(chapter, video)}
                          />
                        )}
                      </div>
                    );
                  })}

                  {(chapter.notes ?? []).map((note) => (
                    <div
                      key={note.id}
                      className="group flex items-center gap-2"
                    >
                      <DocumentTextIcon className="size-5 shrink-0 text-base-content/50" />

                      <button
                        type="button"
                        className="min-w-0 flex-1 rounded-md px-3 py-2.5 text-left text-base text-base-content/70 hover:bg-base-200/70 hover:text-base-content"
                      >
                        {note.title}
                      </button>

                      {mode === "editor" && (
                        <ActionMenu
                          label={`Actions for ${note.title}`}
                          onEdit={() => onEditNote(chapter, note)}
                          onDelete={() => onDeleteNote(chapter, note)}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {mode === "editor" && (onAddVideo || onAddNote) && (
                  <div className="mt-3 flex gap-2">
                    {onAddVideo && (
                      <button
                        type="button"
                        onClick={() => onAddVideo(chapter)}
                        className="btn btn-primary btn-outline btn-sm flex-1 bordered hover:bg-primary"
                      >
                        + Add Video
                      </button>
                    )}

                    {onAddNote && (
                      <button
                        type="button"
                        onClick={() => onAddNote(chapter)}
                        className="btn btn-primary btn-outline btn-sm flex-1 bordered hover:bg-primary"
                      >
                        + Add Note
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

export default CourseTree;
