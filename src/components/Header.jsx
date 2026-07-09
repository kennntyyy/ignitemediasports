import React from 'react';

export default function Header() {
  return (
    <header className="ignite-nav">
      <div className="ignite-container ignite-nav-inner">
        <a className="ignite-brand" href="#top" aria-label="Ignite Motion Sports Media home">
          <div className="ignite-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2.4C10.1 5.7 6.2 8 6.2 12.5A5.8 5.8 0 0 0 12 18.3c3 0 5.7-1.9 5.7-5.4 0-1.8-.7-3-1.8-4.1.2 1.5-.7 2.4-1.7 2.1.8-1.8-.1-3.9-1.9-5 .4 1.8-.4 3-1.8 3.9-1.1.8-2.1 2.1-2.1 3.3a3.7 3.7 0 0 0 7.4 0c0-3.2-1.9-5.7-6-10.7Z"
                fill="#FB531E"
              />
            </svg>
          </div>
          <div className="ignite-brand-text">
            <strong>IGNITE MOTION</strong>
            <span>SPORTS MEDIA</span>
          </div>
        </a>

        <ul className="ignite-nav-links">
          <li><a href="#portfolio">Portfolio</a></li>
          <li><a href="#services">What I Shoot</a></li>
          <li><a href="#booking">Book</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        <div className="ignite-nav-actions">
          <a className="ignite-btn ignite-btn-ghost" href="#contact">Text Me</a>
          <a className="ignite-btn ignite-btn-primary" href="#booking">Book a Consultation</a>
        </div>
      </div>
    </header>
  );
}