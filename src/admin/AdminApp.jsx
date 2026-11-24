import { useEffect, useState } from 'react';
import { Link as RouterLink, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Alert, AppBar, Badge, Box, Button, CircularProgress, Container, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, TextField, Toolbar, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ApartmentIcon, CampaignIcon, CardMembershipIcon, DashboardIcon, EventIcon, GroupsIcon, LockIcon, LogoutIcon, MenuIcon, PhotoLibraryIcon, PublicIcon, ReportProblemIcon } from '../icons';
import { LogoMark } from '../components/Decor';
import { admin, getToken, setToken } from './adminApi';
import ResourceManager from './ResourceManager';
import GalleryAdmin from './GalleryAdmin';
import Dashboard from './Dashboard';
import { cfg } from './resources';

const NAV = [
  ['/admin', 'Dashboard', DashboardIcon, true],
  ['/admin/societies', 'Societies', ApartmentIcon],
  ['/admin/members', 'Membership', CardMembershipIcon],
  ['/admin/notices', 'Notices', CampaignIcon],
  ['/admin/events', 'Events', EventIcon],
  ['/admin/issues', 'Issues', ReportProblemIcon],
  ['/admin/committee', 'Committee', GroupsIcon],
  ['/admin/gallery', 'Gallery', PhotoLibraryIcon],
];
const W = 240;

function Login({ onDone }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('');
    try { const r = await admin.login(pw); setToken(r.token); onDone(); } catch (x) { setErr(x.message); } finally { setBusy(false); }
  };
  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'grid', alignItems: 'center', py: 4 }}>
      <Paper component="form" onSubmit={submit} sx={{ p: { xs: 3, sm: 4 } }}>
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1.5} alignItems="center"><LogoMark size={44} /><Box><Typography variant="h5" sx={{ lineHeight: 1.1 }}>Federation admin</Typography><Typography variant="body2" color="text.secondary">Chikhli–Moshi Federation</Typography></Box></Stack>
          <TextField id="admin-pw" label="Admin password" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus required InputProps={{ startAdornment: <LockIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> }} />
          {err && <Alert severity="error">{err}</Alert>}
          <Button type="submit" variant="contained" size="large" disabled={busy || !pw} startIcon={busy ? <CircularProgress size={18} color="inherit" /> : null}>Sign in</Button>
          <Button component={RouterLink} to="/" size="small">Back to website</Button>
        </Stack>
      </Paper>
    </Container>
  );
}

function Shell({ onLogout }) {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const [open, setOpen] = useState(false);
  const [newIssues, setNew] = useState(0);
  const { pathname } = useLocation();
  useEffect(() => { admin.stats().then((s) => setNew(s.issueStatus.new)).catch(() => {}); }, [pathname]);

  const nav = (
    <Box sx={{ width: W, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack direction="row" spacing={1.2} alignItems="center" sx={{ p: 2.2 }}><LogoMark size={36} /><Typography sx={{ fontWeight: 800 }}>CMF Admin</Typography></Stack>
      <List sx={{ px: 1, flex: 1 }} component="nav" aria-label="Admin sections">
        {NAV.map(([to, label, Icon, end]) => (
          <ListItemButton key={to} component={NavLink} to={to} end={end} onClick={() => setOpen(false)} sx={{ borderRadius: 2, mb: 0.5, '&.active': { bgcolor: 'primary.main', color: '#fff', '& .MuiListItemIcon-root': { color: '#fff' } } }}>
            <ListItemIcon sx={{ minWidth: 40 }}>{to === '/admin/issues' ? <Badge color="error" badgeContent={newIssues}><Icon /></Badge> : <Icon />}</ListItemIcon>
            <ListItemText primary={label} primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>
        ))}
      </List>
      <Stack spacing={1} sx={{ p: 2 }}>
        <Button component={RouterLink} to="/" target="_blank" startIcon={<PublicIcon />} sx={{ justifyContent: 'flex-start' }}>View website</Button>
        <Button color="inherit" onClick={onLogout} startIcon={<LogoutIcon />} sx={{ justifyContent: 'flex-start' }}>Sign out</Button>
      </Stack>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {desktop ? (
        <Drawer variant="permanent" PaperProps={{ sx: { width: W, borderRight: '1px solid', borderColor: 'divider' } }} sx={{ width: W, flexShrink: 0 }}>{nav}</Drawer>
      ) : (
        <>
          <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
            <Toolbar>
              <IconButton edge="start" onClick={() => setOpen(true)} aria-label="Open menu"><Badge color="error" variant="dot" invisible={!newIssues}><MenuIcon /></Badge></IconButton>
              <Typography sx={{ fontWeight: 800, ml: 1 }}>CMF Admin</Typography>
            </Toolbar>
          </AppBar>
          <Drawer open={open} onClose={() => setOpen(false)}>{nav}</Drawer>
        </>
      )}
      <Box component="main" sx={{ flex: 1, minWidth: 0, p: { xs: 1.5, sm: 3 }, pt: { xs: 10, md: 4 } }}>
        <Routes>
          <Route index element={<Dashboard />} />
          {['societies', 'members', 'notices', 'events', 'issues', 'committee'].map((k) => <Route key={k} path={k} element={<ResourceManager cfg={cfg[k]} />} />)}
          <Route path="gallery" element={<GalleryAdmin />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default function AdminApp() {
  const [authed, setAuthed] = useState(Boolean(getToken()));
  useEffect(() => {
    document.title = 'Admin | Chikhli–Moshi Federation';
    const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex,nofollow'; document.head.appendChild(m);
    const lost = () => setAuthed(false);
    window.addEventListener('cmf-auth-lost', lost);
    return () => { window.removeEventListener('cmf-auth-lost', lost); m.remove(); };
  }, []);
  if (!authed) return <Login onDone={() => setAuthed(true)} />;
  return <Shell onLogout={() => { setToken(''); setAuthed(false); }} />;
}
