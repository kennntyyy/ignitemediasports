import { useRef, useState, useCallback } from 'react';

const LIMIT = 20;

export function useUndoableState(initial) {
  const [present, setPresent] = useState(initial);
  const pastRef = useRef([]);
  const futureRef = useRef([]);
  const [, force] = useState(0);

  const bump = useCallback(() => force((v) => v + 1), []);

  // Wrapped setter that records history (unless skipHistory)
  const set = useCallback(
    (updater, { skipHistory = false } = {}) => {
      setPresent((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        if (next === prev) return prev;
        // cheap deep-equality guard — avoids pushing no-ops from rapid typing
        try {
          if (JSON.stringify(next) === JSON.stringify(prev)) return prev;
        } catch {
          // fall through
        }
        if (!skipHistory) {
          const nextPast = [...pastRef.current, prev];
          pastRef.current = nextPast.length > LIMIT ? nextPast.slice(-LIMIT) : nextPast;
          futureRef.current = [];
          // bump outside of render — schedule microtask
          queueMicrotask(bump);
        }
        return next;
      });
    },
    [bump]
  );

  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;
    const prev = pastRef.current[pastRef.current.length - 1];
    pastRef.current = pastRef.current.slice(0, -1);
    // capture current present synchronously via setPresent updater
    setPresent((cur) => {
      futureRef.current = [...futureRef.current, cur];
      bump();
      return prev;
    });
  }, [bump]);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    const next = futureRef.current[futureRef.current.length - 1];
    futureRef.current = futureRef.current.slice(0, -1);
    setPresent((cur) => {
      const nextPast = [...pastRef.current, cur];
      pastRef.current = nextPast.length > LIMIT ? nextPast.slice(-LIMIT) : nextPast;
      bump();
      return next;
    });
  }, [bump]);

  // For remote loads / reset — replace without pushing to history
  const replace = useCallback(
    (value) => {
      pastRef.current = [];
      futureRef.current = [];
      bump();
      setPresent(value);
    },
    [bump]
  );

  const canUndo = pastRef.current.length > 0;
  const canRedo = futureRef.current.length > 0;

  return { present, set, undo, redo, replace, canUndo, canRedo };
}
