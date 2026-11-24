import { useState } from 'react';
import { Link as RouterLink, NavLink, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, Button, IconButton, Menu, MenuItem, Drawer, List, ListItemButton, ListItemText,
  Collapse, Container, Typography, Stack, ToggleButtonGroup, ToggleButton, Divider, useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MenuIcon, CloseIcon, ExpandMoreIcon, PhoneIcon, EmailIcon, ArrowForwardIcon } from '../icons';
import { LogoMark } from './Decor';
import { NAV, site } from '../config/site';
import { useLang } from '../i18n';

function LangToggle({ size = 'small' }) {
  const { lang, setLang } = useLang();
  return (
    <ToggleButtonGroup size={size} exclusive value={lang} onChange={(_, v) => v && setLang(v)} aria-label="Language"
      sx={{ '& .MuiToggleButton-root': { px: 1.2, py: 0.2, fontWeight: 700, borderRadius: '10px !important', color: 'inherit', borderColor: 'rgba(255,255,255,.35)' }, '& .Mui-selected': { bgcolor: 'secondary.main !important', color: '#1b1205 !important' } }}>
      <ToggleButton value="en" aria-label="English">EN</ToggleButton>
      <ToggleButton value="mr" aria-label="मराठी">मराठी</ToggleButton>
    </ToggleButtonGroup>
  );
}

