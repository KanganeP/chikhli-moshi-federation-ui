import { useCallback, useEffect, useState } from 'react';

const KEY = 'cmf-admin-token';
export const getToken = () => { try { return localStorage.getItem(KEY) || ''; } catch { return ''; } };
export const setToken = (t) => { try { if (t) localStorage.setItem(KEY, t); else localStorage.removeItem(KEY); } catch { /* ignore */ } };

async function call(method, url, body) {
  const isForm = body instanceof FormData;
  let res;
  try {
    res = await fetch(url, {
      method,
      headers: { ...(body && !isForm ? { 'Content-Type': 'application/json' } : {}), Authorization: `Bearer ${getToken()}` },
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new Error('Cannot reach the server. Start it with "npm run server".');
  }
  let data = null;
  try { data = await res.json(); } catch { /* not json */ }
  if (res.status === 401 && url !== '/api/admin/login') { setToken(''); window.dispatchEvent(new Event('cmf-auth-lost')); }
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  if (data === null) throw new Error('The server did not return data. Is the API running?');
  return data;
}

export const admin = {
  login: (password) => call('POST', '/api/admin/login', { password }),
  list: (c) => call('GET', `/api/admin/${c}`),
  create: (c, d) => call('POST', `/api/admin/${c}`, d),
  update: (c, id, d) => call('PUT', `/api/admin/${c}/${id}`, d),
  remove: (c, id) => call('DELETE', `/api/admin/${c}/${id}`),
  stats: () => call('GET', '/api/admin/stats'),
  upload: (file) => { const f = new FormData(); f.append('file', file); return call('POST', '/api/admin/upload', f); },
};

export function useResource(col) {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const reload = useCallback(() => {
    setError('');
    return admin.list(col).then(setRows).catch((e) => { setError(e.message); setRows((r) => r ?? []); });
  }, [col]);
  useEffect(() => { setRows(null); reload(); }, [reload]);
  const create = async (d) => { const r = await admin.create(col, d); setRows((p) => [r, ...(p || [])]); return r; };
  const update = async (id, d) => { const r = await admin.update(col, id, d); setRows((p) => p.map((x) => (x.id === id ? r : x))); return r; };
  const remove = async (id) => { await admin.remove(col, id); setRows((p) => p.filter((x) => x.id !== id)); };
  return { rows, error, reload, create, update, remove };
}

// ---- date helpers ----
const p2 = (n) => String(n).padStart(2, '0');
export const toLocalInput = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}T${p2(d.getHours())}:${p2(d.getMinutes())}`;
};
export const fromLocalInput = (s) => (s ? new Date(s).toISOString() : '');
export const fmtDT = (iso) => (iso ? new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—');
export const fmtD = (iso) => (iso ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
export const todayStr = () => new Date().toISOString().slice(0, 10);
export const addYear = (dateStr) => { const d = new Date(dateStr || Date.now()); d.setFullYear(d.getFullYear() + 1); return d.toISOString().slice(0, 10); };

export function publishState(r) {
  if (r.active === false) return { label: 'Inactive', color: 'default' };
  if (r.status !== 'published') return { label: 'Draft', color: 'warning' };
  if (new Date(r.publishAt) > new Date()) return { label: 'Scheduled', color: 'info' };
  return { label: 'Live', color: 'success' };
}
