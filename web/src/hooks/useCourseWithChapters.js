import { useState, useEffect } from "react";
import { getCourse } from "../services/courseServices"; 
import { getChapters } from "../services/chapterServices";
import { getVideos } from "../services/videoServices";


function useCourseWithChapters(courseId){
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
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

  return {course, chapters, setChapters, loading, error}
}

export default useCourseWithChapters;
