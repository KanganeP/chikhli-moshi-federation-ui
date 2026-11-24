import { Box, Stack, Typography, Link, Avatar } from '@mui/material';
import PageShell from '../components/PageShell';
import AdSlot from '../components/AdSlot';
import { CardGrid, FlipCard, InitialsAvatar } from '../components/ui';
import { useCollection } from '../api';
import { PhoneIcon, EmailIcon } from '../icons';
import { brand } from '../theme';

const colors = [brand.indigo, brand.saffronDark, brand.teal, brand.rose, '#2a7fd1', '#7a3fb0', '#138808', '#c2410c'];

export default function Committee() {
  const { data: committee } = useCollection('committee');
  return (
    <PageShell title="Executive Committee" eyebrow="Our team" subtitle="Volunteers from member societies who lead the federation. Tap or hover a card for contact details." description="Meet the office-bearers and executive committee of the Chikhli–Moshi Federation.">
      <CardGrid cols={{ xs: 1, sm: 2, md: 2, lg: 3 }} gap={3}>
        {committee.map((m, i) => (
          <Box key={m.id} sx={{ display: 'contents' }}>
            <FlipCard
              height={270}
              front={
                <Stack alignItems="center" justifyContent="center" spacing={1.5} sx={{ height: '100%', p: 2, textAlign: 'center' }}>
                  {m.photo
                    ? <Avatar src={m.photo} alt={m.personName || m.designation} sx={{ width: 84, height: 84, boxShadow: '0 5px 0 rgba(12,23,68,.35), 0 12px 20px rgba(20,39,102,.25)' }} />
                    : <InitialsAvatar text={m.initials || (m.personName || m.designation).slice(0, 2).toUpperCase()} size={84} color={colors[i % colors.length]} />}
                  <Box>
                    <Typography variant="h6">{m.personName || m.designation}</Typography>
                    <Typography variant="body2" color="text.secondary">{m.personName ? m.designation : m.role}</Typography>
                  </Box>
                </Stack>
              }
              back={
                <Stack justifyContent="center" spacing={1.4} sx={{ height: '100%', p: 3 }}>
                  <Typography variant="h6">{m.personName || m.designation}</Typography>
                  {m.personName && <Typography variant="body2" sx={{ opacity: .85 }}>{m.designation}</Typography>}
                  <Typography variant="body2" sx={{ opacity: .85 }}>{m.bio}</Typography>
                  {m.phone && <Stack direction="row" spacing={1} alignItems="center"><PhoneIcon fontSize="small" /><Link href={`tel:${m.phone.replace(/\s/g, '')}`} color="inherit" onClick={(e) => e.stopPropagation()}>{m.phone}</Link></Stack>}
                  {m.email && <Stack direction="row" spacing={1} alignItems="center"><EmailIcon fontSize="small" /><Link href={`mailto:${m.email}`} color="inherit" onClick={(e) => e.stopPropagation()} sx={{ wordBreak: 'break-all', fontSize: 13 }}>{m.email}</Link></Stack>}
                </Stack>
              }
            />
          </Box>
        ))}
      </CardGrid>
      <AdSlot type="infeed" />
    </PageShell>
  );
}
