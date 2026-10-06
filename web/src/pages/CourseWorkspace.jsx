import { useState } from "react";
import { useParams, useNavigate } from "react-router";

import useCourseWithChapters from "../hooks/useCourseWithChapters";
import CourseTree from "../components/CourseTree";

import CourseForm from "../components/CourseForm";
import ChapterForm from "../components/ChapterForm";
import VideoForm from "../components/VideoForm";
import NoteForm from "../components/NoteForm";

import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import ActionMenu from "../components/ActionMenu.jsx";

import { deleteCourse } from "../services/courseServices";
import { deleteChapter } from "../services/chapterServices";
import { deleteVideo } from "../services/videoServices.jsx";
import { deleteNote } from "../services/noteServices.jsx";

function CourseWorkspace() {
  const { courseId } = useParams();

  const { course, setCourse, chapters, setChapters, loading, error } =
    useCourseWithChapters(courseId);

  const [courseModal, setCourseModal] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(null);

  const [chapterModal, setChapterModal] = useState(null);
  const [deletingChapter, setDeletingChapter] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const [videoModal, setVideoModal] = useState(null);
  const [deletingVideo, setDeletingVideo] = useState(null);

  const [noteModal, setNoteModal] = useState(null);
  const [deletingNote, setDeletingNote] = useState(null);

  const navigate = useNavigate();

  function handleEditCourse() {
    setCourseModal({
      mode: "edit",
      course,
    });
  }

  function handleCourseUpdated(updatedCourse) {
    setCourse(updatedCourse);
    setCourseModal(null);
  }

  function handleDeleteCourse(course) {
    setDeletingCourse(course);
    setDeleteError(null);
  }

  function handleCancelDeleteCourse() {
    setDeletingCourse(null);
    setDeleteError(null);
  }

  async function handleConfirmDeleteCourse() {
    try {
      await deleteCourse(deletingCourse.courseId);

      navigate("/dashboard");
      setDeletingCourse(null);
    } catch (error) {
      setDeleteError(error.message);
    }
  }

  function handleChapterCreated(newChapter) {
    setChapters((chapters) => [
      ...chapters,
      {
        ...newChapter,
        videos: [],
      },
    ]);

    setChapterModal(null);
  }

  function handleChapterUpdated(updatedChapter) {
    setChapters((chapters) =>
      chapters.map((chapter) =>
        chapter.id === updatedChapter.id
          ? { ...chapter, ...updatedChapter }
          : chapter,
      ),
    );

    setChapterModal(null);
  }

  function handleOpenChapterModal() {
    setChapterModal({ mode: "create" });
  }

  function handleEditChapter(chapter) {
    setChapterModal({
      mode: "edit",
      chapter,
    });
  }

  function handleCloseChapterModal() {
    setChapterModal(null);
  }

  function handleDeleteChapter(chapter) {
    setDeleteError(null);
    setDeletingChapter(chapter);
  }

  function handleCancelDeleteChapter() {
    setDeletingChapter(null);
    setDeleteError(null);
  }

  async function handleConfirmDeleteChapter() {
    try {
      await deleteChapter(deletingChapter.id);

      setChapters((chapters) =>
        chapters.filter((chapter) => chapter.id !== deletingChapter.id),
      );

      setDeletingChapter(null);
    } catch (error) {
      setDeleteError(error.message);
    }
  }

  function handleAddVideo(chapter) {
    setVideoModal({
      mode: "create",
      chapter,
    });
  }

  function handleEditVideo(chapter, video) {
    setVideoModal({
      mode: "edit",
      chapter,
      video,
    });
  }

  function handleDeleteVideo(chapter, video) {
    setDeleteError(null);
    setDeletingVideo({
      chapter,
      video,
    });
  }

  function handleVideoSuccess(newVideo) {
    const chapterId = videoModal.chapter.id;

    console.log("UPDATED VIDEO:", newVideo);
    console.log("VIDEO MODAL:", videoModal);

    setChapters((chapters) =>
      chapters.map((chapter) => {
        if (chapter.id !== chapterId) {
          return chapter;
        }

        if (videoModal.mode === "create") {
          return {
            ...chapter,
            videos: [...(chapter.videos ?? []), newVideo],
          };
        }

        return {
          ...chapter,
          videos: (chapter.videos ?? []).map((video) =>
            video.id === newVideo.id ? { ...video, ...newVideo } : video,
          ),
        };
      }),
    );
    setVideoModal(null);
  }

  async function handleConfirmDeleteVideo() {
    setDeleteError(null);
    try {
      await deleteVideo(deletingVideo.video.id);

      setChapters((chapters) =>
        chapters.map((chapter) =>
          chapter.id === deletingVideo.chapter.id
            ? {
                ...chapter,
                videos: (chapter.videos ?? []).filter(
                  (video) => video.id !== deletingVideo.video.id,
                ),
              }
            : chapter,
        ),
      );
      setDeletingVideo(null);
    } catch (error) {
      setDeleteError(error.message);
    }
  }

  function handleCancelDeleteVideo() {
    setDeleteError(null);
    setDeletingVideo(null);
  }

  function handleCloseVideoModal() {
    setVideoModal(null);
  }

  function handleAddNote(chapter) {
    setNoteModal({
      mode: "create",
      chapter,
    });
  }

  function handleEditNote(chapter, note) {
    setNoteModal({
      mode: "edit",
      chapter,
      note,
    });
  }

  function handleDeleteNote(chapter, note) {
    setDeleteError(null);
    setDeletingNote({
      chapter,
      note,
    });
  }

  function handleNoteSuccess(newNote) {
    const chapterId = noteModal.chapter.id;

    console.log("UPDATED NOTE:", newNote);
    console.log("NOTE MODAL:", noteModal);

    setChapters((chapters) =>
      chapters.map((chapter) => {
        if (chapter.id !== chapterId) {
          return chapter;
        }

        if (noteModal.mode === "create") {
          return {
            ...chapter,
            notes: [...(chapter.notes ?? []), newNote],
          };
        }

        return {
          ...chapter,
          notes: (chapter.notes ?? []).map((note) =>
            note.id === newNote.id ? { ...note, ...newNote } : note,
          ),
        };
      }),
    );
    setNoteModal(null);
  }

  async function handleConfirmDeleteNote() {
    setDeleteError(null);
    try {
      await deleteNote(deletingNote.note.id);

      setChapters((chapters) =>
        chapters.map((chapter) =>
          chapter.id === deletingNote.chapter.id
            ? {
                ...chapter,
                notes: (chapter.notes ?? []).filter(
                  (note) => note.id !== deletingNote.note.id,
                ),
              }
            : chapter,
        ),
      );
      setDeletingNote(null);
    } catch (error) {
      setDeleteError(error.message);
    }
  }

  function handleCancelDeleteNote() {
    setDeleteError(null);
    setDeletingNote(null);
  }

  function handleCloseNoteModal() {
    setNoteModal(null);
  }

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
          The course you're looking for doesn't exist or is no longer available.
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

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
      <header className="rounded-lg">
        <div className="space-y-2">
          <div className="flex items-center gap-8">
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              {course.name}
            </h1>{" "}
            <ActionMenu
              label={`Action for ${course.name}`}
              onEdit={handleEditCourse}
              onDelete={() => handleDeleteCourse(course)}
            />
          </div>

          <p className="text-base-content/60">{course.description}</p>

          <p className="font-mono text-sm text-base-content/60">
            {course.price === 0 ? "Free Course" : `₹${course.price}`}
          </p>

          <Modal
            isOpen={courseModal !== null}
            onClose={() => setCourseModal(null)}
          >
            {courseModal && (
              <CourseForm
                mode={courseModal?.mode}
                initialData={courseModal?.course}
                onSuccess={handleCourseUpdated}
                onCancel={() => setCourseModal(null)}
              />
            )}
          </Modal>

          <ConfirmDialog
            isOpen={deletingCourse !== null}
            title={"Delete Course"}
            message={
              deletingCourse
                ? `Delete '${course.name}'. This cannot be undone. All the related content will be deleted.`
                : ""
            }
            onConfirm={handleConfirmDeleteCourse}
            onCancel={handleCancelDeleteCourse}
          />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="font-mono font-semibold text-xs uppercase tracking-[0.15em] text-accent">
            CHAPTERS
          </p>
          <button
            type="button"
            onClick={handleOpenChapterModal}
            className="btn btn-primary hover:bg-primary/80"
          >
            + Add Chapter
          </button>
        </div>
      </header>

      <section className="mt-2 border-y border-base-300">
        <CourseTree
          chapters={chapters}
          mode="editor"
          onEditChapter={handleEditChapter}
          onDeleteChapter={handleDeleteChapter}
          onAddVideo={handleAddVideo}
          onEditVideo={handleEditVideo}
          onDeleteVideo={handleDeleteVideo}
          onAddNote={handleAddNote}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteNote}
        />
      </section>

      <Modal isOpen={chapterModal !== null} onClose={handleCloseChapterModal}>
        {chapterModal && (
          <ChapterForm
            courseId={courseId}
            mode={chapterModal?.mode}
            initialData={chapterModal?.chapter ?? null}
            isOpen={chapterModal !== null}
            onSuccess={
              chapterModal?.mode === "edit"
                ? handleChapterUpdated
                : handleChapterCreated
            }
            onCancel={handleCloseChapterModal}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={deletingChapter !== null}
        title="Delete Chapter"
        message={
          deletingChapter
            ? `Delete "${deletingChapter.title}". This cannot be undone.`
            : ""
        }
        onConfirm={handleConfirmDeleteChapter}
        onCancel={handleCancelDeleteChapter}
      />

      <Modal isOpen={videoModal !== null} onClose={handleCloseVideoModal}>
        {videoModal && (
          <VideoForm
            key={`${videoModal.mode}-${videoModal.video?.id ?? videoModal.chapter.id}`}
            mode={videoModal.mode}
            chapterId={videoModal.chapter.id}
            initialData={videoModal.video}
            onSuccess={handleVideoSuccess}
            onCancel={handleCloseVideoModal}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={deletingVideo !== null}
        title="Delete Video"
        message={
          deletingVideo
            ? `Delete "${deletingVideo.video.title}". This cannot be undone.`
            : ""
        }
        onConfirm={handleConfirmDeleteVideo}
        onCancel={handleCancelDeleteVideo}
      />

      <Modal isOpen={noteModal !== null} onClose={handleCloseNoteModal}>
        {noteModal && (
          <NoteForm
            key={`${noteModal.mode}-${noteModal.note?.id ?? noteModal.chapter.id}`}
            mode={noteModal.mode}
            initialData={noteModal.note}
            onSuccess={handleNoteSuccess}
            onCancel={handleCloseNoteModal}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={deletingNote !== null}
        title={"Delete Note"}
        message={
          deletingNote
            ? `Delete "${deletingNote.note.title}". This cannot be undone.`
            : ""
        }
        onConfirm={handleConfirmDeleteNote}
        onCancel={handleCancelDeleteNote}
      />
    </main>
  );
}

export default CourseWorkspace;
