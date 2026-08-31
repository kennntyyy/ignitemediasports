import React, { useState, useEffect } from 'react';
import { defaultContent } from '../api/defaultContent.js';
import { STORAGE_KEY, readStoredContent } from './lib/storage.js';
import { useUndoableState } from './lib/history.js';
import AdminPanel from './components/AdminPanel.jsx';
import PublicSite from './components/PublicSite.jsx';
import Lightbox from './components/Lightbox.jsx';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('Admin crash', error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, background: '#111', color: '#fff', minHeight: '100vh' }}>
          <h2 style={{ color: '#fb531e' }}>Admin crashed</h2>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#222', padding: 16, borderRadius: 8, marginTop: 12 }}>
            {String(this.state.error?.message ?? this.state.error)}
            {'\n'}
            {String(this.state.error?.stack ?? '')}
          </pre>
          <button
            onClick={() => { localStorage.removeItem(STORAGE_KEY); location.reload(); }}
            style={{ marginTop: 16, padding: '10px 16px', background: '#fb531e', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
          >
            Clear local draft & reload
          </button>
          <a href="/" style={{ marginLeft: 12, color: '#fff', textDecoration: 'underline' }}>Back to site</a>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const { present: content, set: setContent, undo, redo, replace: replaceContent, canUndo, canRedo } =
    useUndoableState(readStoredContent());
  const [lightbox, setLightbox] = useState(null); // { photos, index } | null
  const adminMode = new URLSearchParams(window.location.search).get('admin') === '1';
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [saveStatus, setSaveStatus] = useState('ready');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/content');
        if (response.ok) {
          const remoteContent = await response.json();
          replaceContent(remoteContent);
          try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteContent)); } catch {}
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
    try {
      const serialized = JSON.stringify(content);
      // localStorage is ~5MB — skip for very large drafts (still saved on server)
      if (serialized.length > 4_500_000) {
        try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
        return;
      }
      window.localStorage.setItem(STORAGE_KEY, serialized);
    } catch (e) {
      if (e?.name === 'QuotaExceededError' || String(e).includes('QuotaExceeded')) {
        try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
      } else {
        console.error(e);
      }
    }
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
    setSaveError('');
    // client pre-check mirrors api/content.js:4 limit (80MB chunked)
    if (JSON.stringify(content).length > 80 * 1024 * 1024) {
      const msg = `Content too large (${Math.round(JSON.stringify(content).length / 1024 / 1024)}MB). Limit 80MB. Remove some uploaded photos.`;
      setSaveStatus('error');
      setSaveError(msg);
      throw new Error(msg);
    }

    const response = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setSaveStatus('error');
      const msg = payload?.error ?? 'Unable to save content';
      setSaveError(msg);
      throw new Error(msg);
    }

    setSaveStatus('saved');
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content)); } catch {}
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

  // Guard against malformed content (e.g. stale localStorage)
  const safeContent = content && typeof content === 'object' && content.theme ? content : defaultContent;

  return (
    <>
      {adminMode ? (
        <ErrorBoundary>
          <AdminPanel
            content={safeContent}
            onChangeContent={setContent}
            onResetContent={resetContent}
            isAuthenticated={isAuthenticated}
            onRequestLogin={requestLogin}
            onRequestLogout={requestLogout}
            onSaveContent={saveContent}
            saveStatus={saveStatus}
            saveError={saveError}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        </ErrorBoundary>
      ) : (
        <PublicSite content={safeContent} onOpenLightbox={openLightbox} />
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