function DesktopItem({ item, t }) {
  const [anchor, setAnchor] = useState(null);
  const { pathname } = useLocation();
  const baseSx = { color: 'text.primary', px: 1.4, fontWeight: 600, borderRadius: 3, '&:hover': { bgcolor: 'rgba(31,58,147,.08)' } };
  if (!item.children) {
    return (
      <Button component={NavLink} to={item.to} end={item.to === '/'} sx={{ ...baseSx, '&.active': { color: 'primary.main', bgcolor: 'rgba(31,58,147,.1)', boxShadow: 'inset 0 -3px 0 #ff8f1f' } }}>
        {t(`nav.${item.key}`)}
      </Button>
    );
  }
  const active = item.children.some((c) => pathname.startsWith(c.to));
  return (
    <>
      <Button onClick={(e) => setAnchor(e.currentTarget)} endIcon={<ExpandMoreIcon />} aria-haspopup="true" aria-expanded={Boolean(anchor)}
        sx={{ ...baseSx, ...(active && { color: 'primary.main', bgcolor: 'rgba(31,58,147,.1)', boxShadow: 'inset 0 -3px 0 #ff8f1f' }) }}>
        {t(`nav.${item.key}`)}
      </Button>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)} slotProps={{ paper: { sx: { mt: 1, borderRadius: 3, minWidth: 200, boxShadow: '0 20px 40px rgba(20,39,102,.2)' } } }}>
        {item.children.map((c) => (
          <MenuItem key={c.to} component={RouterLink} to={c.to} onClick={() => setAnchor(null)} sx={{ fontWeight: 600 }}>
            {t(`nav.${c.key}`)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

function MobileItem({ item, t, close }) {
  const [open, setOpen] = useState(false);
  if (!item.children) {
    return (
      <ListItemButton component={NavLink} to={item.to} end={item.to === '/'} onClick={close} sx={{ borderRadius: 3, '&.active': { bgcolor: 'rgba(31,58,147,.1)', color: 'primary.main' } }}>
        <ListItemText primary={t(`nav.${item.key}`)} primaryTypographyProps={{ fontWeight: 600 }} />
      </ListItemButton>
    );
  }
  return (
    <>
      <ListItemButton onClick={() => setOpen((o) => !o)} sx={{ borderRadius: 3 }}>
        <ListItemText primary={t(`nav.${item.key}`)} primaryTypographyProps={{ fontWeight: 700 }} />
        <ExpandMoreIcon sx={{ transform: open ? 'rotate(180deg)' : 'none', transition: '.2s' }} />
      </ListItemButton>
      <Collapse in={open} unmountOnExit>
        <List disablePadding sx={{ pl: 2 }}>
          {item.children.map((c) => (
            <ListItemButton key={c.to} component={NavLink} to={c.to} onClick={close} sx={{ borderRadius: 3, '&.active': { bgcolor: 'rgba(31,58,147,.1)', color: 'primary.main' } }}>
              <ListItemText primary={t(`nav.${c.key}`)} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
}

export default function Header() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [open, setOpen] = useState(false);
  const { t } = useLang();

  return (
    <>
      {/* Top info strip */}
      <Box sx={{ background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`, color: '#fff', display: { xs: 'none', md: 'block' } }}>
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.6 }}>
            <Stack direction="row" spacing={3} sx={{ fontSize: 13 }}>
              <Stack direction="row" spacing={0.7} alignItems="center"><PhoneIcon sx={{ fontSize: 16 }} /><span>{site.phone}</span></Stack>
              <Stack direction="row" spacing={0.7} alignItems="center"><EmailIcon sx={{ fontSize: 16 }} /><span>{site.email}</span></Stack>
            </Stack>
            <LangToggle />
          </Stack>
        </Container>
      </Box>

      <AppBar position="sticky" color="inherit" elevation={0}
        sx={{ bgcolor: 'rgba(255,255,255,.88)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(31,58,147,.1)', boxShadow: '0 8px 24px rgba(20,39,102,.10)' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, lg: 72 }, gap: 1 }}>
            <Stack component={RouterLink} to="/" direction="row" alignItems="center" spacing={1.2} sx={{ textDecoration: 'none', color: 'inherit', mr: 'auto' }} aria-label="Chikhli–Moshi Federation home">
              <Box sx={{ filter: 'drop-shadow(0 6px 6px rgba(20,39,102,.3))', display: 'flex' }}><LogoMark size={44} /></Box>
              <Box>
                <Typography sx={{ fontWeight: 800, lineHeight: 1.1, fontSize: { xs: 15, sm: 17 }, color: 'primary.main' }}>Chikhli–Moshi</Typography>
                <Typography sx={{ fontWeight: 600, lineHeight: 1.1, fontSize: { xs: 11, sm: 12 }, color: 'text.secondary', letterSpacing: '.18em' }}>FEDERATION</Typography>
              </Box>
            </Stack>

            {isDesktop && (
              <Stack direction="row" spacing={0.3} component="nav" aria-label="Primary">
                {NAV.map((item) => <DesktopItem key={item.key} item={item} t={t} />)}
              </Stack>
            )}
            {isDesktop && (
              <Button component={RouterLink} to="/membership" variant="contained" color="secondary" endIcon={<ArrowForwardIcon />} sx={{ ml: 1.5 }}>
                {t('cta.join')}
              </Button>
            )}
            {!isDesktop && (
              <>
                <Box sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiToggleButton-root': { color: 'primary.main', borderColor: 'rgba(31,58,147,.3)' } }}><LangToggle /></Box>
                <IconButton onClick={() => setOpen(true)} aria-label="Open menu" edge="end" sx={{ bgcolor: 'rgba(31,58,147,.08)' }}><MenuIcon /></IconButton>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={open && !isDesktop} onClose={() => setOpen(false)} PaperProps={{ sx: { width: { xs: '86vw', sm: 340 }, borderRadius: '24px 0 0 24px', p: 2 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}><LogoMark size={36} /><Typography sx={{ fontWeight: 800, color: 'primary.main' }}>CMF</Typography></Stack>
          <IconButton onClick={() => setOpen(false)} aria-label="Close menu"><CloseIcon /></IconButton>
        </Stack>
        <Divider sx={{ mb: 1 }} />
        <List component="nav" aria-label="Mobile">
          {NAV.map((item) => <MobileItem key={item.key} item={item} t={t} close={() => setOpen(false)} />)}
        </List>
        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Box sx={{ mb: 2, '& .MuiToggleButton-root': { color: 'primary.main', borderColor: 'rgba(31,58,147,.3)' } }}><LangToggle size="medium" /></Box>
          <Button fullWidth component={RouterLink} to="/membership" onClick={() => setOpen(false)} variant="contained" color="secondary" size="large">{t('cta.join')}</Button>
        </Box>
      </Drawer>
    </>
  );
}
