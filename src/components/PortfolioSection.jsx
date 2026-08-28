import React, { useState } from 'react';
import JustifiedGrid from './JustifiedGrid.jsx';

const PHOTOS_PER_PAGE = 9;

export default function PortfolioSection({ section, onOpenLightbox }) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(section.photos.length / PHOTOS_PER_PAGE));
  const start = page * PHOTOS_PER_PAGE;
  const currentPhotos = section.photos.slice(start, start + PHOTOS_PER_PAGE);

  return (
    <div className="portfolio-block">
      <div className="portfolio-block-header">
        <h3>{section.title}</h3>
        <span className="frame-exif">{section.detail}</span>
      </div>

      {section.photos.length > 0 ? (
        <JustifiedGrid
          photos={currentPhotos}
          altPrefix={section.title}
          onPhotoClick={(localIdx) => onOpenLightbox(section.photos, start + localIdx)}
        />
      ) : (
        <div className="frame-art" style={{ position: 'static', height: '200px' }} />
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={i === page ? 'active' : ''}
              onClick={() => setPage(i)}
            >
              {String(i + 1).padStart(2, '0')}
            </button>
          ))}
          <button
            disabled={page === totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
