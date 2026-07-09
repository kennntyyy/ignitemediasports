import React from 'react';

export default function BookingSection() {
  return (
    <section className="ignite-section" id="booking">
      <div className="ignite-container ignite-booking-grid">
        <div className="ignite-booking-card">
          <div className="ignite-eyebrow">Book a consultation</div>
          <h2>Make it easy for clients to reach you.</h2>
          <p>
            Visitors can book a consultation call from the page, or tap to text you on mobile. These buttons are set up as front-end actions now and can be connected to your preferred booking tool later.
          </p>
          <div className="ignite-booking-actions">
            <a className="ignite-btn ignite-btn-primary" href="#contact">Book Consultation Call</a>
            <a className="ignite-btn ignite-btn-ghost" href="sms:+17208282804">Text Us</a>
          </div>
          <div className="ignite-callout">
            <strong>Booking ready</strong>
            <span>
              Swap in your calendar link whenever you are ready. For now, the primary button jumps to the contact details below so the page stays useful without any extra setup.
            </span>
          </div>
        </div>

        <div className="ignite-info-card" id="contact">
          <div className="ignite-eyebrow">Contact</div>
          <h2>Simple contact options.</h2>
          <p>
            Use this area for your phone number, email, and future booking link. I left the structure flexible so you can add real details later without changing the page style.
          </p>
          <div className="ignite-contact-list">
            <div className="ignite-contact-item"><strong>Email</strong><span>info@ignitemotionsportsmedia.com</span></div>
            <div className="ignite-contact-item"><strong>Text</strong><span>Tap the SMS button above</span></div>
            <div className="ignite-contact-item"><strong>Location</strong><span>Denver, Colorado</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
