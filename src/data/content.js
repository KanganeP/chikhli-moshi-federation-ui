/**
 * ALL CONTENT HERE IS SAMPLE / PLACEHOLDER DATA.
 * Replace society names, people, phone numbers, dates and numbers with real information
 * before going live. Phone numbers are intentionally masked (98XXX XXXXX).
 */

export const stats = [
  { label: 'Member societies', value: 120, suffix: '+' },
  { label: 'Families represented', value: 25000, suffix: '+' },
  { label: 'Issues resolved', value: 1500, suffix: '+' },
  { label: 'Years of service', value: 8, suffix: '' },
];

export const areas = [
  'Chikhli', 'Moshi', 'Moshi Pradhikaran', 'Jadhavwadi', 'Kudalwadi', 'Borhadewadi', 'Dudulgaon', 'Charholi',
];

export const societyTypes = ['Housing Society', 'Apartment Owners Association', 'Row-house Colony', 'Gated Township'];

export const societies = [
  ['Sai Srushti Housing Society', 'Chikhli', 'Housing Society', 180, 2011],
  ['Ganga Heights Co-op. Society', 'Moshi', 'Housing Society', 240, 2014],
  ['Shivneri Residency', 'Moshi Pradhikaran', 'Apartment Owners Association', 96, 2016],
  ['Tulsi Vihar Row Houses', 'Chikhli', 'Row-house Colony', 64, 2009],
  ['Orchid Park Township', 'Charholi', 'Gated Township', 520, 2018],
  ['Anand Nagari CHS', 'Jadhavwadi', 'Housing Society', 128, 2012],
  ['Vasant Kunj Apartments', 'Kudalwadi', 'Apartment Owners Association', 72, 2015],
  ['Pavan Dham Society', 'Moshi', 'Housing Society', 150, 2010],
  ['Riverview Enclave', 'Dudulgaon', 'Gated Township', 410, 2019],
  ['Matoshree Residency', 'Borhadewadi', 'Housing Society', 88, 2013],
  ['Krishna Kunj Colony', 'Chikhli', 'Row-house Colony', 52, 2008],
  ['Sunrise Greens', 'Moshi Pradhikaran', 'Gated Township', 360, 2020],
  ['Hari Om Apartments', 'Jadhavwadi', 'Apartment Owners Association', 60, 2017],
  ['Lotus Court CHS', 'Charholi', 'Housing Society', 110, 2014],
  ['Shree Samarth Nagar', 'Dudulgaon', 'Housing Society', 142, 2012],
  ['Maple Woods', 'Moshi', 'Gated Township', 300, 2021],
  ['Ekta Residency', 'Kudalwadi', 'Housing Society', 92, 2011],
  ['Prathamesh Park', 'Borhadewadi', 'Apartment Owners Association', 78, 2016],
].map(([name, area, type, flats, since], i) => ({
  id: `soc-${i + 1}`,
  name,
  area,
  type,
  flats,
  since,
  chairman: 'Chairperson (name to be added)',
  contact: '+91 98XXX 0XXXX',
  amenities: ['24×7 security', 'CCTV', 'Rainwater harvesting', i % 2 ? 'Solar water heating' : 'Lift AMC', 'Kids play area'].slice(0, 3 + (i % 3)),
  featured: i < 4,
}));

export const noticeCategories = ['All', 'General', 'Meeting', 'Civic', 'Legal', 'Safety'];

export const notices = [
  { id: 'n1', title: 'General Body Meeting – 25 October 2026', category: 'Meeting', date: '2026-10-12', body: 'All member societies are requested to send two representatives with authorisation letters. Agenda: annual accounts, new committee proposals, civic liaison update.' },
  { id: 'n2', title: 'Water supply schedule change – Moshi Pradhikaran', category: 'Civic', date: '2026-10-10', body: 'Supply timings will change for a week due to pipeline maintenance. Societies are advised to plan tank filling accordingly and report shortages through the Raise an Issue page.' },
  { id: 'n3', title: 'Fire NOC & fire-safety audit reminder', category: 'Safety', date: '2026-10-05', body: 'Societies with buildings above the prescribed height are reminded to check validity of fire NOC and complete half-yearly fire-safety inspections of pumps, extinguishers and alarms.' },
  { id: 'n4', title: 'Deemed conveyance – documentation checklist updated', category: 'Legal', date: '2026-09-28', body: 'A refreshed checklist for deemed-conveyance applications is available in Resources. Please consult your society’s legal advisor before filing.' },
  { id: 'n5', title: 'Diwali cleanliness and waste-segregation drive', category: 'General', date: '2026-09-22', body: 'Volunteers needed in each society for wet/dry waste segregation awareness during the festive season.' },
  { id: 'n6', title: 'Street-light and pothole survey', category: 'Civic', date: '2026-09-15', body: 'Please submit location, photo and landmark for dark spots and potholes so we can escalate them in one consolidated representation.' },
  { id: 'n7', title: 'Lift licence renewal – what societies must check', category: 'Safety', date: '2026-09-03', body: 'Lift installations need periodic inspection and a valid licence. Keep the AMC contract, inspection certificate and logbook ready.' },
];

