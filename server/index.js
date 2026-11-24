// Chikhli–Moshi Federation API: JSON-file store, admin auth, uploads, public feeds.
// Run: npm run server   (default http://localhost:4000)
import express from 'express';
import multer from 'multer';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as seed from '../src/data/content.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ---- tiny .env loader (no dependency) ----
try {
  for (const line of fs.readFileSync(path.join(ROOT, '.env'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch { /* no .env */ }

const PORT = Number(process.env.PORT || 4000);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const SECRET = process.env.ADMIN_SECRET || 'dev-secret-change-me';
if (!process.env.ADMIN_PASSWORD) console.warn('\n[!] ADMIN_PASSWORD not set. Using the default "admin123". Set it in .env before going live.\n');
if (!process.env.ADMIN_SECRET) console.warn('[!] ADMIN_SECRET not set. Set a long random string in .env before going live.\n');

const DATA_DIR = path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'db.json');
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const uid = () => crypto.randomBytes(6).toString('hex');
const nowIso = () => new Date().toISOString();

// ---- schema: allowed fields per collection (s string, n number, b bool, a string[], d date/datetime) ----
const COLS = {
  societies: { f: { name: 's', area: 's', type: 's', flats: 'n', since: 'n', chairman: 's', contact: 's', address: 's', amenities: 'a', featured: 'b' }, req: ['name'] },
  notices: { f: { title: 's', category: 's', body: 's', date: 'd', status: 's', publishAt: 'd', file: 's', pinned: 'b' }, req: ['title'] },
  events: { f: { title: 's', tag: 's', summary: 's', venue: 's', date: 'd', durationHours: 'n', status: 's', publishAt: 'd' }, req: ['title', 'date'] },
  issues: { f: { name: 's', phone: 's', email: 's', society: 's', category: 's', priority: 's', location: 's', details: 's', status: 's', adminNote: 's' }, req: ['name', 'details'] },
  committee: { f: { designation: 's', role: 's', personName: 's', initials: 's', phone: 's', email: 's', bio: 's', photo: 's', order: 'n' }, req: ['designation'] },
  gallery: { f: { album: 's', caption: 's', src: 's', ratio: 'n', order: 'n' }, req: ['caption'] },
  members: { f: { name: 's', society: 's', designation: 's', tier: 's', status: 's', fee: 'n', paymentStatus: 's', startDate: 'd', expiryDate: 'd', phone: 's', email: 's', area: 's', flats: 'n', regNo: 's', notes: 's', source: 's' }, req: ['name'] },
};
const ENUMS = {
  'notices.status': ['draft', 'published'], 'events.status': ['draft', 'published'],
  'issues.status': ['new', 'read', 'in_progress', 'fixed'], 'issues.priority': ['Low', 'Medium', 'High', 'Emergency (also call 112)'],
  'members.status': ['Pending', 'Active', 'Expired', 'Rejected'], 'members.paymentStatus': ['Paid', 'Unpaid', 'Waived'],
};

function coerce(type, v) {
  if (type === 's') return String(v ?? '').trim().slice(0, 5000);
  if (type === 'n') { if (v === '' || v === null || v === undefined) return null; const n = Number(v); return Number.isFinite(n) ? n : null; }
  if (type === 'b') return v === true || v === 'true';
  if (type === 'a') return (Array.isArray(v) ? v : String(v ?? '').split(',')).map((x) => String(x).trim()).filter(Boolean).slice(0, 30);
  if (type === 'd') { const s = String(v ?? '').trim(); if (!s) return ''; return Number.isNaN(Date.parse(s)) ? null : s; }
  return v;
}
function clean(col, body, partial) {
  const spec = COLS[col], out = {};
  for (const [k, t] of Object.entries(spec.f)) {
    if (partial && !(k in body)) continue;
    const v = coerce(t, body[k]);
    if (v === null && t === 'd') throw httpErr(400, `Invalid date for "${k}"`);
    const en = ENUMS[`${col}.${k}`];
    if (en && v !== '' && !en.includes(v)) throw httpErr(400, `Invalid value for "${k}"`);
    out[k] = v;
  }
  if ('active' in body) out.active = body.active === true || body.active === 'true';
  if (!partial) for (const k of spec.req) if (out[k] === '' || out[k] === null || out[k] === undefined) throw httpErr(400, `"${k}" is required`);
  return out;
}
function httpErr(status, message) { const e = new Error(message); e.status = status; return e; }

// ---- store ----
function makeSeed() {
  const t = nowIso();
  const base = (o) => ({ id: uid(), active: true, createdAt: t, updatedAt: t, ...o });
  const d = {
    societies: seed.societies.map((s) => base({ name: s.name, area: s.area, type: s.type, flats: s.flats, since: s.since, chairman: '', contact: s.contact, address: '', amenities: s.amenities, featured: s.featured })),
    notices: seed.notices.map((n) => base({ title: n.title, category: n.category, body: n.body, date: n.date, status: 'published', publishAt: `${n.date}T00:00:00+05:30`, file: '', pinned: false })),
    events: seed.events.map((e) => base({ title: e.title, tag: e.tag, summary: e.summary, venue: e.venue, date: e.date, durationHours: e.durationHours || 2, status: 'published', publishAt: '2026-01-01T00:00:00+05:30' })),
    committee: seed.committee.map((m, i) => base({ designation: m.name, role: m.role, personName: '', initials: m.initials, phone: m.phone, email: m.email, bio: m.bio, photo: '', order: i + 1 })),
    gallery: seed.gallery.map((g, i) => base({ album: g.album, caption: g.caption, src: '', ratio: Number(g.ratio.toFixed(3)), order: i + 1 })),
    issues: [
      ['Sample resident A', 'Water supply', 'High', 'Sai Srushti Housing Society', 'No water in the morning slot for three days.', 'new'],
      ['Sample resident B', 'Roads & potholes', 'Medium', 'Ganga Heights Co-op. Society', 'Large pothole near the society gate.', 'read'],
      ['Sample resident C', 'Street-lights', 'Low', 'Orchid Park Township', 'Two street-lights dark on the internal road.', 'in_progress'],
      ['Sample resident D', 'Garbage & sanitation', 'Medium', 'Shivneri Residency', 'Garbage not collected for two days.', 'fixed'],
    ].map(([name, category, priority, society, details, status], i) => base({ ref: `CMF-ISS-S${i + 1}`, name, phone: '+91 98XXX 00000', email: '', society, category, priority, location: 'Near main gate', details, status, adminNote: '', source: 'sample' })),
    members: seed.societies.slice(0, 8).map((s, i) => base({
      name: `Contact for ${s.name}`, society: s.name, designation: 'Chairperson', tier: 'Society Member', status: i === 7 ? 'Pending' : 'Active',
      fee: 2500, paymentStatus: i % 3 === 2 ? 'Unpaid' : 'Paid', startDate: '2026-01-15', expiryDate: i === 1 ? '2026-11-20' : '2027-01-14',
      phone: s.contact, email: '', area: s.area, flats: s.flats, regNo: '', notes: '', source: 'sample', active: i !== 7,
    })),
  };
  return d;
}
let db;
function loadDb() {
  if (fs.existsSync(DB_FILE)) return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const d = makeSeed(); saveDb(d); return d;
}
function saveDb(d = db) {
  const tmp = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(d, null, 2));
  fs.renameSync(tmp, DB_FILE);
}
db = loadDb();

// ---- auth ----
const b64 = (s) => Buffer.from(s).toString('base64url');
const hmac = (s) => crypto.createHmac('sha256', SECRET).update(s).digest('base64url');
const makeToken = () => { const p = b64(JSON.stringify({ exp: Date.now() + 12 * 3600e3 })); return `${p}.${hmac(p)}`; };
function verifyToken(tok = '') {
  const [p, sig] = tok.split('.');
  if (!p || !sig) return false;
  const good = hmac(p);
  if (sig.length !== good.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good))) return false;
  try { return JSON.parse(Buffer.from(p, 'base64url').toString()).exp > Date.now(); } catch { return false; }
}
const sha = (s) => crypto.createHash('sha256').update(String(s)).digest();
const requireAdmin = (req, res, next) => {
  if (verifyToken((req.headers.authorization || '').replace(/^Bearer\s+/i, ''))) return next();
  res.status(401).json({ error: 'Please sign in again.' });
};
const hits = new Map();
function limit(name, max, windowMs) {
  return (req, res, next) => {
    const k = `${name}:${req.ip}`, t = Date.now();
    const arr = (hits.get(k) || []).filter((x) => t - x < windowMs);
    if (arr.length >= max) return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
    arr.push(t); hits.set(k, arr); next();
  };
}

