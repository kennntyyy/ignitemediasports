import { useState, useCallback } from 'react';

const LIMIT = 20;

export function useUndoableState(initial) {
  const [history, setHistory] = useState({
    past: [],
    present: initial,
    future: [],
  });

  const set = useCallback((updater) => {
    setHistory((h) => {
      const nextPresent = typeof updater === 'function' ? updater(h.present) : updater;
      if (nextPresent === h.present) return h;
      try {
        if (JSON.stringify(nextPresent) === JSON.stringify(h.present)) return h;
      } catch {
        // ignore
      }
      const nextPast = [...h.past, h.present];
      return {
        past: nextPast.length > LIMIT ? nextPast.slice(-LIMIT) : nextPast,
        present: nextPresent,
        future: [],
      };
    });
  }, []);

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.past.length === 0) return h;
      const prev = h.past[h.past.length - 1];
      return {
        past: h.past.slice(0, -1),
        present: prev,
        future: [...h.future, h.present],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((h) => {
      if (h.future.length === 0) return h;
      const next = h.future[h.future.length - 1];
      return {
        past: [...h.past, h.present].slice(-LIMIT),
        present: next,
        future: h.future.slice(0, -1),
      };
    });
  }, []);

  const replace = useCallback((value) => {
    setHistory({ past: [], present: value, future: [] });
  }, []);

  return {
    present: history.present,
    set,
    undo,
    redo,
    replace,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
}