const d = (iso) => `${iso}T00:00:00+05:30`;
export const events = [
  { id: 'ev-gbm', title: 'Annual General Body Meeting', date: '2026-10-25T10:30:00+05:30', durationHours: 3, venue: 'Community Hall, Chikhli', tag: 'Meeting', summary: 'Annual accounts, committee elections preview and member Q&A.' },
  { id: 'ev-fire', title: 'Fire Safety & Mock Drill Workshop', date: '2026-11-01T16:00:00+05:30', durationHours: 2, venue: 'Open Ground, Moshi Pradhikaran', tag: 'Safety', summary: 'Hands-on training on extinguishers, evacuation drills and society fire-safety audits.' },
  { id: 'ev-diwali', title: 'Diwali Snehsammelan', date: '2026-11-15T18:00:00+05:30', durationHours: 3, venue: 'Federation Office Lawn, Chikhli', tag: 'Community', summary: 'Festive get-together for office-bearers and families with cultural performances.' },
  { id: 'ev-law', title: 'Co-operative Housing Law Clinic', date: '2026-11-22T11:00:00+05:30', durationHours: 3, venue: 'Federation Office, Chikhli', tag: 'Legal', summary: 'Free first-level guidance on bye-laws, conveyance, redevelopment and disputes.' },
  { id: 'ev-republic', title: 'Republic Day Flag Hoisting & Family Fun Run', date: '2027-01-26T07:30:00+05:30', durationHours: 3, venue: 'Moshi Sports Ground', tag: 'Community', summary: 'Flag hoisting followed by a neighbourhood fun run for all ages.' },
  { id: 'ev-ganesh', title: 'Eco-Ganeshotsav Cleanliness Drive', date: d('2026-09-20'), durationHours: 4, venue: 'Indrayani Riverfront, Moshi', tag: 'Community', summary: 'Volunteers from 40 societies cleaned the riverfront after immersion.' },
  { id: 'ev-blood', title: 'Blood Donation Camp', date: d('2026-08-09'), durationHours: 5, venue: 'Federation Office, Chikhli', tag: 'Health', summary: 'Camp conducted with a partner hospital and local donors.' },
  { id: 'ev-indep', title: 'Independence Day Celebration', date: d('2026-08-15'), durationHours: 3, venue: 'Moshi Sports Ground', tag: 'Community', summary: 'Flag hoisting and prize distribution for the children’s drawing contest.' },
];

export const committee = [
  { name: 'President', role: 'Adhyaksha', initials: 'PR', phone: '+91 98XXX 11111', email: 'president@chikhlimoshifederation.in', bio: 'Leads the federation and represents member societies before civic bodies.' },
  { name: 'Vice President', role: 'Upadhyaksha', initials: 'VP', phone: '+91 98XXX 22222', email: 'vp@chikhlimoshifederation.in', bio: 'Coordinates committees and member-society outreach.' },
  { name: 'General Secretary', role: 'Sachiv', initials: 'GS', phone: '+91 98XXX 33333', email: 'secretary@chikhlimoshifederation.in', bio: 'Runs day-to-day operations, meetings and records.' },
  { name: 'Treasurer', role: 'Khajinadar', initials: 'TR', phone: '+91 98XXX 44444', email: 'accounts@chikhlimoshifederation.in', bio: 'Maintains federation accounts, audit and membership fees.' },
  { name: 'Legal Advisor', role: 'Kayda Salagar', initials: 'LA', phone: '+91 98XXX 55555', email: 'legal@chikhlimoshifederation.in', bio: 'Guides societies on bye-laws, conveyance and disputes.' },
  { name: 'Civic Liaison Head', role: 'Nagari Samanvayak', initials: 'CL', phone: '+91 98XXX 66666', email: 'civic@chikhlimoshifederation.in', bio: 'Follows up water, roads, drainage and waste issues with authorities.' },
  { name: 'Women’s Wing Head', role: 'Mahila Aghadi', initials: 'WW', phone: '+91 98XXX 77777', email: 'women@chikhlimoshifederation.in', bio: 'Leads safety, wellness and community programmes for women.' },
  { name: 'Youth Wing Head', role: 'Yuva Aghadi', initials: 'YW', phone: '+91 98XXX 88888', email: 'youth@chikhlimoshifederation.in', bio: 'Runs volunteering, sports and digital initiatives.' },
];