// ---- helpers ----
const isLive = (r) => r.active !== false && r.status === 'published' && new Date(r.publishAt || 0) <= new Date();
const PUBLIC = {
  societies: (r) => r.active !== false,
  committee: (r) => r.active !== false,
  gallery: (r) => r.active !== false,
  notices: isLive,
  events: isLive,
};
const SORT = {
  societies: (a, b) => a.name.localeCompare(b.name),
  committee: (a, b) => (a.order ?? 999) - (b.order ?? 999),
  gallery: (a, b) => (a.order ?? 999) - (b.order ?? 999),
  notices: (a, b) => new Date(b.date) - new Date(a.date),
  events: (a, b) => new Date(a.date) - new Date(b.date),
};
function stats() {
  const by = (c) => ({ total: db[c].length, active: db[c].filter((r) => r.active !== false).length, inactive: db[c].filter((r) => r.active === false).length });
  const now = new Date(), soon = new Date(Date.now() + 30 * 864e5);
  const issueBy = (s) => db.issues.filter((i) => i.status === s).length;
  return {
    societies: by('societies'), committee: by('committee'), gallery: by('gallery'), members: by('members'), issues: by('issues'), notices: by('notices'), events: by('events'),
    noticeState: { live: db.notices.filter(isLive).length, scheduled: db.notices.filter((n) => n.active !== false && n.status === 'published' && new Date(n.publishAt) > now).length, draft: db.notices.filter((n) => n.status === 'draft').length },
    eventState: { upcoming: db.events.filter((e) => new Date(e.date) >= now).length, past: db.events.filter((e) => new Date(e.date) < now).length, draft: db.events.filter((e) => e.status === 'draft').length },
    issueStatus: { new: issueBy('new'), read: issueBy('read'), in_progress: issueBy('in_progress'), fixed: issueBy('fixed') },
    memberStatus: { Active: db.members.filter((m) => m.status === 'Active').length, Pending: db.members.filter((m) => m.status === 'Pending').length, Expired: db.members.filter((m) => m.status === 'Expired').length },
    expiring: db.members.filter((m) => m.status === 'Active' && m.expiryDate && new Date(m.expiryDate) <= soon).sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)).slice(0, 8),
    recentIssues: [...db.issues].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6),
    totalFlats: db.societies.filter((s) => s.active !== false).reduce((n, s) => n + (s.flats || 0), 0),
  };
}

