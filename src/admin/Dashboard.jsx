import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Chip, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { ApartmentIcon, CampaignIcon, EventIcon, ReportProblemIcon, GroupsIcon, PhotoLibraryIcon, CardMembershipIcon, ArrowForwardIcon } from '../icons';
import { admin, fmtD, fmtDT } from './adminApi';
import { ISSUE_STATUS } from './resources';

function StatCard({ to, icon, title, total, chips, accent }) {
  return (
    <Paper component={RouterLink} to={to} sx={{ p: 2.2, textDecoration: 'none', color: 'inherit', display: 'block', borderTop: `4px solid ${accent}`, transition: 'transform .15s, box-shadow .15s', '&:hover': { transform: 'translateY(-3px)', boxShadow: 6 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography color="text.secondary" sx={{ fontWeight: 600 }}>{title}</Typography>
        <Box sx={{ color: accent, display: 'flex' }}>{icon}</Box>
      </Stack>
      <Typography variant="h3" component="p" sx={{ my: 0.5, fontVariantNumeric: 'tabular-nums' }}>{total}</Typography>
      <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap>{chips.map(([l, v, c]) => <Chip key={l} size="small" color={c || 'default'} variant={c ? 'filled' : 'outlined'} label={`${l} ${v}`} />)}</Stack>
    </Paper>
  );
}

export default function Dashboard() {
  const [s, setS] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { admin.stats().then(setS).catch((e) => setErr(e.message)); }, []);
  if (err) return <Alert severity="error">{err}</Alert>;
  if (!s) return <Box sx={{ py: 8, display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>;
  const st = s.issueStatus, totalIssues = Object.values(st).reduce((a, b) => a + b, 0) || 1;

  return (
    <Box>
      <Typography variant="h4" component="h1">Dashboard</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>Everything on the public website, with counts of what is active, scheduled and waiting for you.</Typography>

      {st.new > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }} action={<Button component={RouterLink} to="/admin/issues" color="inherit" size="small">Review</Button>}>
          {st.new} new issue{st.new > 1 ? 's' : ''} waiting to be read{s.memberStatus.Pending ? `, and ${s.memberStatus.Pending} membership application${s.memberStatus.Pending > 1 ? 's' : ''} to approve` : ''}.
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0,1fr))', lg: 'repeat(3, minmax(0,1fr))', xl: 'repeat(4, minmax(0,1fr))' }, gap: 2, mb: 3 }}>
        <StatCard to="/admin/societies" accent="#1f3a93" icon={<ApartmentIcon />} title="Societies" total={s.societies.total} chips={[['Active', s.societies.active, 'success'], ['Inactive', s.societies.inactive], ['Flats', s.totalFlats.toLocaleString('en-IN')]]} />
        <StatCard to="/admin/members" accent="#0f9d8a" icon={<CardMembershipIcon />} title="Members" total={s.members.total} chips={[['Active', s.memberStatus.Active, 'success'], ['Pending', s.memberStatus.Pending, s.memberStatus.Pending ? 'warning' : undefined], ['Expired', s.memberStatus.Expired]]} />
        <StatCard to="/admin/notices" accent="#ff8f1f" icon={<CampaignIcon />} title="Notices" total={s.notices.total} chips={[['Live', s.noticeState.live, 'success'], ['Scheduled', s.noticeState.scheduled, s.noticeState.scheduled ? 'info' : undefined], ['Draft', s.noticeState.draft]]} />
        <StatCard to="/admin/events" accent="#e8527a" icon={<EventIcon />} title="Events" total={s.events.total} chips={[['Upcoming', s.eventState.upcoming, 'success'], ['Past', s.eventState.past], ['Draft', s.eventState.draft]]} />
        <StatCard to="/admin/issues" accent="#d9381e" icon={<ReportProblemIcon />} title="Issues" total={s.issues.total} chips={[['New', st.new, st.new ? 'error' : undefined], ['In progress', st.in_progress, st.in_progress ? 'warning' : undefined], ['Fixed', st.fixed, 'success']]} />
        <StatCard to="/admin/committee" accent="#7a3fb0" icon={<GroupsIcon />} title="Committee" total={s.committee.total} chips={[['Active', s.committee.active, 'success'], ['Inactive', s.committee.inactive]]} />
        <StatCard to="/admin/gallery" accent="#2a7fd1" icon={<PhotoLibraryIcon />} title="Gallery photos" total={s.gallery.total} chips={[['Active', s.gallery.active, 'success'], ['Inactive', s.gallery.inactive]]} />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0,1fr))' }, gap: 2 }}>
        <Paper sx={{ p: 2.5 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Issues by status</Typography>
          <Stack spacing={1.6}>
            {Object.entries(ISSUE_STATUS).map(([k, [label, color]]) => (
              <Box key={k}>
                <Stack direction="row" justifyContent="space-between"><Typography variant="body2">{label}</Typography><Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>{st[k]}</Typography></Stack>
                <Box sx={{ height: 10, borderRadius: 5, bgcolor: 'action.hover', overflow: 'hidden' }}><Box sx={{ height: '100%', width: `${(st[k] / totalIssues) * 100}%`, bgcolor: `${color}.main`, borderRadius: 5, transition: 'width .5s' }} /></Box>
              </Box>
            ))}
          </Stack>
        </Paper>
        <Paper sx={{ p: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6">Latest issues</Typography>
            <Button component={RouterLink} to="/admin/issues" size="small" endIcon={<ArrowForwardIcon />}>All issues</Button>
          </Stack>
          {s.recentIssues.length === 0 && <Typography color="text.secondary">No issues reported yet.</Typography>}
          <Stack divider={<Box sx={{ borderTop: '1px solid', borderColor: 'divider' }} />}>
            {s.recentIssues.map((i) => (
              <Stack key={i.id} direction="row" spacing={1.5} alignItems="center" sx={{ py: 1 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 600 }} noWrap>{i.category} · {i.society || i.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{fmtDT(i.createdAt)}</Typography>
                </Box>
                <Chip size="small" color={ISSUE_STATUS[i.status]?.[1]} label={ISSUE_STATUS[i.status]?.[0]} />
              </Stack>
            ))}
          </Stack>
        </Paper>
        <Paper sx={{ p: 2.5, gridColumn: { lg: '1 / -1' } }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Memberships ending within 30 days</Typography>
          {s.expiring.length === 0 ? <Typography color="text.secondary">None. All active memberships are valid for more than 30 days.</Typography> : (
            <Stack divider={<Box sx={{ borderTop: '1px solid', borderColor: 'divider' }} />}>
              {s.expiring.map((m) => (
                <Stack key={m.id} direction="row" justifyContent="space-between" spacing={2} sx={{ py: 1 }}>
                  <Typography sx={{ fontWeight: 600, minWidth: 0 }} noWrap>{m.society || m.name}</Typography>
                  <Typography color={new Date(m.expiryDate) < new Date() ? 'error' : 'warning.main'} sx={{ whiteSpace: 'nowrap' }}>{fmtD(m.expiryDate)}</Typography>
                </Stack>
              ))}
            </Stack>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
