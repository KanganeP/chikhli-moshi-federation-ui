import { useState } from 'react';
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, MenuItem, Stack, Switch, TextField, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CloseIcon, CloudUploadIcon, AttachFileIcon } from '../icons';
import { admin, fromLocalInput, toLocalInput } from './adminApi';

const opt = (o) => (typeof o === 'string' ? { value: o, label: o } : o);

function Upload({ field, value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const isImg = field.type === 'image';
  const pick = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    setBusy(true); setErr('');
    try { const r = await admin.upload(f); onChange(r.url); } catch (x) { setErr(x.message); } finally { setBusy(false); }
  };
  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 0.8, fontWeight: 600 }}>{field.label}{field.required ? ' *' : ''}</Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        {isImg && (
          <Box sx={{ width: 84, height: 84, borderRadius: 2, bgcolor: 'action.hover', flexShrink: 0, overflow: 'hidden', display: 'grid', placeItems: 'center', border: '1px solid', borderColor: 'divider' }}>
            {value ? <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Typography variant="caption" color="text.secondary">No image</Typography>}
          </Box>
        )}
        <Stack spacing={0.5} sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button component="label" variant="outlined" size="small" disabled={busy} startIcon={busy ? <CircularProgress size={16} /> : <CloudUploadIcon />}>
              {value ? 'Replace' : 'Upload'}
              <input hidden type="file" accept={isImg ? 'image/jpeg,image/png,image/webp,image/gif' : 'application/pdf,image/jpeg,image/png,image/webp'} onChange={pick} />
            </Button>
            {value && <Button size="small" color="error" onClick={() => onChange('')}>Remove</Button>}
          </Stack>
          {!isImg && value && <Typography variant="caption" sx={{ display: 'flex', gap: 0.5, alignItems: 'center', wordBreak: 'break-all' }}><AttachFileIcon sx={{ fontSize: 14 }} />{value.split('/').pop()}</Typography>}
          <Typography variant="caption" color="text.secondary">{isImg ? 'JPG, PNG, WebP or GIF, up to 8 MB' : 'PDF or image, up to 8 MB'}</Typography>
        </Stack>
      </Stack>
      {err && <Alert severity="error" sx={{ mt: 1 }}>{err}</Alert>}
    </Box>
  );
}

function initialValues(fields, row, defaults) {
  const v = {};
  fields.forEach((f) => {
    const src = row ? row[f.name] : defaults?.[f.name];
    if (f.type === 'switch') v[f.name] = Boolean(src);
    else if (f.type === 'datetime') v[f.name] = toLocalInput(src);
    else if (f.type === 'tags') v[f.name] = Array.isArray(src) ? src.join(', ') : '';
    else v[f.name] = src ?? '';
  });
  v.active = row ? row.active !== false : defaults?.active !== false;
  return v;
}

export default function FormDialog({ open, title, fields, row, defaults, activeLabel = 'Active (shown on the website)', onClose, onSave }) {
  const theme = useTheme();
  const full = useMediaQuery(theme.breakpoints.down('sm'));
  const [vals, setVals] = useState(() => initialValues(fields, row, defaults));
  const [errs, setErrs] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiErr, setApiErr] = useState('');
  const set = (k) => (v) => setVals((p) => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    fields.forEach((f) => { if (f.required && !String(vals[f.name] ?? '').trim()) er[f.name] = 'Required'; });
    setErrs(er);
    if (Object.keys(er).length) return;
    const out = { active: vals.active };
    fields.forEach((f) => {
      const v = vals[f.name];
      out[f.name] = f.type === 'datetime' ? fromLocalInput(v) : f.type === 'tags' ? v.split(',').map((x) => x.trim()).filter(Boolean) : v;
    });
    setSaving(true); setApiErr('');
    try { await onSave(out); } catch (x) { setApiErr(x.message); setSaving(false); }
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullScreen={full} fullWidth maxWidth="sm">
      <form onSubmit={submit} noValidate>
        <DialogTitle sx={{ pr: 7, fontWeight: 800 }}>
          {title}
          <IconButton aria-label="Close" onClick={onClose} disabled={saving} sx={{ position: 'absolute', right: 12, top: 12 }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0,1fr))' }, gap: 2, pt: 0.5 }}>
            {fields.map((f) => {
              const wrap = { gridColumn: f.full || ['multiline', 'image', 'file', 'tags'].includes(f.type) ? { sm: '1 / -1' } : 'auto' };
              if (f.type === 'switch') return <Box key={f.name} sx={wrap}><FormControlLabel control={<Switch checked={vals[f.name]} onChange={(e) => set(f.name)(e.target.checked)} />} label={f.label} /></Box>;
              if (f.type === 'image' || f.type === 'file') return <Box key={f.name} sx={wrap}><Upload field={f} value={vals[f.name]} onChange={set(f.name)} /></Box>;
              const isSel = f.type === 'select';
              return (
                <Box key={f.name} sx={wrap}>
                  <TextField
                    fullWidth size="small" label={f.label} required={f.required}
                    type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : f.type === 'datetime' ? 'datetime-local' : f.type === 'tel' ? 'tel' : f.type === 'email' ? 'email' : 'text'}
                    select={isSel} multiline={f.type === 'multiline'} minRows={f.type === 'multiline' ? 3 : undefined}
                    value={vals[f.name]} onChange={(e) => set(f.name)(e.target.value)}
                    error={Boolean(errs[f.name])} helperText={errs[f.name] || f.help}
                    InputLabelProps={['date', 'datetime'].includes(f.type) ? { shrink: true } : undefined}
                    inputProps={f.type === 'number' ? { min: 0, step: 'any' } : undefined}
                  >
                    {isSel && [!f.required && <MenuItem key="__none" value=""><em>None</em></MenuItem>, ...f.options.map(opt).map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)]}
                  </TextField>
                </Box>
              );
            })}
            <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
              <FormControlLabel control={<Switch checked={vals.active} onChange={(e) => set('active')(e.target.checked)} />} label={activeLabel} />
            </Box>
          </Box>
          {apiErr && <Alert severity="error" sx={{ mt: 2 }}>{apiErr}</Alert>}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={saving}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving} startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}>{saving ? 'Saving…' : 'Save'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export function ConfirmDialog({ open, title, text, confirmLabel = 'Delete', onClose, onConfirm }) {
  const [busy, setBusy] = useState(false);
  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 800 }}>{title}</DialogTitle>
      <DialogContent><Typography color="text.secondary">{text}</Typography></DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={busy}>Cancel</Button>
        <Button color="error" variant="contained" disabled={busy} onClick={async () => { setBusy(true); try { await onConfirm(); } finally { setBusy(false); } }}>{confirmLabel}</Button>
      </DialogActions>
    </Dialog>
  );
}
