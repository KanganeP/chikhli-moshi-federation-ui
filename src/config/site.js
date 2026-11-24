// Single place to edit organisation details. All values below are PLACEHOLDERS.
export const site = {
  name: 'Chikhli–Moshi Federation',
  short: 'CMF',
  url: 'https://www.chikhlimoshifederation.in',
  email: 'info@chikhlimoshifederation.in',
  phone: '+91 98XXX XXXXX',
  whatsapp: '91XXXXXXXXXX', // digits only, with country code
  address: 'Federation Office, Chikhli–Moshi Road, Pimpri-Chinchwad, Pune, Maharashtra',
  hours: 'Mon–Sat, 10:00 am – 6:00 pm',
  registration: 'Reg. No. XXXX/2026 (placeholder)',
  social: {
    facebook: 'https://facebook.com/',
    instagram: 'https://instagram.com/',
    youtube: 'https://youtube.com/',
  },
  // OpenStreetMap embed (Chikhli–Moshi area). Adjust bbox/marker for your office.
  mapSrc:
    'https://www.openstreetmap.org/export/embed.html?bbox=73.8000%2C18.6500%2C73.9000%2C18.7200&layer=mapnik&marker=18.6800%2C73.8500',
};

export const NAV = [
  { key: 'home', to: '/' },
  { key: 'about', to: '/about' },
  { key: 'societies', to: '/societies' },
  { key: 'notices', to: '/notices' },
  { key: 'events', to: '/events' },
  {
    key: 'help',
    children: [
      { key: 'services', to: '/services' },
      { key: 'raiseIssue', to: '/raise-issue' },
      { key: 'resources', to: '/resources' },
    ],
  },
  {
    key: 'more',
    children: [
      { key: 'committee', to: '/committee' },
      { key: 'gallery', to: '/gallery' },
      { key: 'membership', to: '/membership' },
      { key: 'contact', to: '/contact' },
    ],
  },
];
