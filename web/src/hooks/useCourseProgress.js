import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getCourseProgress,
  markVideoDone,
  unmarkVideoDone,
} from "../services/videoServices";

function useCourseProgress(courseId, enabled, onError) {
  const [completedIds, setCompletedIds] = useState(null);
  const [totalVideos, setTotalVideos] = useState(0);
  const [loading, setLoading] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [pending, setPending] = useState(() => new Set());

  const completedRef = useRef(null);
  const pendingRef = useRef(new Set());
  const generationRef = useRef(0);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    const generation = ++generationRef.current;
    let ignore = false;

    completedRef.current = null;
    pendingRef.current = new Set();

    setCompletedIds(null);
    setTotalVideos(0);
    setPending(new Set());
    setUnavailable(false);

    if (!enabled || !courseId) {
      setLoading(false);

      return () => {
        ignore = true;
      };
    }

    setLoading(true);

    getCourseProgress(courseId)
      .then((data) => {
        if (ignore || generation !== generationRef.current) return;

        const ids = new Set(data.completedVideoIds);
        completedRef.current = ids;

        setCompletedIds(ids);
        setTotalVideos(data.totalVideos);
      })
      .catch(() => {
        if (ignore || generation !== generationRef.current) return;

        setUnavailable(true);
      })
      .finally(() => {
        if (ignore || generation !== generationRef.current) return;

        setLoading(false);
      });

    return () => {
      ignore = true;

      if (generationRef.current === generation) {
        generationRef.current++;
      }
    };
  }, [courseId, enabled]);

  const setDone = useCallback((videoId, done) => {
    const current = completedRef.current;
    if (!current) return;

    const next = new Set(current);

    if (done) {
      next.add(videoId);
    } else {
      next.delete(videoId);
    }

    completedRef.current = next;
    setCompletedIds(next);
  }, []);

  const setPendingFor = useCallback((videoId, value) => {
    const next = new Set(pendingRef.current);

    if (value) {
      next.add(videoId);
    } else {
      next.delete(videoId);
    }

    pendingRef.current = next;
    setPending(next);
  }, []);

  const toggleVideo = useCallback(
    async (videoId) => {
      const current = completedRef.current;

      if (!enabled || !courseId || !current) return;
      if (pendingRef.current.has(videoId)) return;

      const generation = generationRef.current;
      const wasDone = current.has(videoId);

      setPendingFor(videoId, true);
      setDone(videoId, !wasDone);

      try {
        if (wasDone) {
          await unmarkVideoDone(videoId);
        } else {
          await markVideoDone(videoId);
        }
      } catch {
        // Silently roll back only this video's change.
        if (generation === generationRef.current) {
          setDone(videoId, wasDone);
          onErrorRef.current?.(err);
        }
      } finally {
        if (generation === generationRef.current) {
          setPendingFor(videoId, false);
        }
      }
    },
    [enabled, courseId, setDone, setPendingFor],
  );

  const isDone = useCallback(
    (videoId) => completedIds?.has(videoId) ?? false,
    [completedIds],
  );

  const isPending = useCallback((videoId) => pending.has(videoId), [pending]);

  const percent = useMemo(() => {
    if (!completedIds || totalVideos <= 0) return 0;

    return Math.min(100, Math.floor((completedIds.size / totalVideos) * 100));
  }, [completedIds, totalVideos]);

  return {
    completedIds,
    totalVideos,
    percent,
    loading,
    unavailable: !enabled || !courseId || unavailable,
    isDone,
    isPending,
    toggleVideo,
  };
}

export default useCourseProgress;
