import React, { useState } from 'react';
import { fileToCompressedDataUrl, parsePhotoInput } from '../lib/image.js';

export default function AdminPanel({
  content,
  onChangeContent,
  onResetContent,
  isAuthenticated,
  onRequestLogin,
  onRequestLogout,
  onSaveContent,
  saveStatus,
  saveError,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) {
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [dragged, setDragged] = useState(null); // { sectionIndex, photoIndex }

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
            <a className="ghost-btn" href="/">← Back to site</a>
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

    // Pre-check file sizes before compression
    for (const f of nextFiles) {
      if (f.size > 12 * 1024 * 1024) {
        alert(`"${f.name}" is ${(f.size / 1024 / 1024).toFixed(1)}MB — please use a file under 12MB or paste a URL instead.`);
        return;
      }
    }

    const uploaded = await Promise.all(nextFiles.map((file) => fileToCompressedDataUrl(file)));
    const estimated = JSON.stringify(content).length + uploaded.join('').length;
    if (estimated > 900000) {
      alert(`Adding these photos would exceed the 900KB total storage limit (estimated ${Math.round(estimated / 1024)}KB). Remove some existing uploaded photos or use URL references (/photos/...) instead.`);
      return;
    }

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

  const movePortfolioPhoto = (sectionIndex, from, to) => {
    if (to < 0) return;
    onChangeContent((current) => ({
      ...current,
      portfolio: current.portfolio.map((section, index) => {
        if (index !== sectionIndex) return section;
        if (to >= section.photos.length) return section;
        const next = [...section.photos];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        return { ...section, photos: next };
      }),
    }));
  };

  const handleDragStart = (sectionIndex, photoIndex) => setDragged({ sectionIndex, photoIndex });
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (sectionIndex, targetIndex) => {
    if (!dragged || dragged.sectionIndex !== sectionIndex) return;
    if (dragged.photoIndex === targetIndex) return;
    movePortfolioPhoto(sectionIndex, dragged.photoIndex, targetIndex);
    setDragged(null);
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
            <button className="ghost-btn" onClick={onUndo} disabled={!canUndo} title={canUndo ? 'Undo (Ctrl+Z)' : 'Nothing to undo'}>
              Undo
            </button>
            <button className="ghost-btn" onClick={onRedo} disabled={!canRedo} title={canRedo ? 'Redo (Ctrl+Shift+Z)' : 'Nothing to redo'}>
              Redo
            </button>
            <button className="ghost-btn" onClick={onRequestLogout}>Log out</button>
            <button className="cta-btn" onClick={() => void onSaveContent().catch(() => {})}>Save changes</button>
            <a className="ghost-btn" href="/">View live site</a>
            <button className="ghost-btn" onClick={onResetContent}>Reset defaults</button>
          </div>
        </div>

        <div className="admin-status-row">
          <span className={`admin-status-pill ${saveStatus}`}>{saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving' : saveStatus === 'error' ? 'Save failed' : 'Ready'}</span>
          {saveError ? <span className="admin-error" style={{ marginLeft: 12 }}>{saveError}</span> : null}
          <span className="admin-storage-hint" style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: JSON.stringify(content).length > 800000 ? '#ff6b6b' : 'var(--smoke)' }}>
            Storage: {Math.round(JSON.stringify(content).length / 1024)}KB / 900KB
          </span>
        </div>
        {JSON.stringify(content).length > 800000 ? (
          <div className="admin-error" style={{ marginBottom: 12 }}>
            Near storage limit — remove some uploaded photos or use URL references (e.g. /photos/...) instead of file uploads. Single files are compressed, but total content must stay under 900KB.
          </div>
        ) : null}

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
                    <div
                      className="photo-chip"
                      key={`${photo}-${photoIndex}`}
                      draggable
                      onDragStart={() => handleDragStart(index, photoIndex)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(index, photoIndex)}
                      title="Drag to reorder"
                    >
                      <img src={photo} alt="Uploaded preview" />
                      <div className="photo-chip-actions">
                        <button
                          className="ghost-btn photo-chip-move"
                          disabled={photoIndex === 0}
                          onClick={() => movePortfolioPhoto(index, photoIndex, photoIndex - 1)}
                          title="Move left"
                        >
                          ←
                        </button>
                        <button
                          className="ghost-btn photo-chip-move"
                          disabled={photoIndex === section.photos.length - 1}
                          onClick={() => movePortfolioPhoto(index, photoIndex, photoIndex + 1)}
                          title="Move right"
                        >
                          →
                        </button>
                        <button className="photo-chip-remove" onClick={() => removePortfolioPhoto(index, photoIndex)}>
                          Remove
                        </button>
                      </div>
                      <span className="photo-chip-index">{photoIndex + 1}</span>
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
