import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation, matchPath } from 'react-router-dom';
import { Box, Button, Fab, IconButton, Paper, Stack, Typography, CircularProgress, Zoom, useScrollTrigger, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AdSlot, { ADS_CLIENT, getConsent } from './AdSlot';
import { CloseIcon, KeyboardArrowUpIcon, WhatsAppIcon } from '../icons';
import { site } from '../config/site';

function ScrollManager() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

function BackToTop() {
  const show = useScrollTrigger({ disableHysteresis: true, threshold: 500 });
  return (
    <Zoom in={show}>
      <Fab color="primary" size="small" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        sx={{ position: 'fixed', right: 16, bottom: { xs: 140, lg: 24 }, zIndex: 1200 }}>
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  );
}

function WhatsAppFab() {
  return (
    <Fab aria-label="Chat on WhatsApp" component="a" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer"
      sx={{ position: 'fixed', left: 16, bottom: { xs: 140, lg: 24 }, zIndex: 1200, bgcolor: '#25D366', color: '#fff', '&:hover': { bgcolor: '#1ebe5a' } }} size="medium">
      <WhatsAppIcon />
    </Fab>
  );
}

/** Dismissible mobile/tablet anchor ad pinned to the bottom of the viewport. */
function StickyMobileAd() {
  const { pathname } = useLocation();
  const [closed, setClosed] = useState(false);
  const known = ['/', '/about', '/societies', '/committee', '/notices', '/events', '/gallery', '/services', '/resources', '/privacy', '/terms', '/disclaimer'];
  // no anchor ad on form pages (distraction-free) or on 404 (AdSense: no ads on pages without content)
  const hide = !known.some((k) => matchPath(k, pathname));
  if (closed || hide) return null;
  return (
    <Box sx={{ display: { xs: 'block', lg: 'none' }, position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 1250, bgcolor: 'rgba(255,255,255,.96)', backdropFilter: 'blur(8px)', borderTop: '1px solid rgba(31,58,147,.15)', boxShadow: '0 -8px 24px rgba(20,39,102,.12)', py: 0.6 }}>
      <IconButton size="small" aria-label="Close ad" onClick={() => setClosed(true)} sx={{ position: 'absolute', top: -14, right: 8, bgcolor: '#fff', boxShadow: 2, '&:hover': { bgcolor: '#fff' } }}><CloseIcon fontSize="small" /></IconButton>
      <AdSlot type="anchor" />
    </Box>
  );
}

function ConsentBanner() {
  const [choice, setChoice] = useState(() => getConsent());
  if (choice || !ADS_CLIENT) return null;
  const save = (v) => { try { localStorage.setItem('cmf-consent', v); } catch { /* ignore */ } setChoice(v); };
  return (
    <Paper elevation={8} role="dialog" aria-label="Cookie notice"
      sx={{ position: 'fixed', zIndex: 1400, left: { xs: 8, md: 24 }, right: { xs: 8, md: 'auto' }, bottom: { xs: 76, lg: 24 }, maxWidth: 440, p: 2.2 }}>
      <Typography sx={{ fontWeight: 700, mb: 0.5 }}>We use cookies</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        We and our advertising partner Google use cookies to show ads and improve the site. See our{' '}
        <Link component={RouterLink} to="/privacy">Privacy Policy</Link>.
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button size="small" variant="contained" onClick={() => save('all')}>Accept all</Button>
        <Button size="small" variant="outlined" onClick={() => save('essential')}>Essential only</Button>
      </Stack>
    </Paper>
  );
}

export default function Layout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box component="a" href="#main" sx={{ position: 'absolute', left: -9999, '&:focus': { left: 8, top: 8, zIndex: 2000, bgcolor: '#fff', p: 1.5, borderRadius: 2 } }}>Skip to content</Box>
      <ScrollManager />
      <Header />
      <Box component="main" id="main" sx={{ flex: 1 }}>
        <Suspense fallback={<Box sx={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}><CircularProgress /></Box>}>
          <Outlet />
        </Suspense>
      </Box>
      <Footer />
      <WhatsAppFab />
      <BackToTop />
      <StickyMobileAd />
      <ConsentBanner />
    </Box>
  );
}
