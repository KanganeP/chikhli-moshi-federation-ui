import { useRef, useState } from 'react';
import { Alert, Box, Button, Card, CardActions, CardContent, Chip, CircularProgress, IconButton, Paper, Snackbar, Stack, Switch, Typography, Tooltip } from '@mui/material';
import { AddIcon, CloudUploadIcon, DeleteIcon, EditIcon, RefreshIcon, ImageIcon } from '../icons';
import { admin, useResource } from './adminApi';
import FormDialog, { ConfirmDialog } from './FormDialog';
import { CountChips } from './ResourceManager';

const ALBUMS = ['Events', 'Community', 'Civic', 'Safety'];
const FIELDS = [
  { name: 'src', label: 'Photo', type: 'image', required: true },
  { name: 'caption', label: 'Caption', required: true, full: true },
  { name: 'album', label: 'Album', type: 'select', options: ALBUMS },
  { name: 'ratio', label: 'Shape on website', type: 'select', options: [{ value: 1.333, label: 'Landscape (4:3)' }, { value: 1, label: 'Square' }, { value: 0.75, label: 'Portrait (3:4)' }] },
  { name: 'order', label: 'Order (lower shows first)', type: 'number' },
];

export default function GalleryAdmin() {
  const { rows, error, reload, create, update, remove } = useResource('gallery');
  const [mode, setMode] = useState('all');
  const [album, setAlbum] = useState('');
  const [edit, setEdit] = useState(null);
  const [del, setDel] = useState(null);
  const [busy, setBusy] = useState(false);
  const [snack, setSnack] = useState({ msg: '', sev: 'success' });
  const fileRef = useRef(null);
  const say = (msg, sev = 'success') => setSnack({ msg, sev });
  const list = rows || [];
  const shown = list.filter((r) => (mode === 'all' || (mode === 'active') === (r.active !== false)) && (!album || r.album === album))
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  const bulk = async (files) => {
    setBusy(true);
    let ok = 0;
    for (const f of files) {
      try {
        const up = await admin.upload(f);
        await create({ src: up.url, caption: f.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '), album: album || 'Community', ratio: 1.333, order: 999, active: true });
        ok++;
      } catch (e) { say(`${f.name}: ${e.message}`, 'error'); }
    }
    setBusy(false);
    if (ok) say(`${ok} photo${ok > 1 ? 's' : ''} uploaded. Edit captions as needed.`);
  };

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2} sx={{ mb: 2 }}>
        <Box><Typography variant="h4" component="h1">Gallery</Typography><Typography color="text.secondary">Photos shown on the Gallery page. Inactive photos are hidden.</Typography></Box>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <IconButton onClick={reload} aria-label="Reload"><RefreshIcon /></IconButton>
          <Button variant="outlined" component="label" disabled={busy} startIcon={busy ? <CircularProgress size={16} /> : <CloudUploadIcon />}>
            Upload photos
            <input ref={fileRef} hidden multiple type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => { const fs = [...e.target.files]; e.target.value = ''; if (fs.length) bulk(fs); }} />
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setEdit({ row: null })}>Add with details</Button>
        </Stack>
      </Stack>
      <Paper sx={{ p: { xs: 1.5, sm: 2.5 } }}>
        <Stack spacing={2}>
          <CountChips rows={list} mode={mode} setMode={setMode} />
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label="All albums" color={album === '' ? 'primary' : 'default'} variant={album === '' ? 'filled' : 'outlined'} onClick={() => setAlbum('')} />
            {ALBUMS.map((a) => <Chip key={a} label={a} color={album === a ? 'primary' : 'default'} variant={album === a ? 'filled' : 'outlined'} onClick={() => setAlbum(a)} />)}
          </Stack>
          {error && <Alert severity="error">{error}</Alert>}
          {rows === null ? <Box sx={{ py: 6, display: 'grid', placeItems: 'center' }}><CircularProgress /></Box> : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0,1fr))', md: 'repeat(3, minmax(0,1fr))', lg: 'repeat(4, minmax(0,1fr))' }, gap: 2 }}>
              {shown.map((g) => (
                <Card key={g.id} variant="outlined" sx={{ opacity: g.active === false ? 0.6 : 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ aspectRatio: '4 / 3', bgcolor: 'action.hover', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
                    {g.src ? <img src={g.src} alt={g.caption} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Stack alignItems="center" sx={{ color: 'text.secondary' }}><ImageIcon /><Typography variant="caption">No photo yet</Typography></Stack>}
                  </Box>
                  <CardContent sx={{ py: 1, flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, lineHeight: 1.25 }}>{g.caption}</Typography>
                    <Chip size="small" label={g.album || 'No album'} sx={{ mt: 0.5 }} />
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', pt: 0 }}>
                    <Tooltip title={g.active === false ? 'Inactive' : 'Active'}><Switch size="small" checked={g.active !== false} onChange={(e) => update(g.id, { active: e.target.checked }).then(() => say(e.target.checked ? 'Activated' : 'Deactivated')).catch((x) => say(x.message, 'error'))} inputProps={{ 'aria-label': 'Toggle active' }} /></Tooltip>
                    <Box>
                      <IconButton size="small" aria-label="Edit" onClick={() => setEdit({ row: g })}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" color="error" aria-label="Delete" onClick={() => setDel(g)}><DeleteIcon fontSize="small" /></IconButton>
                    </Box>
                  </CardActions>
                </Card>
              ))}
              {!shown.length && <Typography color="text.secondary" sx={{ gridColumn: '1 / -1', py: 5, textAlign: 'center' }}>No photos here yet. Use "Upload photos" to add several at once.</Typography>}
            </Box>
          )}
        </Stack>
      </Paper>
      {edit && (
        <FormDialog open key={edit.row?.id || 'new'} title={edit.row ? 'Edit photo' : 'Add photo'} fields={FIELDS} row={edit.row} defaults={{ album: 'Community', ratio: 1.333, order: 999 }} activeLabel="Active (shown in gallery)"
          onClose={() => setEdit(null)} onSave={async (d) => { if (edit.row) await update(edit.row.id, d); else await create(d); say('Saved'); setEdit(null); }} />
      )}
      <ConfirmDialog open={Boolean(del)} title="Delete this photo?" text="The record is removed from the gallery. To hide it temporarily, switch it to inactive instead." onClose={() => setDel(null)}
        onConfirm={async () => { try { await remove(del.id); say('Deleted'); } catch (e) { say(e.message, 'error'); } setDel(null); }} />
      <Snackbar open={Boolean(snack.msg)} autoHideDuration={3500} onClose={() => setSnack((s) => ({ ...s, msg: '' }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snack.sev} variant="filled">{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
