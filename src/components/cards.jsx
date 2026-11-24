import { Box, Typography, Chip, Stack, Button } from '@mui/material';
import Card3D from './Card3D';
import { DateTile, IconBlock } from './ui';
import { fmtDate, daysSince, downloadIcs } from '../utils';
import * as I from '../icons';
import { brand } from '../theme';

const catColor = { General: 'default', Meeting: 'primary', Civic: 'secondary', Legal: 'info', Safety: 'error', Community: 'success', Health: 'success' };
const iconMap = {
  Gavel: I.GavelIcon, HomeWork: I.HomeWorkIcon, AccountBalance: I.AccountBalanceIcon, Water: I.WaterDropIcon,
  Security: I.SecurityIcon, Recycling: I.RecyclingIcon, LocalPolice: I.LocalPoliceIcon,
  LocalFireDepartment: I.LocalFireDepartmentIcon, LocalHospital: I.LocalHospitalIcon, SupportAgent: I.SupportAgentIcon,
};
export const getIcon = (name) => iconMap[name] || I.InfoIcon;
const palette = [brand.indigo, brand.saffronDark, brand.teal, brand.rose, '#2a7fd1', '#7a3fb0'];

export function ServiceCard({ icon, title, text, index = 0 }) {
  const Icon = getIcon(icon);
  return (
    <Card3D sx={{ p: 3, height: '100%' }}>
      <IconBlock color={palette[index % palette.length]}><Icon /></IconBlock>
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }} className="pop-sm">{title}</Typography>
      <Typography variant="body2" color="text.secondary">{text}</Typography>
    </Card3D>
  );
}

export function SocietyCard({ s, onOpen }) {
  return (
    <Card3D sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" spacing={1.5} alignItems="center" className="pop-sm">
        <IconBlock size={48} color={palette[s.name.length % palette.length]}><I.ApartmentIcon /></IconBlock>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, lineHeight: 1.25 }}>{s.name}</Typography>
          <Typography variant="body2" color="text.secondary">{s.area}</Typography>
        </Box>
      </Stack>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ my: 2 }}>
        <Chip size="small" label={s.type} />
        <Chip size="small" variant="outlined" label={`${s.flats} flats`} />
        <Chip size="small" variant="outlined" label={`Since ${s.since}`} />
      </Stack>
      {onOpen && <Button sx={{ mt: 'auto', alignSelf: 'flex-start' }} onClick={() => onOpen(s)} endIcon={<I.ArrowForwardIcon />}>Details</Button>}
    </Card3D>
  );
}

export function NoticeRow({ n, expanded }) {
  const isNew = daysSince(n.date) <= 14;
  return (
    <Card3D intensity={2} sx={{ p: 2.5 }}>
      <Stack direction="row" spacing={2}>
        <DateTile iso={n.date} />
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 0.5 }}>
            <Chip size="small" color={catColor[n.category] || 'default'} label={n.category} />
            {isNew && <Chip size="small" color="secondary" label="New" />}
          </Stack>
          <Typography sx={{ fontWeight: 700, lineHeight: 1.3 }}>{n.title}</Typography>
          {expanded && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{n.body}</Typography>}
          {expanded && n.file && <Button size="small" component="a" href={n.file} target="_blank" rel="noopener noreferrer" startIcon={<I.DownloadIcon />} sx={{ mt: 1 }}>View attachment</Button>}
        </Box>
      </Stack>
    </Card3D>
  );
}

export function EventCard({ ev, past }) {
  const share = `https://wa.me/?text=${encodeURIComponent(`${ev.title} – ${fmtDate(ev.date)} at ${ev.venue}`)}`;
  return (
    <Card3D intensity={4} sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', opacity: past ? 0.92 : 1 }}>
      <Stack direction="row" spacing={2}>
        <DateTile iso={ev.date} />
        <Box sx={{ minWidth: 0 }}>
          <Chip size="small" color={catColor[ev.tag] || 'default'} label={ev.tag} sx={{ mb: 0.7 }} />
          <Typography sx={{ fontWeight: 700, lineHeight: 1.25 }}>{ev.title}</Typography>
        </Box>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ my: 1.5 }}>{ev.summary}</Typography>
      <Stack spacing={0.4} sx={{ fontSize: 13, color: 'text.secondary', mb: 1.5 }}>
        <Stack direction="row" spacing={1} alignItems="center"><I.AccessTimeIcon sx={{ fontSize: 16 }} />{new Date(ev.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</Stack>
        <Stack direction="row" spacing={1} alignItems="center"><I.LocationOnIcon sx={{ fontSize: 16 }} />{ev.venue}</Stack>
      </Stack>
      {!past && (
        <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
          <Button size="small" variant="outlined" startIcon={<I.CalendarMonthIcon />} onClick={() => downloadIcs(ev)}>Add to calendar</Button>
          <Button size="small" component="a" href={share} target="_blank" rel="noopener noreferrer" startIcon={<I.ShareIcon />}>Share</Button>
        </Stack>
      )}
    </Card3D>
  );
}
