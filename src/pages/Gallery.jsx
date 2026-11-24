import { useMemo, useState } from 'react';
import { Box, Chip, Dialog, IconButton, Stack, Typography } from '@mui/material';
import PageShell from '../components/PageShell';
import AdSlot from '../components/AdSlot';
import Card3D from '../components/Card3D';
import { useCollection } from '../api';

const PALETTE = [['#1f3a93', '#6f86e0'], ['#0f9d8a', '#7ee0cf'], ['#ff8f1f', '#ffc27a'], ['#e8527a', '#ffb0c6'], ['#7a3fb0', '#caa7ee'], ['#2a7fd1', '#9bd0ff']];
import { CloseIcon, NavigateBeforeIcon, NavigateNextIcon, ImageIcon } from '../icons';

/** Tile renders a real photo when `src` is set (put files in /public/gallery), otherwise a gradient placeholder. */
function Tile({ g, onClick }) {
  return (
    <Card3D intensity={6} component="button" onClick={onClick} aria-label={`Open ${g.caption}`}
      sx={{ display: 'block', width: '100%', p: 0, mb: 2.5, breakInside: 'avoid', cursor: 'zoom-in', overflow: 'hidden', border: 0, aspectRatio: g.ratio, background: g.src ? `url(${g.src}) center/cover` : `linear-gradient(145deg, ${g.color[0]}, ${g.color[1]})` }}>
      {!g.src && <ImageIcon sx={{ position: 'absolute', top: 12, right: 12, color: 'rgba(255,255,255,.7)' }} />}
      <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, p: 1.6, textAlign: 'left', color: '#fff', background: 'linear-gradient(transparent, rgba(0,0,0,.6))' }}>
        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{g.caption}</Typography>
        <Typography sx={{ fontSize: 11, opacity: .85 }}>{g.album}</Typography>
      </Box>
    </Card3D>
  );
}

export default function Gallery() {
  const { data: raw } = useCollection('gallery');
  const gallery = useMemo(() => raw.map((g, i) => ({ ...g, ratio: g.ratio || 4 / 3, color: g.color || PALETTE[i % PALETTE.length] })), [raw]);
  const albums = ['All', ...new Set(gallery.map((g) => g.album).filter(Boolean))];
  const [album, setAlbum] = useState('All');
  const [idx, setIdx] = useState(null);
  const items = useMemo(() => gallery.filter((g) => album === 'All' || g.album === album), [album, gallery]);
  const cur = idx !== null ? items[idx] : null;
  const step = (d) => setIdx((i) => (i + d + items.length) % items.length);

  return (
    <PageShell title="Photo Gallery" eyebrow="Moments" subtitle="Highlights from our meetings, drives and celebrations." description="Photo gallery of Chikhli–Moshi Federation events, civic drives and community celebrations.">
      <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: 'auto', pb: 1 }}>
        {albums.map((a) => <Chip key={a} label={a} clickable color={album === a ? 'primary' : 'default'} variant={album === a ? 'filled' : 'outlined'} onClick={() => { setAlbum(a); setIdx(null); }} />)}
      </Stack>
      <Box sx={{ columnCount: { xs: 1, sm: 2, md: 3 }, columnGap: '20px' }}>
        {items.map((g, i) => <Tile key={g.id} g={g} onClick={() => setIdx(i)} />)}
      </Box>
      <Typography variant="caption" color="text.secondary">Placeholder tiles — add photos by setting <code>src</code> on each item in <code>src/data/content.js</code> (files in <code>/public/gallery</code>).</Typography>
      <AdSlot type="infeed" />

      <Dialog open={Boolean(cur)} onClose={() => setIdx(null)} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: '#0c1744', color: '#fff', overflow: 'hidden' } }}>
        {cur && (
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ aspectRatio: { xs: '4/3', md: '16/10' }, background: cur.src ? `url(${cur.src}) center/contain no-repeat` : `linear-gradient(145deg, ${cur.color[0]}, ${cur.color[1]})`, display: 'grid', placeItems: 'center' }}>
              {!cur.src && <ImageIcon sx={{ fontSize: 80, opacity: .5 }} />}
            </Box>
            <Box sx={{ p: 2 }}><Typography sx={{ fontWeight: 700 }}>{cur.caption}</Typography><Typography variant="body2" sx={{ opacity: .8 }}>{cur.album}</Typography></Box>
            <IconButton aria-label="Close" onClick={() => setIdx(null)} sx={{ position: 'absolute', top: 8, right: 8, color: '#fff', bgcolor: 'rgba(0,0,0,.4)' }}><CloseIcon /></IconButton>
            <IconButton aria-label="Previous" onClick={() => step(-1)} sx={{ position: 'absolute', top: '40%', left: 8, color: '#fff', bgcolor: 'rgba(0,0,0,.4)' }}><NavigateBeforeIcon /></IconButton>
            <IconButton aria-label="Next" onClick={() => step(1)} sx={{ position: 'absolute', top: '40%', right: 8, color: '#fff', bgcolor: 'rgba(0,0,0,.4)' }}><NavigateNextIcon /></IconButton>
          </Box>
        )}
      </Dialog>
    </PageShell>
  );
}
