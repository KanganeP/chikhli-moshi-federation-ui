import { useState } from 'react';
import { Box, Typography, Stack, Avatar } from '@mui/material';
import Card3D from './Card3D';
import { useCountUp, useInView } from '../utils';
import { brand } from '../theme';

/** Version-proof responsive CSS grid (avoids MUI Grid API differences). */
export function CardGrid({ cols = { xs: 1, sm: 2, md: 3 }, gap = 3, children, sx }) {
  const template = Object.fromEntries(Object.entries(cols).map(([k, v]) => [k, `repeat(${v}, minmax(0, 1fr))`]));
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: template, gap, ...sx }}>
      {children}
    </Box>
  );
}

export function SectionTitle({ eyebrow, title, subtitle, align = 'left', light = false, action }) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ sm: 'flex-end' }}
      justifyContent="space-between"
      spacing={2}
      sx={{ mb: { xs: 3, md: 4 }, textAlign: align }}
    >
      <Box sx={{ maxWidth: 680, mx: align === 'center' ? 'auto' : 0 }}>
        {eyebrow && (
          <Typography variant="overline" sx={{ color: light ? 'secondary.main' : 'secondary.dark' }}>
            {eyebrow}
          </Typography>
        )}
        <Typography variant="h3" component="h2" sx={{ color: light ? '#fff' : 'text.primary' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ mt: 1, color: light ? 'rgba(255,255,255,.8)' : 'text.secondary' }}>{subtitle}</Typography>
        )}
      </Box>
      {action}
    </Stack>
  );
}

/** 3D tile with an icon "block" that floats above the surface. */
export function IconBlock({ children, color = brand.indigo, size = 56 }) {
  return (
    <Box
      className="pop"
      sx={{
        width: size, height: size, borderRadius: '16px', display: 'grid', placeItems: 'center', color: '#fff',
        background: `linear-gradient(145deg, ${color}, ${color}cc)`,
        boxShadow: `0 6px 0 ${color}88, 0 14px 22px ${color}55`,
      }}
    >
      {children}
    </Box>
  );
}

export function StatCard({ value, label, suffix }) {
  const [ref, seen] = useInView();
  const n = useCountUp(value, seen);
  return (
    <Card3D ref={ref} intensity={10} sx={{ p: { xs: 2, md: 3 }, textAlign: 'center' }}>
      <Typography className="pop" variant="h3" component="p" sx={{ color: 'primary.main', fontWeight: 800 }}>
        {n.toLocaleString('en-IN')}{suffix}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{label}</Typography>
    </Card3D>
  );
}

/** Flip card: hover on desktop, tap/Enter on touch devices. */
export function FlipCard({ front, back, height = 260 }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <Box
      className={`flip ${flipped ? 'is-flipped' : ''}`}
      sx={{ height, cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped((f) => !f); } }}
    >
      <div className="flip-inner">
        <Box className="flip-face" sx={{ bgcolor: '#fff', boxShadow: '0 12px 32px rgba(20,39,102,.14)', border: '1px solid rgba(31,58,147,.08)' }}>{front}</Box>
        <Box className="flip-face flip-back" sx={{ background: `linear-gradient(150deg, ${brand.indigo}, ${brand.indigoDeep})`, color: '#fff', boxShadow: '0 12px 32px rgba(20,39,102,.3)' }}>{back}</Box>
      </div>
    </Box>
  );
}

export function InitialsAvatar({ text, size = 72, color = brand.indigo }) {
  return (
    <Avatar sx={{ width: size, height: size, fontWeight: 800, bgcolor: color, boxShadow: `0 5px 0 ${brand.indigoDeep}55, 0 12px 20px rgba(20,39,102,.25)` }}>
      {text}
    </Avatar>
  );
}

/** Date tile styled like a tear-off calendar block. */
export function DateTile({ iso }) {
  const dt = new Date(iso);
  return (
    <Box sx={{ width: 64, flexShrink: 0, textAlign: 'center', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 5px 0 #c8d0ee, 0 12px 20px rgba(20,39,102,.18)', bgcolor: '#fff' }}>
      <Box sx={{ bgcolor: 'secondary.main', color: '#1b1205', fontSize: 11, fontWeight: 800, letterSpacing: '.1em', py: .4 }}>
        {dt.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase()}
      </Box>
      <Typography sx={{ fontSize: 26, fontWeight: 800, lineHeight: 1.1, color: 'primary.main', pt: .4 }}>{dt.getDate()}</Typography>
      <Typography sx={{ fontSize: 10, color: 'text.secondary', pb: .6 }}>{dt.getFullYear()}</Typography>
    </Box>
  );
}
