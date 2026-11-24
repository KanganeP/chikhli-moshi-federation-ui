import { Fragment, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Button, Chip, Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, MenuItem, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PageShell from '../components/PageShell';
import AdSlot from '../components/AdSlot';
import { CardGrid } from '../components/ui';
import { SocietyCard } from '../components/cards';
import { areas, societyTypes } from '../data/content';
import { useCollection } from '../api';
import { CloseIcon, SearchIcon, PhoneIcon, LocationOnIcon } from '../icons';

const PAGE = 9;

export default function Societies() {
  const { data: societies } = useCollection('societies');
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [type, setType] = useState('All');
  const [shown, setShown] = useState(PAGE);
  const [open, setOpen] = useState(null);
  const area = params.get('area') || 'All';
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const list = useMemo(
    () => societies.filter((s) =>
      (area === 'All' || s.area === area) && (type === 'All' || s.type === type) && s.name.toLowerCase().includes(q.trim().toLowerCase())),
    [societies, q, area, type],
  );
  const setArea = (v) => { setShown(PAGE); v === 'All' ? setParams({}) : setParams({ area: v }); };

  return (
    <PageShell title="Member Societies" eyebrow="Directory" subtitle={`${societies.length} societies listed — search by name, area or type.`} description="Directory of housing societies, apartment associations and townships that are members of the Chikhli–Moshi Federation.">
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField fullWidth value={q} onChange={(e) => { setQ(e.target.value); setShown(PAGE); }} placeholder="Search society name…" aria-label="Search societies"
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
        <TextField select value={area} onChange={(e) => setArea(e.target.value)} label="Area" sx={{ minWidth: { sm: 190 } }}>
          {['All', ...areas].map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
        </TextField>
        <TextField select value={type} onChange={(e) => { setType(e.target.value); setShown(PAGE); }} label="Type" sx={{ minWidth: { sm: 190 } }}>
          {['All', ...societyTypes].map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
        </TextField>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{list.length} result{list.length === 1 ? '' : 's'}</Typography>

      {list.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6">No societies match your search</Typography>
          <Button sx={{ mt: 2 }} onClick={() => { setQ(''); setType('All'); setArea('All'); }}>Clear filters</Button>
        </Box>
      ) : (
        <CardGrid cols={{ xs: 1, sm: 2, md: 2, lg: 3 }} gap={2.5}>
          {list.slice(0, shown).map((s, i) => (
            <Fragment key={s.id}>
              <SocietyCard s={s} onOpen={setOpen} />
              {(i + 1) % 6 === 0 && i + 1 < Math.min(shown, list.length) && (
                <Box sx={{ gridColumn: '1 / -1' }}><AdSlot type="infeed" sx={{ my: 0 }} /></Box>
              )}
            </Fragment>
          ))}
        </CardGrid>
      )}
      {shown < list.length && (
        <Box sx={{ textAlign: 'center', mt: 4 }}><Button variant="contained" onClick={() => setShown((n) => n + PAGE)}>Load more</Button></Box>
      )}

      <Dialog open={Boolean(open)} onClose={() => setOpen(null)} fullScreen={fullScreen} fullWidth maxWidth="sm">
        {open && (
          <>
            <DialogTitle sx={{ pr: 7, fontWeight: 800 }}>
              {open.name}
              <IconButton aria-label="Close" onClick={() => setOpen(null)} sx={{ position: 'absolute', right: 12, top: 12 }}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                <Chip label={open.type} color="primary" size="small" />
                <Chip label={`${open.flats} flats`} size="small" variant="outlined" />
                <Chip label={`Since ${open.since}`} size="small" variant="outlined" />
              </Stack>
              <Stack spacing={1.2} sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1}><LocationOnIcon fontSize="small" color="secondary" /><Typography variant="body2">{open.area}, Pimpri-Chinchwad, Pune</Typography></Stack>
                <Stack direction="row" spacing={1}><PhoneIcon fontSize="small" color="secondary" /><Typography variant="body2">{open.chairman} · {open.contact}</Typography></Stack>
              </Stack>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Amenities & practices</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>{open.amenities.map((a) => <Chip key={a} label={a} size="small" />)}</Stack>
              <AdSlot type="rectangle" />
            </DialogContent>
          </>
        )}
      </Dialog>
    </PageShell>
  );
}
