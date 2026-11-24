import { Box } from '@mui/material';

const SHAPES = [
  { top: '8%', left: '4%', s: 70, c: ['#ffb04d', '#ff8f1f'], r: '14px', dur: 9, delay: 0 },
  { top: '62%', left: '10%', s: 38, c: ['#6f86e0', '#4a63c0'], r: '50%', dur: 11, delay: 1 },
  { top: '15%', left: '88%', s: 54, c: ['#7ee0cf', '#0f9d8a'], r: '50%', dur: 10, delay: 2 },
  { top: '72%', left: '84%', s: 80, c: ['#ffd29b', '#ff8f1f'], r: '22px', dur: 12, delay: .5 },
  { top: '40%', left: '48%', s: 26, c: ['#ffb0c6', '#e8527a'], r: '8px', dur: 8, delay: 1.5 },
];

/** Soft floating 3D-ish blobs behind hero sections. Purely decorative. */
export function FloatingShapes({ opacity = 0.9 }) {
  return (
    <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {SHAPES.map((s, i) => (
        <span
          key={i}
          className="float-shape"
          style={{
            top: s.top, left: s.left, width: s.s, height: s.s, borderRadius: s.r, opacity,
            background: `radial-gradient(circle at 30% 25%, ${s.c[0]}, ${s.c[1]})`,
            boxShadow: `0 ${s.s / 4}px ${s.s / 2}px ${s.c[1]}55, inset -6px -8px 14px rgba(0,0,0,.18)`,
            '--dur': `${s.dur}s`, '--delay': `${s.delay}s`, '--r': `${i * 12}deg`,
          }}
        />
      ))}
    </Box>
  );
}

/** A small spinning cube; faces are plain gradients. */
export function Cube3D({ size = 90, colors = ['#ff8f1f', '#6f86e0', '#0f9d8a', '#e8527a', '#1f3a93', '#ffb04d'], children }) {
  const h = size / 2;
  const t = [`translateZ(${h}px)`, `rotateY(180deg) translateZ(${h}px)`, `rotateY(90deg) translateZ(${h}px)`, `rotateY(-90deg) translateZ(${h}px)`, `rotateX(90deg) translateZ(${h}px)`, `rotateX(-90deg) translateZ(${h}px)`];
  return (
    <Box aria-hidden="true" sx={{ perspective: 600, width: size, height: size }}>
      <div className="cube" style={{ width: size, height: size }}>
        {t.map((tr, i) => (
          <div key={i} style={{ transform: tr, background: `linear-gradient(135deg, ${colors[i]}, ${colors[(i + 1) % 6]})`, opacity: 0.94 }}>
            {i === 0 ? children : null}
          </div>
        ))}
      </div>
    </Box>
  );
}

/** Isometric logo mark. */
export function LogoMark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Chikhli–Moshi Federation logo">
      <polygon points="32,4 58,18 32,32 6,18" fill="#8ea2ee" />
      <polygon points="6,18 32,32 32,60 6,46" fill="#1f3a93" />
      <polygon points="58,18 32,32 32,60 58,46" fill="#ff8f1f" />
      <g fill="#fff" opacity=".9">
        <rect x="11" y="28" width="5" height="5" transform="skewY(30)" />
        <rect x="19" y="32" width="5" height="5" transform="skewY(30)" />
        <rect x="11" y="38" width="5" height="5" transform="skewY(30)" />
        <rect x="19" y="42" width="5" height="5" transform="skewY(30)" />
      </g>
      <g fill="#fff" opacity=".85">
        <rect x="40" y="45" width="5" height="5" transform="skewY(-30)" />
        <rect x="48" y="41" width="5" height="5" transform="skewY(-30)" />
      </g>
    </svg>
  );
}
