import { forwardRef, useRef } from 'react';
import { Box } from '@mui/material';

const canTilt = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** A surface that tilts toward the pointer (desktop only) and shows a light glare. */
const Card3D = forwardRef(function Card3D({ children, intensity = 7, sx, component = 'div', ...rest }, fwd) {
  const local = useRef(null);
  const ref = fwd || local;
  const enabled = useRef(canTilt());

  const move = (e) => {
    if (!enabled.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const s = ref.current.style;
    s.setProperty('--ry', `${((px - 0.5) * intensity * 2).toFixed(2)}deg`);
    s.setProperty('--rx', `${(-(py - 0.5) * intensity * 2).toFixed(2)}deg`);
    s.setProperty('--gx', `${(px * 100).toFixed(0)}%`);
    s.setProperty('--gy', `${(py * 100).toFixed(0)}%`);
  };
  const leave = () => {
    const s = ref.current?.style;
    if (!s) return;
    s.setProperty('--rx', '0deg');
    s.setProperty('--ry', '0deg');
  };

  return (
    <Box
      ref={ref}
      component={component}
      className="tilt"
      onMouseMove={move}
      onMouseLeave={leave}
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 5,
        border: '1px solid rgba(31,58,147,.08)',
        boxShadow: '0 1px 0 #fff inset, 0 12px 32px rgba(20,39,102,.12), 0 3px 8px rgba(20,39,102,.06)',
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
});

export default Card3D;
