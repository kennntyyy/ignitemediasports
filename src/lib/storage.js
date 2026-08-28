import { defaultContent } from '../../api/defaultContent.js';

export const STORAGE_KEY = 'ignite-motion-site-content-v1';

export function readStoredContent() {
  if (typeof window === 'undefined') return defaultContent;

  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (!stored) return defaultContent;

    return {
      ...defaultContent,
      ...stored,
      theme: { ...defaultContent.theme, ...(stored.theme ?? {}) },
      hero: { ...defaultContent.hero, ...(stored.hero ?? {}) },
      footerCta: { ...defaultContent.footerCta, ...(stored.footerCta ?? {}) },
      sidebar: { ...defaultContent.sidebar, ...(stored.sidebar ?? {}) },
      contact: { ...defaultContent.contact, ...(stored.contact ?? {}) },
      marqueeItems:
        Array.isArray(stored.marqueeItems) && stored.marqueeItems.length > 0
          ? stored.marqueeItems
          : defaultContent.marqueeItems,
      portfolio:
        Array.isArray(stored.portfolio) && stored.portfolio.length > 0
          ? stored.portfolio.map((section, index) => {
              const fb = defaultContent.portfolio[index] ?? defaultContent.portfolio[0] ?? { photos: [] };
              return {
                ...fb,
                ...section,
                photos:
                  Array.isArray(section.photos) && section.photos.length > 0 ? section.photos : fb.photos,
              };
            })
          : defaultContent.portfolio,
      services:
        Array.isArray(stored.services) && stored.services.length > 0
          ? stored.services.map((service, index) => ({
              ...(defaultContent.services[index] ?? defaultContent.services[0] ?? {}),
              ...service,
            }))
          : defaultContent.services,
    };
  } catch {
    return defaultContent;
  }
}
