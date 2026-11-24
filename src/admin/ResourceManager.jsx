import { useMemo, useState } from 'react';
import {
  Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, MenuItem, Paper, Snackbar,
  Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip, Typography,
} from '@mui/material';
import { AddIcon, EditIcon, DeleteIcon, SearchIcon, DownloadIcon, RefreshIcon } from '../icons';
import { useResource } from './adminApi';
import FormDialog, { ConfirmDialog } from './FormDialog';

export function CountChips({ rows, mode, setMode }) {
  const total = rows.length, active = rows.filter((r) => r.active !== false).length;
  const items = [['all', `Total ${total}`, 'primary'], ['active', `Active ${active}`, 'success'], ['inactive', `Inactive ${total - active}`, 'default']];
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {items.map(([k, label, color]) => (
        <Chip key={k} label={label} color={mode === k ? color : 'default'} variant={mode === k ? 'filled' : 'outlined'} onClick={() => setMode(k)} sx={{ fontWeight: 700 }} />
      ))}
    </Stack>
  );
}

function toCsv(rows, keys) {
  const esc = (v) => `"${String(Array.isArray(v) ? v.join('; ') : v ?? '').replace(/"/g, '""')}"`;
  return [keys.join(','), ...rows.map((r) => keys.map((k) => esc(r[k])).join(','))].join('\r\n');
}

