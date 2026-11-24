import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Stack, Link, IconButton, Divider } from '@mui/material';
import { PhoneIcon, EmailIcon, LocationOnIcon, FacebookIcon, InstagramIcon, YouTubeIcon, WhatsAppIcon } from '../icons';
import { LogoMark } from './Decor';
import { CardGrid } from './ui';
import { site } from '../config/site';
import { useLang } from '../i18n';

const quick = [['/about', 'nav.about'], ['/societies', 'nav.societies'], ['/committee', 'nav.committee'], ['/notices', 'nav.notices'], ['/events', 'nav.events'], ['/gallery', 'nav.gallery']];
const help = [['/services', 'nav.services'], ['/raise-issue', 'nav.raiseIssue'], ['/resources', 'nav.resources'], ['/membership', 'nav.membership'], ['/contact', 'nav.contact']];

function Skyline() {
  // Layered 3D-ish skyline silhouette between content and footer.
  const bars = [[0, 60], [40, 110], [90, 80], [140, 140], [200, 90], [250, 120], [310, 70], [360, 150], [420, 100], [480, 130], [540, 80], [590, 160], [650, 90], [700, 120], [760, 70], [810, 140], [870, 100], [930, 130], [990, 85], [1040, 150], [1100, 95], [1150, 120]];
  return (
    <Box aria-hidden="true" sx={{ lineHeight: 0, mt: 6, color: '#142766' }}>
      <svg viewBox="0 0 1200 170" preserveAspectRatio="none" width="100%" height="110" style={{ display: 'block' }}>
        <g fill="#2b46a8" opacity=".55" transform="translate(0,-6)">
          {bars.map(([x, h], i) => <rect key={`b${i}`} x={x + 20} y={170 - h - 14} width="36" height={h + 14} rx="3" />)}
        </g>
        <g fill="currentColor">
          {bars.map(([x, h], i) => <rect key={`f${i}`} x={x} y={170 - h} width="44" height={h} rx="3" />)}
        </g>
        <g fill="#ffd9a8" opacity=".55">
          {bars.flatMap(([x, h], i) => [0, 1, 2].map((k) => <rect key={`w${i}-${k}`} x={x + 8 + k * 12} y={170 - h + 12 + (i % 3) * 8} width="6" height="8" />))}
        </g>
      </svg>
    </Box>
  );
}

export default function Footer() {
  const { t } = useLang();
  const linkSx = { color: 'rgba(255,255,255,.82)', textDecoration: 'none', '&:hover': { color: '#ffb04d' }, display: 'block', py: 0.4, fontSize: 14 };
  return (
    <Box component="footer" sx={{ mt: 4 }}>
      <Skyline />
      <Box sx={{ bgcolor: '#142766', color: '#fff', pt: 6, pb: { xs: 12, lg: 4 }, mt: '-1px' }}>
        <Container maxWidth="lg">
          <CardGrid cols={{ xs: 1, sm: 2, md: 4 }} gap={4}>
            <Box>
              <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1.5 }}>
                <LogoMark size={44} />
                <Typography sx={{ fontWeight: 800, fontSize: 18 }}>{site.name}</Typography>
              </Stack>
              <Typography sx={{ color: 'rgba(255,255,255,.75)', fontSize: 14, mb: 2 }}>{t('footer.about')}</Typography>
              <Stack direction="row" spacing={0.5}>
                <IconButton aria-label="Facebook" component="a" href={site.social.facebook} target="_blank" rel="noopener noreferrer" sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,.1)' }}><FacebookIcon /></IconButton>
                <IconButton aria-label="Instagram" component="a" href={site.social.instagram} target="_blank" rel="noopener noreferrer" sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,.1)' }}><InstagramIcon /></IconButton>
                <IconButton aria-label="YouTube" component="a" href={site.social.youtube} target="_blank" rel="noopener noreferrer" sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,.1)' }}><YouTubeIcon /></IconButton>
                <IconButton aria-label="WhatsApp" component="a" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,.1)' }}><WhatsAppIcon /></IconButton>
              </Stack>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>{t('footer.quick')}</Typography>
              {quick.map(([to, k]) => <Link key={to} component={RouterLink} to={to} sx={linkSx}>{t(k)}</Link>)}
            </Box>
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>{t('footer.help')}</Typography>
              {help.map(([to, k]) => <Link key={to} component={RouterLink} to={to} sx={linkSx}>{t(k)}</Link>)}
            </Box>
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>{t('footer.contact')}</Typography>
              <Stack spacing={1.2} sx={{ fontSize: 14, color: 'rgba(255,255,255,.82)' }}>
                <Stack direction="row" spacing={1}><LocationOnIcon fontSize="small" sx={{ color: '#ffb04d' }} /><span>{site.address}</span></Stack>
                <Stack direction="row" spacing={1}><PhoneIcon fontSize="small" sx={{ color: '#ffb04d' }} /><span>{site.phone}</span></Stack>
                <Stack direction="row" spacing={1}><EmailIcon fontSize="small" sx={{ color: '#ffb04d' }} /><span style={{ wordBreak: 'break-all' }}>{site.email}</span></Stack>
              </Stack>
            </Box>
          </CardGrid>
          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,.15)' }} />
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1.5} sx={{ fontSize: 13, color: 'rgba(255,255,255,.7)' }}>
            <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Link component={RouterLink} to="/privacy" sx={{ color: 'inherit' }}>Privacy Policy</Link>
              <Link component={RouterLink} to="/terms" sx={{ color: 'inherit' }}>Terms of Use</Link>
              <Link component={RouterLink} to="/disclaimer" sx={{ color: 'inherit' }}>Disclaimer</Link>
            </Stack>
          </Stack>
          <Typography sx={{ mt: 1.5, fontSize: 12, color: 'rgba(255,255,255,.5)' }}>
            Ads on this site are served by Google and are not endorsed by the federation.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
