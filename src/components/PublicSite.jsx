import React from 'react';
import { cssThemeVars } from '../lib/theme.js';
import Sidebar from './Sidebar.jsx';
import Marquee from './Marquee.jsx';
import PortfolioSection from './PortfolioSection.jsx';

export default function PublicSite({ content, onOpenLightbox }) {
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