// ---- app ----
const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '100kb' }));
app.use('/uploads', express.static(UPLOAD_DIR, { setHeaders: (res) => res.setHeader('X-Content-Type-Options', 'nosniff') }));

// public reads
app.get('/api/public/stats', (req, res) => {
  res.json({ societies: db.societies.filter(PUBLIC.societies).length, families: db.societies.filter(PUBLIC.societies).reduce((n, s) => n + (s.flats || 0), 0), resolved: db.issues.filter((i) => i.status === 'fixed').length, years: Math.max(1, new Date().getFullYear() - 2018) });
});
app.get('/api/public/:col', (req, res, next) => {
  const f = PUBLIC[req.params.col];
  if (!f) return next();
  res.json(db[req.params.col].filter(f).sort(SORT[req.params.col]));
});
// public submissions
app.post('/api/public/issues', limit('issue', 8, 10 * 60e3), (req, res, next) => {
  try {
    if (req.body.website) return res.json({ reference: 'CMF-ISS-0' }); // honeypot
    const rec = clean('issues', { ...req.body, status: 'new' }, false);
    if (!rec.priority) rec.priority = 'Medium';
    const t = nowIso(), ref = `CMF-ISS-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    db.issues.unshift({ id: uid(), ref, active: true, createdAt: t, updatedAt: t, source: 'website', ...rec, status: 'new', adminNote: '' });
    saveDb(); res.json({ reference: ref });
  } catch (e) { next(e); }
});
app.post('/api/public/membership', limit('member', 8, 10 * 60e3), (req, res, next) => {
  try {
    if (req.body.website) return res.json({ reference: 'CMF-MEM-0' });
    const b = req.body;
    const rec = clean('members', { name: b.contactName, society: b.society, designation: b.designation, tier: b.membership, phone: b.phone, email: b.email, area: b.area, flats: b.flats, regNo: b.regNo, notes: b.note, status: 'Pending', paymentStatus: 'Unpaid', source: 'website' }, false);
    const t = nowIso(), ref = `CMF-MEM-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    db.members.unshift({ id: uid(), ref, createdAt: t, updatedAt: t, fee: null, startDate: '', expiryDate: '', ...rec, active: false });
    saveDb(); res.json({ reference: ref });
  } catch (e) { next(e); }
});

