import React from 'react';

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

export default function PortfolioSection() {
  const sections = [
    {
      title: 'Basketball',
      copy:
        'Game action, sideline emotion, team features, and player portraits. This section is ready for your basketball gallery photos.',
      tags: ['Game day', 'Team shots', 'Portraits'],
      photos: basketballPhotos,
    },
    {
      title: 'Jiu Jitsu',
      copy:
        'Controlled action, mat movement, detail shots, and competition moments with space for a full visual story.',
      tags: ['Competition', 'Training', 'Detail shots'],
      photos: [],
    },
    {
      title: 'Individual Sports Shots',
      copy:
        'One-on-one athlete images, portraits, and action shots for personal branding and social media use.',
      tags: ['Portraits', 'Action', 'Brand content'],
      photos: [],
    },
  ];

  return (
    <section className="ignite-section" id="portfolio">
      <div className="ignite-container">
        <div className="ignite-eyebrow">Portfolio</div>
        <h2 className="ignite-section-title">Subsections for the sports you asked for.</h2>
        <p className="ignite-section-copy">
          The portfolio is separated into the three categories you requested, with generous image space so you can add your own photos later without breaking the layout.
        </p>

        <div className="ignite-portfolio-grid">
          {sections.map((section) => (
            <article className="ignite-portfolio-card" key={section.title}>
              {section.photos.length > 0 ? (
                <div className="ignite-photo-slot ignite-portfolio-photo">
                  <img
                    src={section.photos[0]}
                    alt={`${section.title} featured photo`}
                    className="ignite-portfolio-hero-img"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div
                  className="ignite-photo-slot ignite-portfolio-photo"
                  aria-label={`${section.title} photo placeholder`}
                >
                  <span className="ignite-photo-label">Drop photo here</span>
                </div>
              )}

              <div className="ignite-portfolio-content">
                <h3>{section.title}</h3>
                <p>{section.copy}</p>
                <div className="ignite-tag-row">
                  {section.tags.map((tag) => (
                    <span className="ignite-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {section.photos.length > 1 && (
                <div className="ignite-portfolio-thumb-grid">
                  {section.photos.slice(1).map((src) => (
                    <div className="ignite-portfolio-thumb" key={src}>
                      <img
                        src={src}
                        alt={`${section.title} photo`}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}