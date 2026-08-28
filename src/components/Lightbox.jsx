import React, { useEffect } from 'react';

export default function Lightbox({ photos, index, onClose, onNavigate }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate(-1);
      if (e.key === 'ArrowRight') onNavigate(1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onNavigate]);

  if (index === null) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      {photos.length > 1 && (
        <button
          className="lightbox-prev"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(-1);
          }}
          aria-label="Previous photo"
        >
          ‹
        </button>
      )}
      <img
        src={photos[index]}
        alt=""
        onClick={(e) => e.stopPropagation()}
      />
      {photos.length > 1 && (
        <button
          className="lightbox-next"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(1);
          }}
          aria-label="Next photo"
        >
          ›
        </button>
      )}
      {photos.length > 1 && (
        <div className="lightbox-counter">
          {index + 1} / {photos.length}
        </div>
      )}
    </div>
  );
}
