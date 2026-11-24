import { Box } from '@mui/material';

// x/z offsets are from the plate centre; sizes in px. Colours echo the brand palette.
const BUILDINGS = [
  { x: -125, z: -110, w: 88, d: 88, h: 210, c: '#4a63c0', win: '#dbe6ff' },
  { x: 5, z: -120, w: 84, d: 84, h: 290, c: '#1f3a93', win: '#ffe9b0' },
  { x: 125, z: -100, w: 90, d: 90, h: 175, c: '#ff8f1f', win: '#fff3d6' },
  { x: -135, z: 25, w: 80, d: 80, h: 150, c: '#0f9d8a', win: '#d7fff6' },
  { x: -5, z: 15, w: 104, d: 104, h: 235, c: '#6f86e0', win: '#ffffff' },
  { x: 130, z: 35, w: 80, d: 80, h: 125, c: '#e8527a', win: '#ffe3ec' },
  { x: -70, z: 145, w: 70, d: 70, h: 95, c: '#2a7fd1', win: '#e3f2ff' },
  { x: 70, z: 150, w: 70, d: 70, h: 80, c: '#ffb04d', win: '#fff6df' },
];

const PLATE = 470;

function windows(c, win) {
  return {
    backgroundColor: win,
    backgroundImage: `repeating-linear-gradient(0deg, ${c} 0 11px, transparent 11px 24px), repeating-linear-gradient(90deg, ${c} 0 12px, transparent 12px 26px)`,
  };
}

function Block({ x, z, w, d, h, c, win }) {
  const face = (extra) => ({ ...windows(c, win), ...extra });
  return (
    <div className="block" style={{ width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2, transform: `translate3d(${x}px, ${-h / 2}px, ${z}px)` }}>
      <div className="face" style={face({ width: w, height: h, transform: `translateZ(${d / 2}px)` })} />
      <div className="face" style={face({ width: w, height: h, transform: `rotateY(180deg) translateZ(${d / 2}px)`, filter: 'brightness(.7)' })} />
      <div className="face" style={face({ width: d, height: h, left: (w - d) / 2, transform: `rotateY(90deg) translateZ(${w / 2}px)`, filter: 'brightness(.82)' })} />
      <div className="face" style={face({ width: d, height: h, left: (w - d) / 2, transform: `rotateY(-90deg) translateZ(${w / 2}px)`, filter: 'brightness(.9)' })} />
      <div className="face" style={{ width: w, height: d, top: (h - d) / 2, background: `linear-gradient(135deg, ${c}, #fff 220%)`, transform: `rotateX(90deg) translateZ(${h / 2}px)`, filter: 'brightness(1.12)' }} />
    </div>
  );
}

/** Slowly rotating 3D "neighbourhood" built from pure CSS transforms. Decorative. */
export default function CityScene({ sx }) {
  return (
    <Box
      aria-hidden="true"
      sx={{ position: 'relative', height: { xs: 290, sm: 380, md: 470 }, display: 'grid', placeItems: 'center', ...sx }}
    >
      <Box
        sx={{
          position: 'relative', width: 0, height: 0, perspective: '1500px',
          transform: { xs: 'translateY(30px) scale(.58)', sm: 'translateY(30px) scale(.76)', md: 'translateY(34px) scale(.95)' },
        }}
      >
        <div className="city spin-city">
          <div className="ground" style={{ width: PLATE, height: PLATE, marginLeft: -PLATE / 2, marginTop: -PLATE / 2, transform: 'rotateX(90deg)' }} />
          {BUILDINGS.map((b, i) => <Block key={i} {...b} />)}
        </div>
      </Box>
    </Box>
  );
}
