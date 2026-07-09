import React from 'react';

export default function ServicesSection() {
  return (
    <section className="ignite-section" id="services">
      <div className="ignite-container ignite-split">
        <div className="ignite-panel">
          <div className="ignite-eyebrow">What the site needs</div>
          <h2 className="ignite-panel-title">Booking, texting, and photo space built in.</h2>
          <p className="ignite-panel-copy">
            The layout includes a consultation booking CTA, a tap-to-text option for mobile users, and photo placeholders throughout so the page still works before all of your images are added.
          </p>
          <div className="ignite-contact-list">
            <div className="ignite-contact-item"><strong>Consultation call</strong><span>Use the booking link below</span></div>
            <div className="ignite-contact-item"><strong>Text message</strong><span>Tap to open your phone&apos;s messaging app</span></div>
            <div className="ignite-contact-item"><strong>Portfolio</strong><span>Basketball / Jiu Jitsu / Individual sports shots</span></div>
          </div>
        </div>

        <div className="ignite-panel">
          <div className="ignite-eyebrow">Photo layout</div>
          <h2 className="ignite-panel-title">Large reserved areas for your images.</h2>
          <p className="ignite-panel-copy">
            These empty frames are intentionally left open so you can place your brand photos, action shots, or banner images without needing a redesign.
          </p>
          <div className="ignite-mini-grid">
            <div className="ignite-mini-box">
              <strong>Hero banner</strong>
              <span>Use for a wide athlete or action image.</span>
            </div>
            <div className="ignite-mini-box">
              <strong>Side feature</strong>
              <span>Use for a logo, portrait, or vertical shot.</span>
            </div>
          </div>
          <div className="ignite-callout">
            <strong>Important note</strong>
            <span>
              To keep text messaging free, this mockup uses a device text link. Once you have a number, we can connect it to an SMS or WhatsApp action.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
