import { Fragment, useMemo, useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import PageShell from '../components/PageShell';
import AdSlot from '../components/AdSlot';
import { CardGrid } from '../components/ui';
import { EventCard } from '../components/cards';
import { useCollection } from '../api';

export default function Events() {
  const { data: events } = useCollection('events');
  const [tab, setTab] = useState('upcoming');
  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
    return { upcoming: sorted.filter((e) => new Date(e.date) >= now), past: sorted.filter((e) => new Date(e.date) < now).reverse() };
  }, [events]);
  const list = tab === 'upcoming' ? upcoming : past;
  return (
    <PageShell title="Events & Programmes" eyebrow="Community calendar" subtitle="Meetings, workshops, drives and celebrations across Chikhli and Moshi." description="Upcoming and past events of the Chikhli–Moshi Federation – meetings, workshops, camps and community celebrations.">
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, '& .MuiTabs-indicator': { height: 4, borderRadius: 4 } }}>
        <Tab value="upcoming" label={`Upcoming (${upcoming.length})`} />
        <Tab value="past" label={`Past (${past.length})`} />
      </Tabs>
      {list.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 6, textAlign: 'center' }}>No events to show.</Typography>
      ) : (
        <CardGrid cols={{ xs: 1, md: 2 }} gap={2.5}>
          {list.map((e, i) => (
            <Fragment key={e.id}>
              <EventCard ev={e} past={tab === 'past'} />
              {(i + 1) % 4 === 0 && i + 1 < list.length && <Box sx={{ gridColumn: '1 / -1' }}><AdSlot type="infeed" sx={{ my: 0 }} /></Box>}
            </Fragment>
          ))}
        </CardGrid>
      )}
    </PageShell>
  );
}
