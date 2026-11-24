import { useEffect, useRef, useState } from 'react';

export const fmtDate = (iso, opts = { day: '2-digit', month: 'short', year: 'numeric' }) =>
  new Date(iso).toLocaleDateString('en-IN', opts);

export const daysSince = (iso) => Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);

export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | Chikhli–Moshi Federation` : 'Chikhli–Moshi Federation';
    if (description) {
      let m = document.querySelector('meta[name="description"]');
      if (!m) {
        m = document.createElement('meta');
        m.name = 'description';
        document.head.appendChild(m);
      }
      m.content = description;
    }
  }, [title, description]);
}

export function useInView(options = { threshold: 0.3 }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return undefined;
    if (!('IntersectionObserver' in window)) { setSeen(true); return undefined; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen]);
  return [ref, seen];
}

export function useCountUp(target, active, duration = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return undefined;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setV(target); return undefined; }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return v;
}

/** Posts a form to VITE_FORM_ENDPOINT (e.g. Formspree). Without it, runs in demo mode. */
const API_ROUTES = { issue: '/api/public/issues', membership: '/api/public/membership' };

export async function submitForm(type, values) {
  if (API_ROUTES[type]) {
    let res = null;
    try { res = await fetch(API_ROUTES[type], { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) }); } catch { /* server not reachable: fall through */ }
    const ct = res?.headers.get('content-type') || '';
    if (res && ct.includes('application/json')) {
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Submission failed. Please try again.');
      return { id: j.reference, demo: false };
    }
  }
  const id = `CMF-${type.slice(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT;
  if (endpoint) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ reference: id, type, ...values }),
    });
    if (!res.ok) throw new Error('Submission failed. Please try again.');
  } else {
    await new Promise((r) => setTimeout(r, 700));
    // eslint-disable-next-line no-console
    console.info('[CMF demo form – set VITE_FORM_ENDPOINT to send for real]', id, values);
  }
  return { id, demo: !endpoint };
}

/** Builds and downloads an .ics file for an event. */
export function downloadIcs(ev) {
  const stamp = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const start = new Date(ev.date);
  const end = new Date(start.getTime() + (ev.durationHours || 2) * 3600000);
  const esc = (s) => String(s).replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n');
  const body = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Chikhli-Moshi Federation//EN', 'BEGIN:VEVENT',
    `UID:${ev.id}@chikhlimoshifederation`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(ev.title)}`, `LOCATION:${esc(ev.venue)}`, `DESCRIPTION:${esc(ev.summary)}`, 'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([body], { type: 'text/calendar' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: `${ev.id}.ics` });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