// admin
app.post('/api/admin/login', limit('login', 10, 10 * 60e3), (req, res) => {
  if (crypto.timingSafeEqual(sha(req.body?.password ?? ''), sha(ADMIN_PASSWORD))) return res.json({ token: makeToken() });
  res.status(401).json({ error: 'Wrong password.' });
});
const MIME = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif', 'application/pdf': '.pdf' };
const upload = multer({
  storage: multer.diskStorage({ destination: UPLOAD_DIR, filename: (req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(5).toString('hex')}${MIME[file.mimetype]}`) }),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => (MIME[file.mimetype] ? cb(null, true) : cb(httpErr(400, 'Only JPG, PNG, WebP, GIF or PDF files are allowed.'))),
});
app.post('/api/admin/upload', requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file received.' });
  res.json({ url: `/uploads/${req.file.filename}`, name: req.file.originalname });
});
app.get('/api/admin/stats', requireAdmin, (req, res) => res.json(stats()));
const colGuard = (req, res, next) => (COLS[req.params.col] ? next() : res.status(404).json({ error: 'Unknown collection.' }));
app.get('/api/admin/:col', requireAdmin, colGuard, (req, res) => res.json([...db[req.params.col]].sort((a, b) => b.createdAt.localeCompare(a.createdAt))));
app.post('/api/admin/:col', requireAdmin, colGuard, (req, res, next) => {
  try {
    const col = req.params.col, rec = clean(col, req.body, false), t = nowIso();
    if (col === 'issues') { rec.status ||= 'new'; rec.ref = `CMF-ISS-${Date.now().toString(36).toUpperCase().slice(-6)}`; }
    if ((col === 'notices' || col === 'events') && !rec.publishAt) rec.publishAt = t;
    if (col === 'notices' && !rec.date) rec.date = t.slice(0, 10);
    const row = { id: uid(), active: true, createdAt: t, updatedAt: t, ...rec };
    db[col].unshift(row); saveDb(); res.status(201).json(row);
  } catch (e) { next(e); }
});
const update = (req, res, next) => {
  try {
    const list = db[req.params.col], i = list.findIndex((r) => r.id === req.params.id);
    if (i < 0) return res.status(404).json({ error: 'Record not found.' });
    list[i] = { ...list[i], ...clean(req.params.col, req.body, true), updatedAt: nowIso() };
    saveDb(); res.json(list[i]);
  } catch (e) { next(e); }
};
app.put('/api/admin/:col/:id', requireAdmin, colGuard, update);
app.patch('/api/admin/:col/:id', requireAdmin, colGuard, update);
app.delete('/api/admin/:col/:id', requireAdmin, colGuard, (req, res) => {
  const list = db[req.params.col], i = list.findIndex((r) => r.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: 'Record not found.' });
  list.splice(i, 1); saveDb(); res.json({ ok: true });
});
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }));

// production: serve the built site
const DIST = path.join(ROOT, 'dist');
if (fs.existsSync(DIST)) {
  app.use(express.static(DIST));
  app.use((req, res, next) => (req.method === 'GET' ? res.sendFile(path.join(DIST, 'index.html')) : next()));
}
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err instanceof multer.MulterError) return res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'File is larger than 8 MB.' : err.message });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid request.' });
  if (!err.status) console.error(err);
  res.status(err.status || 500).json({ error: err.status ? err.message : 'Something went wrong.' });
});
app.listen(PORT, () => console.log(`CMF API running on http://localhost:${PORT}  (admin: /admin)`));
