import React from 'react';

export default function Marquee({ items }) {
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
