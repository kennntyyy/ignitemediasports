import React, { useState, useEffect } from 'react';
import { defaultContent } from '../api/defaultContent.js';
import { STORAGE_KEY, readStoredContent } from './lib/storage.js';
import { useUndoableState } from './lib/history.js';
import AdminPanel from './components/AdminPanel.jsx';
import PublicSite from './components/PublicSite.jsx';
import Lightbox from './components/Lightbox.jsx';

export default function App() {
  const { present: content, set: setContent, undo, redo, replace: replaceContent, canUndo, canRedo } =
    useUndoableState(readStoredContent());
  const [lightbox, setLightbox] = useState(null); // { photos, index } | null
  const adminMode = new URLSearchParams(window.location.search).get('admin') === '1';
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [saveStatus, setSaveStatus] = useState('ready');

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/content');
        if (response.ok) {
          const remoteContent = await response.json();
          replaceContent(remoteContent);
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteContent));
        }
      } catch {
        // Keep the current draft/default content if the shared store is unavailable.
      }
    };

    void loadContent();
  }, [replaceContent]);

  useEffect(() => {
    if (!adminMode) return;

    const checkSession = async () => {
      try {
        const response = await fetch('/api/session');
        if (response.ok) {
          const session = await response.json();
          setIsAuthenticated(Boolean(session.authenticated));
        }
      } catch {
        setIsAuthenticated(false);
      }
    };

    void checkSession();
  }, [adminMode]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  const openLightbox = (photos, index) => setLightbox({ photos, index });
  const closeLightbox = () => setLightbox(null);
  const navigateLightbox = (delta) => {
    setLightbox((lb) => {
      if (!lb) return lb;
      const nextIndex = (lb.index + delta + lb.photos.length) % lb.photos.length;
      return { ...lb, index: nextIndex };
    });
  };

  const requestLogin = async (password) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(payload?.error ?? 'Login failed');
    }

    setIsAuthenticated(true);
    setSaveStatus('ready');

    try {
      const contentResponse = await fetch('/api/content');
      if (contentResponse.ok) {
        const remoteContent = await contentResponse.json();
        replaceContent(remoteContent);
      }
    } catch {
      // Leave the current content in place.
    }
  };

  const requestLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } finally {
      setIsAuthenticated(false);
    }
  };

  const saveContent = async () => {
    setSaveStatus('saving');

    const response = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setSaveStatus('error');
      throw new Error(payload?.error ?? 'Unable to save content');
    }

    setSaveStatus('saved');
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  };

  const resetContent = () => {
    setContent(defaultContent);
    setSaveStatus('ready');
  };

  // Keyboard shortcuts for admin undo/redo
  useEffect(() => {
    if (!adminMode || !isAuthenticated) return;
    const handler = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.key.toLowerCase() === 'z' && e.shiftKey) || e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [adminMode, isAuthenticated, undo, redo]);

  return (
    <>
      {adminMode ? (
        <AdminPanel
          content={content}
          onChangeContent={setContent}
          onResetContent={resetContent}
          isAuthenticated={isAuthenticated}
          onRequestLogin={requestLogin}
          onRequestLogout={requestLogout}
          onSaveContent={saveContent}
          saveStatus={saveStatus}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
      ) : (
        <PublicSite content={content} onOpenLightbox={openLightbox} />
      )}

      <Lightbox
        photos={lightbox?.photos ?? []}
        index={lightbox?.index ?? null}
        onClose={closeLightbox}
        onNavigate={navigateLightbox}
      />
    </>
  );
}
