import React, { useState, useEffect } from 'react';

const basketballPhotos = [
  'DSC02257',
  'DSC02308',
  'DSC02311',
  'DSC02323',
  'DSC02444',
  'DSC02804',
  'DSC02846',
  'DSC02934',
  'DSC02995',
  'DSC03342',
  'DSC04047',
  'DSC04050',
  'DSC04090',
  'IMG_0014',
  'IMG_0606',
].map((name) => `/photos/basketball/${name}.jpg`);

const juijitsuPhotos = [
  'DSC02028',
  'DSC02096',
  'DSC07190',
  'DSC07227',
  'DSC07232',
  'DSC07234-2',
  'DSC07238',
  'DSC07261',
  'DSC08271',
  'DSC08389',
].map((name) => `/photos/juijitsu/${name}.jpg`);

const individualPhotos = [
  'DSC08057',
  'DSC08089',
  'DSC08108',
  'DSC08131',
  'DSC08151',
  'DSC08168',
  'DSC08193',
  'DSC08227',
  'DSC08243',
  'DSC08276',
  'DSC08300',
  'DSC08316',
  'DSC08367',
  'DSC08425',
  'DSC08443',
  'DSC08458',
  'DSC08464',
  'DSC08503',
].map((name) => `/photos/individual/${name}.jpg`);

const portfolioSections = [
  {
    title: 'Basketball',
    code: '014A',
    copy: 'Game action, sideline emotion, team features, and player portraits. Add your basketball gallery photos here.',
    detail: 'Court action · Team shots · Portraits',
    photos: basketballPhotos,
  },
  {
    title: 'Jiu Jitsu',
    code: '015',
    copy: 'Controlled action, mat movement, detail shots, and competition moments with space for a full visual story.',
    detail: 'Competition · Training · Detail shots',
    photos: juijitsuPhotos,
  },
  {
    title: 'Individual Sports Shots',
    code: '016A',
    copy: 'One-on-one athlete images, portraits, and action shots for personal branding and social media use.',
    detail: 'Portraits · Action · Brand content',
    photos: individualPhotos,
  },
];

const serviceFrames = [
  {
    frame: '020',
    title: 'Game day coverage',
    copy: 'Full-match photographers courtside or pitchside, edited and delivered same night for press and socials.',
  },
  {
    frame: '021',
    title: 'Athlete portraits',
    copy: 'Studio and on-location portraiture for roster pages, sponsor decks, and season launch campaigns.',
  },
  {
    frame: '022',
    title: 'Editorial & brand',
    copy: 'Long-form visual stories for teams and sponsors who need more than a highlight reel.',
  },
];

const sidebarLinks = [
  { num: '01', label: 'Work', id: 'portfolio' },
  { num: '02', label: 'Services', id: 'services' },
  { num: '03', label: 'Teams', id: 'teams' },
  { num: '04', label: 'Journal', id: 'journal' },
  { num: '05', label: 'Contact', id: 'footer' },
];

const emailBookingUrl =
  'mailto:tiffany@bydesigncontentcreation.com?subject=Ignite%20Motion%20Sports%20Media%20Consultation&body=Hi%20Tiffany%2C%0A%0AI%27d%20like%20to%20book%20a%20consultation%20call%20about%20my%20sports%20photo%20project.%0A%0AThanks!';