export const services = [
  { icon: 'Gavel', title: 'Legal & bye-law guidance', text: 'First-level guidance on society bye-laws, general-body procedures, disputes and notices.' },
  { icon: 'HomeWork', title: 'Conveyance & redevelopment', text: 'Checklists and expert connects for conveyance, deemed conveyance and redevelopment.' },
  { icon: 'AccountBalance', title: 'Audit & accounts support', text: 'Templates and referrals for statutory audit, maintenance billing and transparent accounts.' },
  { icon: 'Water', title: 'Water, roads & civic issues', text: 'Consolidated representations to PCMC and other agencies for water, drainage, roads and street-lights.' },
  { icon: 'Security', title: 'Safety & fire preparedness', text: 'Fire-safety drills, lift safety, CCTV and security best-practice workshops.' },
  { icon: 'Recycling', title: 'Waste, solar & green living', text: 'Waste segregation, composting, rainwater harvesting and solar adoption programmes.' },
];

export const faqs = [
  { q: 'Who can become a member of the federation?', a: 'Any registered housing society, apartment owners’ association, row-house colony or gated township in the Chikhli–Moshi area can apply through the Membership page. Individual residents can join as associate members.' },
  { q: 'Does the federation replace my society’s managing committee?', a: 'No. Each society remains fully independent. The federation offers shared guidance, a collective voice with authorities and a support network.' },
  { q: 'How are civic issues raised with the authorities?', a: 'Issues submitted through Raise an Issue are reviewed, grouped by area and category, and escalated in consolidated representations to the concerned department with follow-up.' },
  { q: 'Is the legal guidance free?', a: 'First-level guidance during law clinics and helpdesk hours is free for member societies. Detailed legal work is referred to empanelled professionals at their own fees.' },
  { q: 'What is deemed conveyance?', a: 'Where a builder/promoter does not execute conveyance in favour of the society, the Co-operative Societies Act provides a route to apply to the competent authority for deemed conveyance. Documentation requirements change from time to time — consult your legal advisor.' },
  { q: 'How do I advertise or sponsor?', a: 'Please reach out via the Contact page. Google ads shown on this website are served automatically by Google and are not endorsed by the federation.' },
];

export const gallery = [
  { id: 'g1', album: 'Events', caption: 'Annual General Body Meeting', color: ['#1f3a93', '#6f86e0'], ratio: 4 / 3 },
  { id: 'g2', album: 'Community', caption: 'Eco-Ganeshotsav cleanup', color: ['#0f9d8a', '#7ee0cf'], ratio: 1 },
  { id: 'g3', album: 'Civic', caption: 'Road survey with PCMC officials', color: ['#ff8f1f', '#ffc27a'], ratio: 3 / 4 },
  { id: 'g4', album: 'Events', caption: 'Diwali Snehsammelan', color: ['#e8527a', '#ffb0c6'], ratio: 4 / 3 },
  { id: 'g5', album: 'Safety', caption: 'Fire safety mock drill', color: ['#d9381e', '#ff9a85'], ratio: 1 },
  { id: 'g6', album: 'Community', caption: 'Blood donation camp', color: ['#7a3fb0', '#caa7ee'], ratio: 3 / 4 },
  { id: 'g7', album: 'Civic', caption: 'Water supply review meeting', color: ['#2a7fd1', '#9bd0ff'], ratio: 4 / 3 },
  { id: 'g8', album: 'Safety', caption: 'Lift safety awareness', color: ['#4a6a3a', '#b5d89f'], ratio: 1 },
  { id: 'g9', album: 'Community', caption: 'Independence Day', color: ['#138808', '#ff9933'], ratio: 4 / 3 },
];

