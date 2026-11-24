import { useEffect, useState } from 'react';
import * as seed from './data/content';

// Static sample data used only when the API is not reachable (e.g. the site is hosted without the server).
const FALLBACK = {
  societies: seed.societies,
  notices: seed.notices,
  events: seed.events,
  gallery: seed.gallery,
  committee: seed.committee.map((m, i) => ({ id: `c${i}`, designation: m.name, role: m.role, personName: '', initials: m.initials, phone: m.phone, email: m.email, bio: m.bio, photo: '' })),
};
const cache = {};

async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('bad status');
  return res.json(); // throws if the host returned index.html instead of JSON
}

/** Published/active records from the API. Shows cached data first, then refreshes. */
export function useCollection(name) {
  const [data, setData] = useState(cache[name] ?? null);
  useEffect(() => {
    let off = false;
    getJson(`/api/public/${name}`)
      .then((d) => { cache[name] = d; if (!off) setData(d); })
      .catch(() => { if (!off && !cache[name]) setData(FALLBACK[name] || []); });
    return () => { off = true; };
  }, [name]);
  return { data: data ?? [], loading: data === null };
}

export function usePublicStats() {
  const [s, setS] = useState(null);
  useEffect(() => {
    let off = false;
    getJson('/api/public/stats').then((d) => !off && setS(d)).catch(() => {});
    return () => { off = true; };
  }, []);
  return s;
}