function JustifiedGrid({ photos, altPrefix, onPhotoClick }) {
  const containerRef = React.useRef(null);
  const [width, setWidth] = useState(0);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (photos.length === 0) {
      setItems([]);
      return;
    }
    Promise.all(
      photos.map(
        (src, idx) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () =>
              resolve({ src, idx, ratio: img.naturalWidth / img.naturalHeight || 1 });
            img.onerror = () => resolve(null);
            img.src = src;
          })
      )
    ).then((results) => {
      if (!cancelled) setItems(results.filter(Boolean));
    });
    return () => {
      cancelled = true;
    };
  }, [photos]);

  const targetRowHeight = width < 600 ? 140 : width < 1000 ? 190 : 240;
  const gap = 6;

  const rows = [];
  let currentRow = [];
  let currentRatioSum = 0;

  items.forEach((item) => {
    currentRow.push(item);
    currentRatioSum += item.ratio;
    const rowWidthAtTarget =
      currentRatioSum * targetRowHeight + (currentRow.length - 1) * gap;
    if (rowWidthAtTarget >= width && width > 0) {
      rows.push({ items: currentRow, ratioSum: currentRatioSum });
      currentRow = [];
      currentRatioSum = 0;
    }
  });
  if (currentRow.length > 0) {
    rows.push({ items: currentRow, ratioSum: currentRatioSum, isLast: true });
  }

  return (
    <div className="justified" ref={containerRef}>
      {rows.map((row, ri) => {
        const totalGap = (row.items.length - 1) * gap;
        const rowHeight = row.isLast
          ? targetRowHeight
          : (width - totalGap) / row.ratioSum;
        return (
          <div className="justified-row" key={ri} style={{ height: rowHeight }}>
            {row.items.map((item) => (
              <img
                key={item.src}
                src={item.src}
                alt={`${altPrefix} photo`}
                loading="lazy"
                onClick={() => onPhotoClick(item.idx)}
                style={{ width: item.ratio * rowHeight, height: rowHeight }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

const PHOTOS_PER_PAGE = 9;

function PortfolioSection({ section, onOpenLightbox }) {
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

function Lightbox({ photos, index, onClose, onNavigate }) {
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
function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <img className="sidebar-logo-image" src="/photos/logo.png" alt="Ignite Motion Sports Media" />
        </div>
        <ul className="sidebar-nav">
          {sidebarLinks.map((link) => (
            <li key={link.id}>
              <a className="sidebar-link" href={`#${link.id}`}>
                <span className="num">{link.num}</span>
                <span className="label">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="sidebar-bottom">
        <div className="sidebar-status">
          <span className="dot" />
          Based in Denver, CO
        </div>
        <a className="sidebar-cta" href="#booking">
          Book a consultation
        </a>
      </div>
    </aside>
  );
}

export default function App() {
  const [lightbox, setLightbox] = useState(null); // { photos, index } | null

  const openLightbox = (photos, index) => setLightbox({ photos, index });
  const closeLightbox = () => setLightbox(null);
  const navigateLightbox = (delta) => {
    setLightbox((lb) => {
      if (!lb) return lb;
      const nextIndex = (lb.index + delta + lb.photos.length) % lb.photos.length;
      return { ...lb, index: nextIndex };
    });
  };

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  return (
    <>
      <Sidebar />

      <div className="with-sidebar">
        <main>
          <section className="hero" id="top">
            <div className="wrap">
              <div className="eyebrow">Sports photography studio</div>
              <h1>
                Capture the<br /><span className="accent">ignition point.</span>
              </h1>
              <p>
                We shoot the half-second before the crowd reacts — the release, the impact, the breakaway. Game day, editorial, and athlete portraiture for teams who play for keeps.
              </p>
            </div>
            <div className="scanline" />
          </section>

          <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
              <span className="hot">Basketball</span><span>·</span><span>Editorial</span><span>·</span><span className="hot">Jiu jitsu</span><span>·</span><span>Consultation calls</span><span>·</span><span className="hot">Individual sports shots</span><span>·</span><span>Denver, CO</span><span>·</span>
              <span className="hot">Basketball</span><span>·</span><span>Editorial</span><span>·</span><span className="hot">Jiu jitsu</span><span>·</span><span>Consultation calls</span><span>·</span><span className="hot">Individual sports shots</span><span>·</span><span>Denver, CO</span><span>·</span>
              <span className="hot">Basketball</span><span>·</span><span>Editorial</span><span>·</span><span className="hot">Jiu jitsu</span><span>·</span><span>Consultation calls</span><span>·</span><span className="hot">Individual sports shots</span><span>·</span><span>Denver, CO</span><span>·</span>
              <span className="hot">Basketball</span><span>·</span><span>Editorial</span><span>·</span><span className="hot">Jiu jitsu</span><span>·</span><span>Consultation calls</span><span>·</span><span className="hot">Individual sports shots</span><span>·</span><span>Denver, CO</span><span>·</span>
            </div>
          </div>

          <section className="gallery" id="portfolio">
            <div className="wrap">
              <div className="section-title">portfolio</div>

              {portfolioSections.map((section) => (
                <PortfolioSection
                  key={section.title}
                  section={section}
                  onOpenLightbox={openLightbox}
                />
              ))}
            </div>
          </section>

          <section className="services" id="services">
            <div className="wrap">
              <div className="section-label">What we shoot</div>
              <div className="section-title">Built for teams and athletes</div>
              <div className="service-grid">
                {serviceFrames.map((service) => (
                  <div className="service-card" key={service.frame}>
                    <div className="service-frame">FRAME <span>{service.frame}</span></div>
                    <h3>{service.title}</h3>
                    <p>{service.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="footer-cta" id="booking">
            <div className="wrap">
              <div className="section-label">Ready when you are</div>
              <h2>Let's set up your<br />consultation call.</h2>
              <p className="footer-cta-copy">
                Use the email button to send a consultation request directly, or tap the text link below to send a message for free through your phone's SMS app.
              </p>
              <div className="footer-cta-actions">
                <a className="cta-btn" href={emailBookingUrl}>Email to book</a>
                <a className="ghost-btn" href="sms:+17208282804">Text me for free</a>
              </div>
            </div>
          </section>
        </main>

        <footer id="footer">
          <span>© Ignite Motion Sports Media 2026</span>
          <span>Denver, CO</span>
        </footer>
      </div>

      <Lightbox
        photos={lightbox?.photos ?? []}
        index={lightbox?.index ?? null}
        onClose={closeLightbox}
        onNavigate={navigateLightbox}
      />
    </>
  );
}