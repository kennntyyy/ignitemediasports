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

const STORAGE_KEY = 'ignite-motion-site-content-v1';

const defaultPortfolioSections = [
  {
    id: 'basketball',
    title: 'Basketball',
    code: '014A',
    copy: 'Game action, sideline emotion, team features, and player portraits. Add your basketball gallery photos here.',
    detail: 'Court action · Team shots · Portraits',
    photos: basketballPhotos,
  },
  {
    id: 'juijitsu',
    title: 'Jiu Jitsu',
    code: '015',
    copy: 'Controlled action, mat movement, detail shots, and competition moments with space for a full visual story.',
    detail: 'Competition · Training · Detail shots',
    photos: juijitsuPhotos,
  },
  {
    id: 'individual',
    title: 'Individual Sports Shots',
    code: '016A',
    copy: 'One-on-one athlete images, portraits, and action shots for personal branding and social media use.',
    detail: 'Portraits · Action · Brand content',
    photos: individualPhotos,
  },
];

const defaultServices = [
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

const defaultContent = {
  theme: {
    background: '#0b0b0c',
    surface: '#000000',
    primary: '#fb531e',
    accent: '#ff7c33',
    button: '#b3392c',
    text: '#ffffff',
    muted: '#8b8b87',
  },
  hero: {
    eyebrow: 'Sports photography studio',
    lineOne: 'Capture the',
    accent: 'ignition point.',
    copy:
      'We shoot the half-second before the crowd reacts — the release, the impact, the breakaway. Game day, editorial, and athlete portraiture for teams who play for keeps.',
  },
  marqueeItems: ['Basketball', 'Editorial', 'Jiu jitsu', 'Consultation calls', 'Individual sports shots', 'Denver, CO'],
  portfolio: defaultPortfolioSections,
  services: defaultServices,
  footerCta: {
    eyebrow: 'Ready when you are',
    titleLineOne: "Let's set up your",
    titleLineTwo: 'consultation call.',
    copy:
      'Use the email button to send a consultation request directly, or tap the text link below to send a message for free through your phone\'s SMS app.',
    emailLabel: 'Email to book',
    smsLabel: 'Text me for free',
  },
  sidebar: {
    logoSrc: '/photos/logo.png',
    status: 'Based in Denver, CO',
    cta: 'Book a consultation',
  },
  contact: {
    emailBookingUrl,
    smsUrl: 'sms:+17208282804',
    footerLeft: '© Ignite Motion Sports Media 2026',
    footerRight: 'Denver, CO',
  },
};

function readStoredContent() {
  if (typeof window === 'undefined') return defaultContent;

  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (!stored) return defaultContent;

    return {
      ...defaultContent,
      ...stored,
      theme: { ...defaultContent.theme, ...(stored.theme ?? {}) },
      hero: { ...defaultContent.hero, ...(stored.hero ?? {}) },
      footerCta: { ...defaultContent.footerCta, ...(stored.footerCta ?? {}) },
      sidebar: { ...defaultContent.sidebar, ...(stored.sidebar ?? {}) },
      contact: { ...defaultContent.contact, ...(stored.contact ?? {}) },
      marqueeItems:
        Array.isArray(stored.marqueeItems) && stored.marqueeItems.length > 0
          ? stored.marqueeItems
          : defaultContent.marqueeItems,
      portfolio:
        Array.isArray(stored.portfolio) && stored.portfolio.length > 0
          ? stored.portfolio.map((section, index) => ({
              ...defaultContent.portfolio[index],
              ...section,
              photos:
                Array.isArray(section.photos) && section.photos.length > 0
                  ? section.photos
                  : defaultContent.portfolio[index].photos,
            }))
          : defaultContent.portfolio,
      services:
        Array.isArray(stored.services) && stored.services.length > 0
          ? stored.services.map((service, index) => ({
              ...defaultContent.services[index],
              ...service,
            }))
          : defaultContent.services,
    };
  } catch {
    return defaultContent;
  }
}

