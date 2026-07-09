import React from 'react';

export default function FooterCta() {
  return (
    <section className="ignite-footer-cta">
      <div className="ignite-container ignite-footer-cta-inner">
        <div>
          <div className="ignite-eyebrow">Ready when you are</div>
          <h2>Your photos can take the spotlight next.</h2>
          <p>
            Once you add your images, this page already has the space and structure to showcase them. The palette and typography follow the brand guideline screenshot you shared: Montserrat, orange accents, black backgrounds, and bold white type.
          </p>
        </div>
        <div className="ignite-footer-card">
          <h3>Ignite Motion Sports Media</h3>
          <p>
            Consultation calls, mobile texting, and portfolio sections for basketball, jiu jitsu, and individual sports shots.
          </p>
          <a className="ignite-btn ignite-btn-primary" href="#booking">Book Now</a>
          <a className="ignite-btn ignite-btn-ghost" href="sms:+17208282804">Text Now</a>
        </div>
      </div>
    </section>
  );
}
