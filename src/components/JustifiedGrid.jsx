import React, { useState, useEffect } from 'react';

export default function JustifiedGrid({ photos, altPrefix, onPhotoClick }) {
  const containerRef = React.useRef(null);
  const [width, setWidth] = useState(0);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (photos.length === 0) {
      setItems([]);
      return;
    }
    Promise.all(
      photos.map(
        (src, idx) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () =>
              resolve({ src, idx, ratio: img.naturalWidth / img.naturalHeight || 1 });
            img.onerror = () => resolve(null);
            img.src = src;
          })
      )
    ).then((results) => {
      if (!cancelled) setItems(results.filter(Boolean));
    });
    return () => {
      cancelled = true;
    };
  }, [photos]);

  const targetRowHeight = width < 600 ? 140 : width < 1000 ? 190 : 240;
  const gap = 6;

  const rows = [];
  let currentRow = [];
  let currentRatioSum = 0;

  items.forEach((item) => {
    currentRow.push(item);
    currentRatioSum += item.ratio;
    const rowWidthAtTarget =
      currentRatioSum * targetRowHeight + (currentRow.length - 1) * gap;
    if (rowWidthAtTarget >= width && width > 0) {
      rows.push({ items: currentRow, ratioSum: currentRatioSum });
      currentRow = [];
      currentRatioSum = 0;
    }
  });
  if (currentRow.length > 0) {
    rows.push({ items: currentRow, ratioSum: currentRatioSum, isLast: true });
  }

  return (
    <div className="justified" ref={containerRef}>
      {rows.map((row, ri) => {
        const totalGap = (row.items.length - 1) * gap;
        const rowHeight = row.isLast
          ? targetRowHeight
          : (width - totalGap) / row.ratioSum;
        return (
          <div className="justified-row" key={ri} style={{ height: rowHeight }}>
            {row.items.map((item) => (
              <img
                key={item.src}
                src={item.src}
                alt={`${altPrefix} photo`}
                loading="lazy"
                onClick={() => onPhotoClick(item.idx)}
                style={{ width: item.ratio * rowHeight, height: rowHeight }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