function cssThemeVars(theme) {
  return {
    '--ink': theme.background,
    '--black': theme.surface,
    '--orange': theme.primary,
    '--flame-light': theme.accent,
    '--ember': theme.button,
    '--white': theme.text,
    '--smoke': 'color-mix(in srgb, ' + theme.text + ' 54%, ' + theme.background + ' 46%)',
  };
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

function parsePhotoInput(value) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function AdminPanel({
  content,
  onChangeContent,
  onResetContent,
  isAuthenticated,
  onRequestLogin,
  onRequestLogout,
  onSaveContent,
  saveStatus,
}) {
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setLocalError('');

    try {
      await onRequestLogin(password);
      setPassword('');
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Login failed');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-shell">
        <div className="admin-panel admin-auth-panel">
          <div className="admin-header">
            <div>
              <div className="section-label">Admin panel</div>
              <h1>Sign in to edit</h1>
              <p>Use the site password to unlock the shared editor. Changes save to the remote content store after you sign in.</p>
            </div>
          </div>

          <form className="admin-card" onSubmit={handleLogin}>
            <div className="admin-card-title">Password</div>
            <div className="admin-grid">
              <label className="admin-field admin-field-full">
                <span>Admin password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                />
              </label>
              {localError ? <div className="admin-error admin-field-full">{localError}</div> : null}
              <div className="admin-field admin-field-full">
                <button className="cta-btn" type="submit">Sign in</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const updateTheme = (field, value) => {
    onChangeContent((current) => ({
      ...current,
      theme: { ...current.theme, [field]: value },
    }));
  };

  const updateHero = (field, value) => {
    onChangeContent((current) => ({
      ...current,
      hero: { ...current.hero, [field]: value },
    }));
  };

  const updateFooterCta = (field, value) => {
    onChangeContent((current) => ({
      ...current,
      footerCta: { ...current.footerCta, [field]: value },
    }));
  };

  const updateSidebar = (field, value) => {
    onChangeContent((current) => ({
      ...current,
      sidebar: { ...current.sidebar, [field]: value },
    }));
  };

  const updateContact = (field, value) => {
    onChangeContent((current) => ({
      ...current,
      contact: { ...current.contact, [field]: value },
    }));
  };

  const updateMarquee = (index, value) => {
    onChangeContent((current) => ({
      ...current,
      marqueeItems: current.marqueeItems.map((item, itemIndex) => (itemIndex === index ? value : item)),
    }));
  };

  const addMarqueeItem = () => {
    onChangeContent((current) => ({
      ...current,
      marqueeItems: [...current.marqueeItems, 'New item'],
    }));
  };

  const removeMarqueeItem = (index) => {
    onChangeContent((current) => ({
      ...current,
      marqueeItems: current.marqueeItems.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const updatePortfolioSection = (index, field, value) => {
    onChangeContent((current) => ({
      ...current,
      portfolio: current.portfolio.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, [field]: value } : section
      ),
    }));
  };

  const updatePortfolioPhotos = (index, value) => {
    onChangeContent((current) => ({
      ...current,
      portfolio: current.portfolio.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, photos: parsePhotoInput(value) } : section
      ),
    }));
  };

  const addPortfolioFiles = async (index, files) => {
    const nextFiles = Array.from(files ?? []);
    if (nextFiles.length === 0) return;

    const uploaded = await Promise.all(nextFiles.map((file) => fileToDataUrl(file)));

    onChangeContent((current) => ({
      ...current,
      portfolio: current.portfolio.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, photos: [...section.photos, ...uploaded] } : section
      ),
    }));
  };

  const removePortfolioPhoto = (sectionIndex, photoIndex) => {
    onChangeContent((current) => ({
      ...current,
      portfolio: current.portfolio.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              photos: section.photos.filter((_, itemIndex) => itemIndex !== photoIndex),
            }
          : section
      ),
    }));
  };

  const updateService = (index, field, value) => {
    onChangeContent((current) => ({
      ...current,
      services: current.services.map((service, serviceIndex) =>
        serviceIndex === index ? { ...service, [field]: value } : service
      ),
    }));
  };

  return (
    <div className="admin-shell">
      <div className="admin-panel">
        <div className="admin-header">
          <div>
            <div className="section-label">Admin panel</div>
            <h1>Edit site content</h1>
            <p>Changes stay in sync with the shared site content store. Photos can be pasted as URLs or uploaded as files.</p>
          </div>
          <div className="admin-actions">
            <button className="ghost-btn" onClick={onRequestLogout}>Log out</button>
            <button className="cta-btn" onClick={() => void onSaveContent().catch(() => {})}>Save changes</button>
            <a className="ghost-btn" href="/">View live site</a>
            <button className="ghost-btn" onClick={onResetContent}>Reset defaults</button>
          </div>
        </div>

        <div className="admin-status-row">
          <span className={`admin-status-pill ${saveStatus}`}>{saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving' : saveStatus === 'error' ? 'Save failed' : 'Ready'}</span>
        </div>

        <section className="admin-card">
          <div className="admin-card-title">Theme settings</div>
          <div className="admin-grid admin-grid-colors">
            {[
              ['background', 'Background'],
              ['surface', 'Surface'],
              ['primary', 'Primary'],
              ['accent', 'Accent'],
              ['button', 'Button'],
              ['text', 'Text'],
            ].map(([key, label]) => (
              <label key={key} className="admin-field admin-color-field">
                <span>{label}</span>
                <input
                  type="color"
                  value={content.theme[key]}
                  onChange={(event) => updateTheme(key, event.target.value)}
                />
              </label>
            ))}
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card-title">Hero</div>
          <div className="admin-grid">
            <label className="admin-field">
              <span>Eyebrow</span>
              <input
                value={content.hero.eyebrow}
                onChange={(event) => updateHero('eyebrow', event.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>Line one</span>
              <input
                value={content.hero.lineOne}
                onChange={(event) => updateHero('lineOne', event.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>Accent line</span>
              <input
                value={content.hero.accent}
                onChange={(event) => updateHero('accent', event.target.value)}
              />
            </label>
            <label className="admin-field admin-field-full">
              <span>Paragraph</span>
              <textarea
                rows="4"
                value={content.hero.copy}
                onChange={(event) => updateHero('copy', event.target.value)}
              />
            </label>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card-title">Marquee</div>
          <div className="admin-list">
            {content.marqueeItems.map((item, index) => (
              <div className="admin-list-row" key={`${item}-${index}`}>
                <input value={item} onChange={(event) => updateMarquee(index, event.target.value)} />
                <button className="ghost-btn" onClick={() => removeMarqueeItem(index)}>Remove</button>
              </div>
            ))}
          </div>
          <button className="cta-btn" onClick={addMarqueeItem}>Add marquee item</button>
        </section>

        <section className="admin-card">
          <div className="admin-card-title">Portfolio</div>
          <div className="admin-stack">
            {content.portfolio.map((section, index) => (
              <div className="admin-subcard" key={section.id ?? section.title}>
                <div className="admin-subcard-title">{section.title}</div>
                <div className="admin-grid">
                  <label className="admin-field">
                    <span>Title</span>
                    <input
                      value={section.title}
                      onChange={(event) => updatePortfolioSection(index, 'title', event.target.value)}
                    />
                  </label>
                  <label className="admin-field">
                    <span>Detail</span>
                    <input
                      value={section.detail}
                      onChange={(event) => updatePortfolioSection(index, 'detail', event.target.value)}
                    />
                  </label>
                  <label className="admin-field admin-field-full">
                    <span>Description</span>
                    <textarea
                      rows="4"
                      value={section.copy}
                      onChange={(event) => updatePortfolioSection(index, 'copy', event.target.value)}
                    />
                  </label>
                  <label className="admin-field admin-field-full">
                    <span>Photo URLs, one per line</span>
                    <textarea
                      rows="6"
                      value={section.photos.join('\n')}
                      onChange={(event) => updatePortfolioPhotos(index, event.target.value)}
                    />
                  </label>
                  <label className="admin-field admin-field-full">
                    <span>Upload photos</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) => addPortfolioFiles(index, event.target.files)}
                    />
                  </label>
                </div>

                <div className="photo-chip-grid">
                  {section.photos.map((photo, photoIndex) => (
                    <div className="photo-chip" key={`${photo}-${photoIndex}`}>
                      <img src={photo} alt="Uploaded preview" />
                      <button className="photo-chip-remove" onClick={() => removePortfolioPhoto(index, photoIndex)}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card-title">Services</div>
          <div className="admin-stack">
            {content.services.map((service, index) => (
              <div className="admin-subcard" key={service.frame}>
                <div className="admin-subcard-title">Frame {service.frame}</div>
                <div className="admin-grid">
                  <label className="admin-field">
                    <span>Title</span>
                    <input
                      value={service.title}
                      onChange={(event) => updateService(index, 'title', event.target.value)}
                    />
                  </label>
                  <label className="admin-field admin-field-full">
                    <span>Copy</span>
                    <textarea
                      rows="4"
                      value={service.copy}
                      onChange={(event) => updateService(index, 'copy', event.target.value)}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card-title">CTA and contact</div>
          <div className="admin-grid">
            <label className="admin-field">
              <span>CTA eyebrow</span>
              <input
                value={content.footerCta.eyebrow}
                onChange={(event) => updateFooterCta('eyebrow', event.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>CTA line one</span>
              <input
                value={content.footerCta.titleLineOne}
                onChange={(event) => updateFooterCta('titleLineOne', event.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>CTA line two</span>
              <input
                value={content.footerCta.titleLineTwo}
                onChange={(event) => updateFooterCta('titleLineTwo', event.target.value)}
              />
            </label>
            <label className="admin-field admin-field-full">
              <span>CTA copy</span>
              <textarea
                rows="4"
                value={content.footerCta.copy}
                onChange={(event) => updateFooterCta('copy', event.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>Button label</span>
              <input
                value={content.footerCta.emailLabel}
                onChange={(event) => updateFooterCta('emailLabel', event.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>Secondary label</span>
              <input
                value={content.footerCta.smsLabel}
                onChange={(event) => updateFooterCta('smsLabel', event.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>Email link</span>
              <input
                value={content.contact.emailBookingUrl}
                onChange={(event) => updateContact('emailBookingUrl', event.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>SMS link</span>
              <input
                value={content.contact.smsUrl}
                onChange={(event) => updateContact('smsUrl', event.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>Footer left</span>
              <input
                value={content.contact.footerLeft}
                onChange={(event) => updateContact('footerLeft', event.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>Footer right</span>
              <input
                value={content.contact.footerRight}
                onChange={(event) => updateContact('footerRight', event.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>Sidebar status</span>
              <input
                value={content.sidebar.status}
                onChange={(event) => updateSidebar('status', event.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>Sidebar CTA</span>
              <input
                value={content.sidebar.cta}
                onChange={(event) => updateSidebar('cta', event.target.value)}
              />
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}

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
function Sidebar({ sidebar }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <img className="sidebar-logo-image" src={sidebar.logoSrc} alt="Ignite Motion Sports Media" />
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
          {sidebar.status}
        </div>
        <a className="sidebar-cta" href="#booking">
          {sidebar.cta}
        </a>
      </div>
    </aside>
  );
}

function Marquee({ items }) {
  const trackItems = [...items, '·'];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {Array.from({ length: 4 }).map((_, repeatIndex) => (
          <React.Fragment key={repeatIndex}>
            {trackItems.map((item, itemIndex) => (
              <span className={item === '·' ? '' : 'hot'} key={`${repeatIndex}-${itemIndex}-${item}`}>
                {item}
              </span>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function PublicSite({ content, onOpenLightbox }) {
  return (
    <div className="site-shell" style={cssThemeVars(content.theme)}>
      <Sidebar sidebar={content.sidebar} />

      <div className="with-sidebar">
        <main>
          <section className="hero" id="top">
            <div className="wrap">
              <div className="eyebrow">{content.hero.eyebrow}</div>
              <h1>
                {content.hero.lineOne}<br />
                <span className="accent">{content.hero.accent}</span>
              </h1>
              <p>{content.hero.copy}</p>
            </div>
            <div className="scanline" />
          </section>

          <Marquee items={content.marqueeItems} />

          <section className="gallery" id="portfolio">
            <div className="wrap">
              <div className="section-title">portfolio</div>

              {content.portfolio.map((section) => (
                <PortfolioSection
                  key={section.id ?? section.title}
                  section={section}
                  onOpenLightbox={onOpenLightbox}
                />
              ))}
            </div>
          </section>

          <section className="services" id="services">
            <div className="wrap">
              <div className="section-label">What we shoot</div>
              <div className="section-title">Built for teams and athletes</div>
              <div className="service-grid">
                {content.services.map((service) => (
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
              <div className="section-label">{content.footerCta.eyebrow}</div>
              <h2>
                {content.footerCta.titleLineOne}<br />
                {content.footerCta.titleLineTwo}
              </h2>
              <p className="footer-cta-copy">{content.footerCta.copy}</p>
              <div className="footer-cta-actions">
                <a className="cta-btn" href={content.contact.emailBookingUrl}>{content.footerCta.emailLabel}</a>
                <a className="ghost-btn" href={content.contact.smsUrl}>{content.footerCta.smsLabel}</a>
              </div>
            </div>
          </section>
        </main>

        <footer id="footer">
          <span>{content.contact.footerLeft}</span>
          <span>{content.contact.footerRight}</span>
          <a className="footer-admin-link" href="/?admin=1">Admin</a>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  const [content, setContent] = useState(() => readStoredContent());
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
          setContent(remoteContent);
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteContent));
        }
      } catch {
        // Keep the current draft/default content if the shared store is unavailable.
      }
    };

    void loadContent();
  }, []);

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
        setContent(remoteContent);
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