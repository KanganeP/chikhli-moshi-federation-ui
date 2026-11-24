import { Link as RouterLink } from 'react-router-dom';
import { Box, Breadcrumbs, Container, Link, Typography, Stack, Button, Chip } from '@mui/material';
import AdSlot from './AdSlot';
import Card3D from './Card3D';
import { FloatingShapes, Cube3D } from './Decor';
import { DateTile, IconBlock } from './ui';
import { usePageMeta, fmtDate } from '../utils';
import { useCollection } from '../api';
import { ArrowForwardIcon, HomeIcon, ReportProblemIcon, HandshakeIcon, SupportAgentIcon, DescriptionIcon } from '../icons';
import { brand } from '../theme';

export function PageHero({ eyebrow, title, subtitle, crumbs }) {
  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', color: '#fff', background: `linear-gradient(135deg, ${brand.indigoDeep} 0%, ${brand.indigo} 60%, #3a57c4 100%)`, pt: { xs: 5, md: 8 }, pb: { xs: 7, md: 10 } }}>
      <FloatingShapes opacity={0.55} />
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={4}>
          <Box className="rise" sx={{ maxWidth: 720 }}>
            <Breadcrumbs separator="›" sx={{ color: 'rgba(255,255,255,.75)', mb: 2, '& a': { color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: .5 } }}>
              <Link component={RouterLink} to="/"><HomeIcon sx={{ fontSize: 16 }} /> Home</Link>
              {(crumbs || []).map((c) => <Link key={c.to} component={RouterLink} to={c.to}>{c.label}</Link>)}
              <Typography color="inherit" sx={{ fontSize: 'inherit', fontWeight: 600 }}>{title}</Typography>
            </Breadcrumbs>
            {eyebrow && <Typography variant="overline" sx={{ color: '#ffb04d' }}>{eyebrow}</Typography>}
            <Typography variant="h2" component="h1" sx={{ textShadow: '0 2px 0 rgba(0,0,0,.18), 0 10px 24px rgba(0,0,0,.35)' }}>{title}</Typography>
            {subtitle && <Typography sx={{ mt: 1.5, color: 'rgba(255,255,255,.85)', fontSize: { xs: 15, md: 17 } }}>{subtitle}</Typography>}
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'block' }, pr: 6 }}><Cube3D size={110} /></Box>
        </Stack>
      </Container>
      {/* curved bottom edge */}
      <Box aria-hidden="true" sx={{ position: 'absolute', bottom: -1, left: 0, right: 0, lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" width="100%" height="46" style={{ display: 'block' }}><path d="M0,60 L0,30 Q360,-10 720,25 T1440,20 L1440,60 Z" fill="#eef1fb" /></svg>
      </Box>
    </Box>
  );
}

function Sidebar() {
  const { data: events } = useCollection('events');
  const next = events.filter((e) => new Date(e.date) > new Date()).sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  const links = [
    ['/raise-issue', 'Raise an issue', ReportProblemIcon, brand.rose],
    ['/membership', 'Become a member', HandshakeIcon, brand.teal],
    ['/services', 'Get help & FAQs', SupportAgentIcon, brand.indigo],
    ['/resources', 'Forms & resources', DescriptionIcon, brand.saffronDark],
  ];
  return (
    <Stack spacing={3} sx={{ position: 'sticky', top: 96 }}>
      <Card3D sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ mb: 1.5 }}>Quick actions</Typography>
        <Stack spacing={1}>
          {links.map(([to, label, Icon, color]) => (
            <Button key={to} component={RouterLink} to={to} startIcon={<Icon sx={{ color }} />} endIcon={<ArrowForwardIcon fontSize="small" />} sx={{ justifyContent: 'space-between', color: 'text.primary', bgcolor: 'rgba(31,58,147,.05)', py: 1, '&:hover': { bgcolor: 'rgba(31,58,147,.1)' } }}>{label}</Button>
          ))}
        </Stack>
      </Card3D>
      {next && (
        <Card3D sx={{ p: 2.5 }}>
          <Chip label="Next event" size="small" color="secondary" sx={{ mb: 1.5 }} />
          <Stack direction="row" spacing={1.5}>
            <DateTile iso={next.date} />
            <Box>
              <Typography sx={{ fontWeight: 700, lineHeight: 1.25 }}>{next.title}</Typography>
              <Typography variant="body2" color="text.secondary">{fmtDate(next.date, { hour: '2-digit', minute: '2-digit' })} · {next.venue}</Typography>
            </Box>
          </Stack>
          <Button component={RouterLink} to="/events" size="small" sx={{ mt: 1.5 }} endIcon={<ArrowForwardIcon />}>All events</Button>
        </Card3D>
      )}
      <AdSlot type="sidebar" sx={{ my: 0 }} />
    </Stack>
  );
}

/**
 * Standard inner-page frame: hero → leaderboard ad → content (+ sticky sidebar with ad on desktop) → rectangle ad.
 * Pass `noAds` for pages that shouldn't show ads (e.g. 404, very thin pages).
 */
export default function PageShell({ title, description, eyebrow, subtitle, crumbs, sidebar = true, noAds = false, children }) {
  usePageMeta(title, description);
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} subtitle={subtitle} crumbs={crumbs} />
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {!noAds && <AdSlot type="leaderboard" sx={{ mt: 0 }} />}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', lg: sidebar ? 'minmax(0,1fr) 340px' : 'minmax(0,1fr)' }, gap: { xs: 3, lg: 5 }, alignItems: 'start' }}>
          <Box sx={{ minWidth: 0 }}>{children}</Box>
          {sidebar && <Box sx={{ display: { xs: 'none', lg: 'block' } }}><Sidebar /></Box>}
        </Box>
        {!noAds && <AdSlot type="rectangle" />}
      </Container>
    </>
  );
}

export { IconBlock };
