import React from 'react';
import { sidebarLinks } from '../lib/nav.js';

export default function Sidebar({ sidebar }) {
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
