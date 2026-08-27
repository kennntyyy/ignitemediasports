const basketballPhotos = [
  'DSC02257',
  'DSC02308',
  'DSC02311',
  'DSC02323',
  'DSC02444',
  'DSC02804',
  'DSC02846',
  'DSC02934',
  'DSC02995',
  'DSC03342',
  'DSC04047',
  'DSC04050',
  'DSC04090',
  'IMG_0014',
  'IMG_0606',
].map((name) => `/photos/basketball/${name}.jpg`);

const juijitsuPhotos = [
  'DSC02028',
  'DSC02096',
  'DSC07190',
  'DSC07227',
  'DSC07232',
  'DSC07234-2',
  'DSC07238',
  'DSC07261',
  'DSC08271',
  'DSC08389',
].map((name) => `/photos/juijitsu/${name}.jpg`);

const individualPhotos = [
  'DSC08057',
  'DSC08089',
  'DSC08108',
  'DSC08131',
  'DSC08151',
  'DSC08168',
  'DSC08193',
  'DSC08227',
  'DSC08243',
  'DSC08276',
  'DSC08300',
  'DSC08316',
  'DSC08367',
  'DSC08425',
  'DSC08443',
  'DSC08458',
  'DSC08464',
  'DSC08503',
].map((name) => `/photos/individual/${name}.jpg`);

const emailBookingUrl =
  'mailto:tiffany@bydesigncontentcreation.com?subject=Ignite%20Motion%20Sports%20Media%20Consultation&body=Hi%20Tiffany%2C%0A%0AI%27d%20like%20to%20book%20a%20consultation%20call%20about%20my%20sports%20photo%20project.%0A%0AThanks!';

export const defaultContent = {
  theme: {
    background: '#0b0b0c',
    surface: '#000000',
    primary: '#fb531e',
    accent: '#ff7c33',
    button: '#b3392c',
    text: '#ffffff',
    muted: '#8b8b87',
  },
  hero: {
    eyebrow: 'Sports photography studio',
    lineOne: 'Capture the',
    accent: 'ignition point.',
    copy:
      'We shoot the half-second before the crowd reacts — the release, the impact, the breakaway. Game day, editorial, and athlete portraiture for teams who play for keeps.',
  },
  marqueeItems: ['Basketball', 'Editorial', 'Jiu jitsu', 'Consultation calls', 'Individual sports shots', 'Denver, CO'],
  portfolio: [
    {
      id: 'basketball',
      title: 'Basketball',
      code: '014A',
      copy: 'Game action, sideline emotion, team features, and player portraits. Add your basketball gallery photos here.',
      detail: 'Court action · Team shots · Portraits',
      photos: basketballPhotos,
    },
    {
      id: 'juijitsu',
      title: 'Jiu Jitsu',
      code: '015',
      copy: 'Controlled action, mat movement, detail shots, and competition moments with space for a full visual story.',
      detail: 'Competition · Training · Detail shots',
      photos: juijitsuPhotos,
    },
    {
      id: 'individual',
      title: 'Individual Sports Shots',
      code: '016A',
      copy: 'One-on-one athlete images, portraits, and action shots for personal branding and social media use.',
      detail: 'Portraits · Action · Brand content',
      photos: individualPhotos,
    },
  ],
  services: [
    {
      frame: '020',
      title: 'Game day coverage',
      copy: 'Full-match photographers courtside or pitchside, edited and delivered same night for press and socials.',
    },
    {
      frame: '021',
      title: 'Athlete portraits',
      copy: 'Studio and on-location portraiture for roster pages, sponsor decks, and season launch campaigns.',
    },
    {
      frame: '022',
      title: 'Editorial & brand',
      copy: 'Long-form visual stories for teams and sponsors who need more than a highlight reel.',
    },
  ],
  footerCta: {
    eyebrow: 'Ready when you are',
    titleLineOne: "Let's set up your",
    titleLineTwo: 'consultation call.',
    copy:
      'Use the email button to send a consultation request directly, or tap the text link below to send a message for free through your phone\'s SMS app.',
    emailLabel: 'Email to book',
    smsLabel: 'Text me for free',
  },
  sidebar: {
    logoSrc: '/photos/logo.png',
    status: 'Based in Denver, CO',
    cta: 'Book a consultation',
  },
  contact: {
    emailBookingUrl,
    smsUrl: 'sms:+17208282804',
    footerLeft: '© Ignite Motion Sports Media 2026',
    footerRight: 'Denver, CO',
  },
};

export function normalizeContent(input) {
  const fallback = defaultContent;
  const content = input && typeof input === 'object' ? input : {};

  return {
    ...fallback,
    ...content,
    theme: { ...fallback.theme, ...(content.theme ?? {}) },
    hero: { ...fallback.hero, ...(content.hero ?? {}) },
    footerCta: { ...fallback.footerCta, ...(content.footerCta ?? {}) },
    sidebar: { ...fallback.sidebar, ...(content.sidebar ?? {}) },
    contact: { ...fallback.contact, ...(content.contact ?? {}) },
    marqueeItems:
      Array.isArray(content.marqueeItems) && content.marqueeItems.length > 0
        ? content.marqueeItems
        : fallback.marqueeItems,
    portfolio:
      Array.isArray(content.portfolio) && content.portfolio.length > 0
        ? content.portfolio.map((section, index) => ({
            ...fallback.portfolio[index],
            ...section,
            photos:
              Array.isArray(section.photos) && section.photos.length > 0
                ? section.photos
                : fallback.portfolio[index].photos,
          }))
        : fallback.portfolio,
    services:
      Array.isArray(content.services) && content.services.length > 0
        ? content.services.map((service, index) => ({
            ...fallback.services[index],
            ...service,
          }))
        : fallback.services,
  };
}