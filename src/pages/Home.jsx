import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Chip, Container, Stack, Typography } from '@mui/material';
import CityScene from '../components/CityScene';
import { FloatingShapes } from '../components/Decor';
import AdSlot from '../components/AdSlot';
import Card3D from '../components/Card3D';
import { CardGrid, SectionTitle, StatCard } from '../components/ui';
import { EventCard, NoticeRow, ServiceCard, SocietyCard } from '../components/cards';
import { areas, services, stats } from '../data/content';
import { useCollection, usePublicStats } from '../api';
import { ArrowForwardIcon, ReportProblemIcon, VerifiedIcon, CheckCircleIcon } from '../icons';
import { useLang } from '../i18n';
import { usePageMeta } from '../utils';
import { brand } from '../theme';

function Hero() {
  const { t } = useLang();
  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', color: '#fff', background: `linear-gradient(140deg, ${brand.indigoDeep} 0%, ${brand.indigo} 55%, #3f5cc8 100%)`, pb: { xs: 10, md: 14 } }}>
      <FloatingShapes />
      <Container maxWidth="lg" sx={{ position: 'relative', pt: { xs: 4, md: 7 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: '1.05fr .95fr' }, alignItems: 'center', gap: { xs: 1, md: 4 } }}>
          <Box className="rise">
            <Chip icon={<VerifiedIcon sx={{ color: '#ffb04d !important' }} />} label={t('hero.eyebrow')} sx={{ bgcolor: 'rgba(255,255,255,.14)', color: '#fff', mb: 2.5, height: 'auto', py: .6, '& .MuiChip-label': { whiteSpace: 'normal' } }} />
            <Typography variant="h1" sx={{ fontSize: { xs: '2.3rem', sm: '3.1rem', md: '3.6rem' }, textShadow: '0 2px 0 rgba(0,0,0,.2), 0 14px 30px rgba(0,0,0,.35)' }}>
              {t('hero.title1')}{' '}
              <Box component="span" sx={{ color: '#ffb04d' }}>{t('hero.title2')}</Box>
            </Typography>
            <Typography sx={{ mt: 2.5, maxWidth: 560, fontSize: { xs: 15, md: 17 }, color: 'rgba(255,255,255,.88)' }}>{t('hero.sub')}</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
              <Button component={RouterLink} to="/membership" size="large" variant="contained" color="secondary" endIcon={<ArrowForwardIcon />}>{t('cta.join')}</Button>
              <Button component={RouterLink} to="/raise-issue" size="large" variant="outlined" startIcon={<ReportProblemIcon />} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,.55)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,.1)' } }}>{t('cta.raise')}</Button>
            </Stack>
          </Box>
          <CityScene />
        </Box>
      </Container>
      <Box aria-hidden="true" sx={{ position: 'absolute', bottom: -1, left: 0, right: 0, lineHeight: 0 }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" width="100%" height="64" style={{ display: 'block' }}><path d="M0,80 L0,40 Q240,0 480,30 T960,25 T1440,30 L1440,80 Z" fill="#eef1fb" /></svg>
      </Box>
    </Box>
  );
}

