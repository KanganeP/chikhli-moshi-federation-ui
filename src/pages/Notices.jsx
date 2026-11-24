import { Fragment, useMemo, useState } from 'react';
import { Box, Chip, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import PageShell from '../components/PageShell';
import AdSlot from '../components/AdSlot';
import { NoticeRow } from '../components/cards';
import { noticeCategories } from '../data/content';
import { useCollection } from '../api';
import { SearchIcon } from '../icons';

export default function Notices() {
  const { data: notices } = useCollection('notices');
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const list = useMemo(
    () => [...notices]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .filter((n) => (cat === 'All' || n.category === cat) && (n.title + n.body).toLowerCase().includes(q.trim().toLowerCase())),
    [notices, cat, q],
  );
  return (
    <PageShell title="Notices & Circulars" eyebrow="Announcements" subtitle="Official updates for member societies and residents." description="Latest notices, circulars and announcements from the Chikhli–Moshi Federation.">
      <TextField fullWidth value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search notices…" aria-label="Search notices" sx={{ mb: 2 }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
      <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: 'auto', pb: 1 }} role="tablist" aria-label="Filter by category">
        {noticeCategories.map((c) => (
          <Chip key={c} label={c} clickable color={cat === c ? 'primary' : 'default'} variant={cat === c ? 'filled' : 'outlined'} onClick={() => setCat(c)} role="tab" aria-selected={cat === c} />
        ))}
      </Stack>
      <Stack spacing={2}>
        {list.map((n, i) => (
          <Fragment key={n.id}>
            <NoticeRow n={n} expanded />
            {(i + 1) % 3 === 0 && i + 1 < list.length && <AdSlot type="infeed" sx={{ my: 0 }} />}
          </Fragment>
        ))}
        {list.length === 0 && <Box sx={{ textAlign: 'center', py: 8 }}><Typography variant="h6">No notices found</Typography></Box>}
      </Stack>
    </PageShell>
  );
}
