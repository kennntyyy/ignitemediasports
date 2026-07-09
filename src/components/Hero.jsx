import React from 'react';

export default function Hero() {
  return (
    <section className="ignite-hero" id="top">
      <div className="ignite-container ignite-hero-grid">
        <div className="ignite-hero-copy">
          <div className="ignite-eyebrow">Ignite Motion Sports Media</div>
          <h1>
            Where your <span className="ignite-accent">story</span> gets motion.
          </h1>
          <p>
            High-energy sports photography and media built around your brand, your athletes,
            and your moments. This intro keeps space open for your photos so you can drop them
            in later without changing the layout.
          </p>

          <div className="ignite-hero-actions">
            <a className="ignite-btn ignite-btn-primary" href="#booking">
              Book a Consultation Call
            </a>
            <a className="ignite-btn ignite-btn-ghost" href="#portfolio">
              View Portfolio
            </a>
            <a className="ignite-btn ignite-btn-ghost" href="sms:+17208282804">
              Text Us
            </a>
          </div>

          <div className="ignite-hero-points">
            <div className="ignite-hero-point">
              <strong>Fast booking</strong>
              <span>Let visitors request a consultation call in one click.</span>
            </div>
            <div className="ignite-hero-point">
              <strong>Text option</strong>
              <span>Includes a tap-to-text button for mobile users.</span>
            </div>
            <div className="ignite-hero-point">
              <strong>Photo room</strong>
              <span>Large placeholders are reserved for your future images.</span>
            </div>
          </div>
        </div>

        <div className="ignite-hero-art" aria-label="Hero image placeholder">
          <div className="ignite-hero-art-top">
            <span>2025 / Brand direction</span>
            <span>Orange / Black / White</span>
          </div>

          <div className="ignite-photo-slot ignite-hero-image">
            <div className="ignite-spotlight" aria-hidden="true" />
          </div>

          <div className="ignite-hero-badge">
            Consultation calls
            <span>Booking ready</span>
          </div>
        </div>
      </div>
    </section>
  );
}