export default function Home() {
  const { t } = useLang();
  usePageMeta('', 'Chikhli–Moshi Federation – the united voice of housing societies and resident associations in Chikhli and Moshi, Pune.');
  const { data: events } = useCollection('events');
  const { data: notices } = useCollection('notices');
  const { data: societies } = useCollection('societies');
  const live = usePublicStats();
  const statList = live ? [{ label: 'Member societies', value: live.societies }, { label: 'Families represented', value: live.families }, { label: 'Issues resolved', value: live.resolved }, { label: 'Years of service', value: live.years }] : stats;
  const upcoming = events.filter((e) => new Date(e.date) > new Date()).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 3);
  const latest = [...notices].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
  const featured = societies.filter((s) => s.featured);

  return (
    <>
      <Hero />

      {/* Stats overlapping the hero */}
      <Container maxWidth="lg" sx={{ mt: { xs: -6, md: -9 }, position: 'relative', zIndex: 2 }}>
        <CardGrid cols={{ xs: 2, md: 4 }} gap={{ xs: 1.5, md: 3 }}>
          {statList.map((s) => <StatCard key={s.label} {...s} />)}
        </CardGrid>
        <AdSlot type="leaderboard" />
      </Container>

      {/* Notices + events */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'repeat(2, minmax(0,1fr))' }, gap: { xs: 5, md: 5 } }}>
          <Box>
            <SectionTitle eyebrow="Stay informed" title={t('home.notices')} action={<Button component={RouterLink} to="/notices" endIcon={<ArrowForwardIcon />}>{t('cta.viewAll')}</Button>} />
            <Stack spacing={2}>{latest.map((n) => <NoticeRow key={n.id} n={n} />)}</Stack>
          </Box>
          <Box>
            <SectionTitle eyebrow="Mark your calendar" title={t('home.events')} action={<Button component={RouterLink} to="/events" endIcon={<ArrowForwardIcon />}>{t('cta.viewAll')}</Button>} />
            <Stack spacing={2}>{upcoming.map((e) => <EventCard key={e.id} ev={e} />)}</Stack>
          </Box>
        </Box>
      </Container>

      {/* Services */}
      <Box sx={{ py: { xs: 5, md: 8 }, background: 'linear-gradient(180deg, rgba(255,255,255,.0), rgba(255,255,255,.75) 20%, rgba(255,255,255,.75) 80%, rgba(255,255,255,0))' }}>
        <Container maxWidth="lg">
          <SectionTitle eyebrow="Services" title={t('home.what')} subtitle={t('home.whatSub')} align="center" />
          <CardGrid cols={{ xs: 1, sm: 2, md: 3 }}>
            {services.map((s, i) => <ServiceCard key={s.title} index={i} {...s} />)}
          </CardGrid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button component={RouterLink} to="/services" variant="contained" size="large" endIcon={<ArrowForwardIcon />}>{t('cta.learn')}</Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg"><AdSlot type="rectangle" /></Container>

      {/* About teaser with stacked 3D cards */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'repeat(2, minmax(0,1fr))' }, gap: { xs: 5, md: 8 }, alignItems: 'center' }}>
          <Box sx={{ perspective: 1200, height: { xs: 280, md: 360 }, position: 'relative' }}>
            {[
              { c: ['#6f86e0', '#4a63c0'], tr: 'rotateY(-18deg) rotateX(8deg) translateZ(-60px) translate(-34px, 34px)', label: 'Chikhli' },
              { c: ['#ff9a3d', '#ff8f1f'], tr: 'rotateY(-18deg) rotateX(8deg) translateZ(0) translate(0, 0)', label: 'Federation' },
              { c: ['#2dbfa9', '#0f9d8a'], tr: 'rotateY(-18deg) rotateX(8deg) translateZ(60px) translate(34px, -34px)', label: 'Moshi' },
            ].map((l) => (
              <Box key={l.label} sx={{ position: 'absolute', inset: { xs: '10% 12% 10% 6%', md: '8% 14% 8% 8%' }, borderRadius: 6, background: `linear-gradient(145deg, ${l.c[0]}, ${l.c[1]})`, transform: l.tr, boxShadow: '0 30px 50px rgba(20,39,102,.3)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800, fontSize: { xs: 26, md: 34 }, textShadow: '0 4px 10px rgba(0,0,0,.25)' }}>
                {l.label}
              </Box>
            ))}
          </Box>
          <Box>
            <Typography variant="overline" color="secondary.dark">About us</Typography>
            <Typography variant="h3" component="h2" sx={{ mb: 2 }}>Stronger together, society by society</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              The Chikhli–Moshi Federation brings housing societies, apartment associations and resident groups onto one platform — so residents get expert guidance, and civic bodies hear one clear, organised voice.
            </Typography>
            <Stack spacing={1.2} sx={{ mb: 3 }}>
              {['Shared legal, audit and safety expertise', 'Consolidated representation to civic authorities', 'Community events, drives and a trusted neighbourhood network'].map((p) => (
                <Stack key={p} direction="row" spacing={1.2}><CheckCircleIcon color="success" fontSize="small" /><Typography variant="body2">{p}</Typography></Stack>
              ))}
            </Stack>
            <Button component={RouterLink} to="/about" variant="outlined" endIcon={<ArrowForwardIcon />}>{t('cta.learn')}</Button>
          </Box>
        </Box>
      </Container>

      {/* Featured societies */}
      <Container maxWidth="lg" sx={{ pb: { xs: 4, md: 6 } }}>
        <SectionTitle eyebrow="Directory" title={t('home.societies')} action={<Button component={RouterLink} to="/societies" endIcon={<ArrowForwardIcon />}>{t('cta.viewAll')}</Button>} />
        <CardGrid cols={{ xs: 1, sm: 2, md: 4 }} gap={2.5}>
          {featured.map((s) => <SocietyCard key={s.id} s={s} />)}
        </CardGrid>
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" sx={{ mb: 1.5 }}>{t('home.areas')}</Typography>
          <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
            {areas.map((a) => <Chip key={a} label={a} color="primary" variant="outlined" component={RouterLink} to={`/societies?area=${encodeURIComponent(a)}`} clickable />)}
          </Stack>
        </Box>
      </Container>

      {/* CTA */}
      <Container maxWidth="lg" sx={{ pb: { xs: 3, md: 5 } }}>
        <Card3D intensity={3} sx={{ p: { xs: 3, md: 6 }, color: '#fff', textAlign: 'center', background: `linear-gradient(135deg, ${brand.indigoDeep}, ${brand.indigo})`, overflow: 'hidden', border: 0 }}>
          <Typography variant="h3" component="h2" className="pop-sm">{t('home.ctaTitle')}</Typography>
          <Typography sx={{ mt: 1.5, mb: 3, maxWidth: 640, mx: 'auto', color: 'rgba(255,255,255,.85)' }}>{t('home.ctaSub')}</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button component={RouterLink} to="/membership" size="large" variant="contained" color="secondary">{t('cta.join')}</Button>
            <Button component={RouterLink} to="/contact" size="large" sx={{ color: '#fff' }}>{t('cta.contact')}</Button>
          </Stack>
        </Card3D>
        <AdSlot type="leaderboard" />
      </Container>
    </>
  );
}