export default function ResourceManager({ cfg }) {
  const { rows, error, reload, create, update, remove } = useResource(cfg.name);
  const [q, setQ] = useState('');
  const [mode, setMode] = useState('all');
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(10);
  const [edit, setEdit] = useState(null); // { row } | { row: null }
  const [del, setDel] = useState(null);
  const [view, setView] = useState(null);
  const [snack, setSnack] = useState({ msg: '', sev: 'success' });
  const say = (msg, sev = 'success') => setSnack({ msg, sev });

  const list = rows || [];
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return list.filter((r) => {
      if (mode === 'active' && r.active === false) return false;
      if (mode === 'inactive' && r.active !== false) return false;
      for (const f of cfg.filters || []) { const v = filters[f.key]; if (v && f.get(r) !== v) return false; }
      return !t || (cfg.searchKeys || []).some((k) => String(r[k] ?? '').toLowerCase().includes(t));
    });
  }, [list, q, mode, filters, cfg]);
  const pageRows = shown.slice(page * rpp, page * rpp + rpp);

  const act = async (fn, ok) => { try { await fn(); say(ok); } catch (e) { say(e.message, 'error'); } };
  const patch = (row, data, ok) => act(() => update(row.id, data), ok);
  const actions = (row) => (cfg.rowActions ? cfg.rowActions(row).filter(Boolean) : []);

  const exportCsv = () => {
    const keys = cfg.exportKeys || cfg.fields.map((f) => f.name);
    const url = URL.createObjectURL(new Blob([toCsv(shown, keys)], { type: 'text/csv' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: `${cfg.name}.csv` });
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2} sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h4" component="h1">{cfg.title}</Typography>
          {cfg.subtitle && <Typography color="text.secondary">{cfg.subtitle}</Typography>}
        </Box>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Reload"><IconButton onClick={reload} aria-label="Reload"><RefreshIcon /></IconButton></Tooltip>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportCsv} disabled={!shown.length}>Export CSV</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setEdit({ row: null })}>Add {cfg.singular}</Button>
        </Stack>
      </Stack>

      <Paper sx={{ p: { xs: 1.5, sm: 2.5 } }}>
        <Stack spacing={2}>
          <CountChips rows={list} mode={mode} setMode={(m) => { setMode(m); setPage(0); }} />
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
            <TextField size="small" value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} placeholder={`Search ${cfg.title.toLowerCase()}…`} aria-label="Search" sx={{ flex: 1, minWidth: 0 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
            {(cfg.filters || []).map((f) => (
              <TextField key={f.key} select size="small" label={f.label} value={filters[f.key] || ''} onChange={(e) => { setFilters((p) => ({ ...p, [f.key]: e.target.value })); setPage(0); }} sx={{ minWidth: 150 }}>
                <MenuItem value=""><em>All</em></MenuItem>
                {f.options.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
              </TextField>
            ))}
          </Stack>

          {error && <Alert severity="error" action={<Button color="inherit" size="small" onClick={reload}>Retry</Button>}>{error}</Alert>}

          {rows === null ? (
            <Box sx={{ py: 6, display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>
          ) : (
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 560 }}>
                <TableHead>
                  <TableRow>
                    {cfg.columns.map((c) => <TableCell key={c.key} align={c.align} sx={{ fontWeight: 700, whiteSpace: 'nowrap', display: c.hideXs ? { xs: 'none', md: 'table-cell' } : undefined }}>{c.label}</TableCell>)}
                    <TableCell sx={{ fontWeight: 700 }}>Active</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pageRows.map((r) => (
                    <TableRow key={r.id} hover sx={{ opacity: r.active === false ? 0.6 : 1, cursor: cfg.detail ? 'pointer' : 'default' }} onClick={cfg.detail ? () => setView(r.id) : undefined}>
                      {cfg.columns.map((c) => (
                        <TableCell key={c.key} align={c.align} sx={{ display: c.hideXs ? { xs: 'none', md: 'table-cell' } : undefined, maxWidth: 280 }}>
                          {c.render ? c.render(r) : (r[c.key] ?? '—')}
                        </TableCell>
                      ))}
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Switch size="small" checked={r.active !== false} onChange={(e) => patch(r, { active: e.target.checked }, e.target.checked ? 'Activated' : 'Deactivated')} inputProps={{ 'aria-label': `Toggle active for row` }} />
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
                        {actions(r).map((a) => (
                          <Tooltip key={a.label} title={a.label}><IconButton size="small" aria-label={a.label} onClick={() => patch(r, a.patch, a.done)}>{a.icon}</IconButton></Tooltip>
                        ))}
                        <Tooltip title="Edit"><IconButton size="small" aria-label="Edit" onClick={() => setEdit({ row: r })}><EditIcon fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Delete"><IconButton size="small" color="error" aria-label="Delete" onClick={() => setDel(r)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!pageRows.length && (
                    <TableRow><TableCell colSpan={cfg.columns.length + 2} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                      {list.length ? 'No records match these filters.' : `No ${cfg.title.toLowerCase()} yet. Use "Add ${cfg.singular}" to create the first one.`}
                    </TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <TablePagination component="div" count={shown.length} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={rpp} onRowsPerPageChange={(e) => { setRpp(+e.target.value); setPage(0); }} rowsPerPageOptions={[10, 25, 50]} />
        </Stack>
      </Paper>

      {edit && (
        <FormDialog
          open key={edit.row?.id || 'new'} title={edit.row ? `Edit ${cfg.singular}` : `Add ${cfg.singular}`}
          fields={cfg.fields} row={edit.row} defaults={cfg.defaults} activeLabel={cfg.activeLabel}
          onClose={() => setEdit(null)}
          onSave={async (data) => { if (edit.row) await update(edit.row.id, data); else await create(data); say(edit.row ? 'Saved' : `${cfg.singular[0].toUpperCase()}${cfg.singular.slice(1)} added`); setEdit(null); }}
        />
      )}
      <ConfirmDialog open={Boolean(del)} title={`Delete this ${cfg.singular}?`} text="This permanently removes the record. To hide it from the website without deleting, switch it to inactive instead." onClose={() => setDel(null)}
        onConfirm={async () => { await act(() => remove(del.id), 'Deleted'); setDel(null); }} />

      {view && (() => {
        const row = list.find((x) => x.id === view);
        if (!row) return null;
        return (
          <Dialog open onClose={() => setView(null)} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 800 }}>{cfg.detailTitle ? cfg.detailTitle(row) : cfg.title}</DialogTitle>
            <DialogContent dividers>{cfg.detail(row)}</DialogContent>
            <DialogActions sx={{ p: 2, flexWrap: 'wrap', gap: 1 }}>
              {actions(row).map((a) => <Button key={a.label} variant="outlined" startIcon={a.icon} onClick={() => patch(row, a.patch, a.done)}>{a.label}</Button>)}
              <Box sx={{ flex: 1 }} />
              <Button onClick={() => { setView(null); setEdit({ row }); }}>Edit</Button>
              <Button variant="contained" onClick={() => setView(null)}>Close</Button>
            </DialogActions>
          </Dialog>
        );
      })()}
      <Snackbar open={Boolean(snack.msg)} autoHideDuration={3000} onClose={() => setSnack((s) => ({ ...s, msg: '' }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snack.sev} variant="filled" onClose={() => setSnack((s) => ({ ...s, msg: '' }))}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
