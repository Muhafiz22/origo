import { useState } from "react";
import { useParams, useNavigate } from "react-router";

import useCourseWithChapters from "../hooks/useCourseWithChapters";
import CourseForm from "../components/CourseForm";
import CourseTree from "../components/CourseTree";
import ChapterForm from "../components/ChapterForm";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import ActionMenu from "../components/ActionMenu.jsx";
import { deleteChapter } from "../services/chapterServices";
import {deleteCourse} from "../services/courseServices"

function CourseWorkspace() {
  const { courseId } = useParams();

  const { course, setCourse, chapters, setChapters, loading, error } =
    useCourseWithChapters(courseId);

  const [courseModal, setCourseModal] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(null)

  const [chapterModal, setChapterModal] = useState(null);
  const [deletingChapter, setDeletingChapter] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const navigate = useNavigate()

  function handleEditingCourse() {
    setCourseModal({
      mode: "edit",
      course,
    });
  }

  function handleCourseUpdated(updatedCourse) {
    setCourse(updatedCourse);
    setCourseModal(null);
}

  function handleDeletingCourse(course){
    setDeletingCourse(course)
    setDeleteError(null)
  }

  function handleCancelDeleteCourse(){
    setDeletingCourse(null)
    setDeleteError(null)
  }

  async function handleConfirmDeleteCourse(){
    try{
      await deleteCourse(deletingCourse.courseId)
      
      navigate("/dashboard")
      setDeletingCourse(null)
    }catch(error){
      setDeleteError(error.message)
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
        chapter.id === updatedChapter.id ? updatedChapter : chapter,
      ),
    );

    setChapterModal(null);
  }

  function handleOpenChapterModal() {
    setChapterModal({ mode: "create" });
  }

  function handleEditingChapter(chapter) {
    setChapterModal({
      mode: "edit",
      chapter,
    });
  }

  function handleCloseChapterModal() {
    setChapterModal(null);
  }

  function handleDeletingChapter(chapter) {
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
        </h1>            <ActionMenu
              label={`Action for ${course.name}`}
              onEdit={handleEditingCourse}
              onDelete={() => handleDeletingCourse(course)}
            />
          </div>
          
          <p className="text-base-content/60">{course.description}</p>

          <p className="font-mono text-sm text-base-content/60">
            {course.price === 0 ? "Free" : `₹${course.price}`}
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

        <div className="mt-6 flex justify-end">
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
          onEditChapter={handleEditingChapter}
          onDeleteChapter={handleDeletingChapter}
        />
      </section>

      <Modal
        isOpen={chapterModal !== null}
        onClose={handleCloseChapterModal}
      >
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
    </main>
  );
}

export default CourseWorkspace;
