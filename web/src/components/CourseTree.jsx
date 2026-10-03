import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

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
}) {
  const [expandedChapters, setExpandedChapters] = useState(new Set());
  const [openMenu, setOpenMenu] = useState(null);

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
        const menuKey = `chapter:${chapter.id}`;

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
                  {isExpanded ? "▼" : "▶"}
                </span>

                <span className="w-6 font-mono text-base-content/60">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="font-display text-lg font-semibold">
                  {chapter.title}
                </span>
              </button>

              {mode === "editor" && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenu(openMenu === menuKey ? null : menuKey)
                    }
                    className={`btn btn-ghost btn-sm btn-square transition-opacity ${
                      openMenu === menuKey
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
                    } focus-visible:opacity-100`}
                    aria-label={`Actions for ${chapter.title}`}
                  >
                    <EllipsisHorizontalIcon className="size-6" />
                  </button>

                  {openMenu === menuKey && (
                    <div className="absolute right-0 z-10 mt-1 w-32 rounded-md border border-base-300 bg-base-100 p-1 shadow-lg">
                      <button
                        type="button"
                        onClick={() => {
                          onEditChapter(chapter);
                          setOpenMenu(null);
                        }}
                        className="w-full rounded px-3 py-2 text-left text-sm hover:bg-base-200"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onDeleteChapter(chapter);
                          setOpenMenu(null);
                        }}
                        className="w-full rounded px-3 py-2 text-left text-sm text-error hover:bg-base-200"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {isExpanded && (
              <div className="border-t border-base-300 px-4 pb-5 pl-11">
                <p className="py-4 text-sm leading-relaxed text-base-content/70">
                  {chapter.description}
                </p>

                <div className="space-y-1">
                  {mode === "editor" && (chapter.videos ?? []).length === 0 && (
                    <p className="px-3 py-2 text-sm text-base-content/50">
                      No Videos yet
                    </p>
                  )}

                  {(chapter.videos ?? []).map((video) => {
                    const isSelected = video.id === selectedVideoId;
                    const menuKey = `video:${video.id}`;

                    return (
                      <div
                        key={video.id}
                        className="group flex items-center gap-2"
                      >
                        <span
                          className={`size-2 shrink-0 rounded-full ${
                            isSelected ? "bg-accent" : "bg-base-content/30"
                          }`}
                        />

                        <button
                          type="button"
                          onClick={() => onVideoSelect(video)}
                          aria-selected={isSelected ? true : undefined}
                          className={`min-w-0 flex-1 rounded-md px-3 py-2.5 text-left text-base transition-colors ${
                            isSelected
                              ? "bg-base-200 font-semibold text-accent"
                              : "text-base-content/70 hover:bg-base-200/70 hover:text-base-content"
                          }`}
                        >
                          {video.title}
                        </button>

                        {mode === "editor" && (
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenu(
                                  openMenu === menuKey ? null : menuKey,
                                )
                              }
                              className={`btn btn-ghost btn-sm btn-square transition-opacity ${
                                openMenu === menuKey
                                  ? "opacity-100"
                                  : "opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
                              } focus-visible:opacity-100`}
                              aria-label={`Actions for ${video.title}`}
                            >
                              <EllipsisHorizontalIcon className="size-5" />
                            </button>

                            {openMenu === menuKey && (
                              <div className="absolute right-0 z-10 mt-1 w-32 rounded-md border border-base-300 bg-base-100 p-1 shadow-lg">
                                <button
                                  type="button"
                                  onClick={() => {
                                    onEditVideo(chapter, video);
                                    setOpenMenu(null);
                                  }}
                                  className="w-full rounded px-3 py-2 text-left text-sm hover:bg-base-200"
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    onDeleteVideo(chapter, video);
                                    setOpenMenu(null);
                                  }}
                                  className="w-full rounded px-3 py-2 text-left text-sm text-error hover:bg-base-200"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {mode === "editor" &&
                  (onAddVideo || onEditVideo || onDeleteVideo) && (
                    <button
                      type="button"
                      onClick={() => onAddVideo(chapter)}
                      className="btn btn-primary hover:bg-primary/80 mt-3 flex w-full items-center justify-center rounded-md border border-dashed px-3 py-2.5"
                    >
                      + Add Video
                    </button>
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