export const resources = {
  documents: [
    { title: 'Model Bye-laws for Co-operative Housing Societies (summary)', type: 'PDF', size: '—', file: '/docs/model-bye-laws.pdf' },
    { title: 'Deemed conveyance – document checklist', type: 'PDF', size: '—', file: '/docs/deemed-conveyance-checklist.pdf' },
    { title: 'General body meeting notice & minutes templates', type: 'DOCX', size: '—', file: '/docs/gbm-templates.docx' },
    { title: 'Annual maintenance & sinking-fund calculator', type: 'XLSX', size: '—', file: '/docs/maintenance-calculator.xlsx' },
    { title: 'Fire-safety self-audit checklist', type: 'PDF', size: '—', file: '/docs/fire-safety-checklist.pdf' },
    { title: 'Federation membership application form', type: 'PDF', size: '—', file: '/docs/membership-form.pdf' },
  ],
  links: [
    { title: 'Pimpri Chinchwad Municipal Corporation', url: 'https://www.pcmcindia.gov.in/', note: 'Property tax, water, grievances' },
    { title: 'MahaRERA', url: 'https://maharera.maharashtra.gov.in/', note: 'Project registration & complaints' },
    { title: 'Maharashtra Sahakar (Co-operation) Dept.', url: 'https://sahakarayukta.maharashtra.gov.in/', note: 'Co-operative societies matters' },
    { title: 'MSEDCL (Mahavitaran)', url: 'https://www.mahadiscom.in/', note: 'Electricity connections & complaints' },
    { title: 'Maharashtra IGR (e-Registration)', url: 'https://igrmaharashtra.gov.in/', note: 'Registration & stamp duty' },
  ],
  emergency: [
    { icon: 'LocalPolice', label: 'Police', number: '112' },
    { icon: 'LocalFireDepartment', label: 'Fire', number: '101' },
    { icon: 'LocalHospital', label: 'Ambulance', number: '108' },
    { icon: 'SupportAgent', label: 'Women helpline', number: '1091' },
  ],
};

export const tiers = [
  { id: 'society', name: 'Society Member', price: '₹ 2,500 / year', highlight: true, points: ['Full voting rights', 'Legal & audit guidance', 'Civic escalation support', 'Listing in society directory', 'Workshops & law clinics'] },
  { id: 'associate', name: 'Associate Resident', price: '₹ 300 / year', points: ['Event invitations', 'Issue tracking support', 'Newsletter & notices', 'Volunteer programmes'] },
  { id: 'patron', name: 'Patron / Sponsor', price: 'Contact us', points: ['Brand mention at events', 'Community outreach', 'Local business listing', 'Annual recognition'] },
];

export const legal = {
  privacy: {
    title: 'Privacy Policy',
    updated: '14 October 2026',
    sections: [
      ['Information we collect', 'When you use our contact, membership or issue forms we collect the details you enter (such as name, society, phone, email and message) so we can respond. We do not knowingly collect sensitive personal data.'],
      ['How we use it', 'To reply to enquiries, process membership requests, escalate civic issues and improve the website. We do not sell personal information.'],
      ['Cookies & Google AdSense', 'This website displays advertisements served by Google AdSense. Google, as a third-party vendor, uses cookies (including the DoubleClick cookie) to serve ads based on a user’s visits to this and other websites. You can opt out of personalised advertising by visiting Google Ads Settings (adssettings.google.com) or aboutads.info. Where you choose “essential only” in our cookie banner, we request non-personalised ads.'],
      ['Analytics & logs', 'Standard server logs (IP address, browser type, pages visited) may be kept for security and diagnostics.'],
      ['Third-party links', 'Our Resources pages link to government and external websites. We are not responsible for their content or privacy practices.'],
      ['Your choices', 'You may ask us to correct or delete the information you submitted by writing to the email on the Contact page.'],
      ['Children', 'The website is intended for adults. We do not knowingly collect information from children.'],
    ],
  },
  terms: {
    title: 'Terms of Use',
    updated: '14 October 2026',
    sections: [
      ['Acceptance', 'By using this website you agree to these terms. If you do not agree, please do not use the website.'],
      ['Purpose', 'The site provides information about the federation, member societies, events and resources. It does not create a lawyer–client or any professional relationship.'],
      ['User content', 'Information you submit through forms must be accurate and lawful. We may decline or remove submissions that are abusive, misleading or unlawful.'],
      ['Advertisements', 'Ads displayed are served by third parties such as Google. Inclusion of an ad is not an endorsement by the federation.'],
      ['Intellectual property', 'Site design, logo and original text belong to the federation unless stated otherwise. Do not copy without permission.'],
      ['Changes', 'We may update the website or these terms at any time.'],
    ],
  },
  disclaimer: {
    title: 'Disclaimer',
    updated: '14 October 2026',
    sections: [
      ['General information only', 'Content on this website, including FAQs and checklists, is general information and not legal, financial or professional advice. Laws and procedures change; consult a qualified professional for your situation.'],
      ['Accuracy', 'We try to keep information current but make no warranty about completeness or accuracy.'],
      ['External links & ads', 'We are not responsible for external websites or advertisements shown on this site.'],
    ],
  },
};
