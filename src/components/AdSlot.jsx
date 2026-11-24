import { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useLang } from '../i18n';

const env = import.meta.env;
export const ADS_CLIENT = env.VITE_ADSENSE_CLIENT;

const SLOT_IDS = {
  leaderboard: env.VITE_AD_SLOT_LEADERBOARD,
  anchor: env.VITE_AD_SLOT_LEADERBOARD,
  rectangle: env.VITE_AD_SLOT_RECTANGLE,
  sidebar: env.VITE_AD_SLOT_SIDEBAR,
  infeed: env.VITE_AD_SLOT_INFEED,
};

// Reserved heights prevent layout shift (CLS) while ads load.
const SPECS = {
  leaderboard: { minHeight: { xs: 100, sm: 110, md: 110 }, label: 'Leaderboard · responsive banner', maxWidth: 970 },
  rectangle: { minHeight: { xs: 260, md: 280 }, label: 'Rectangle · 336×280 / responsive', maxWidth: 728 },
  sidebar: { minHeight: 600, label: 'Sidebar · 300×600 / 300×250', maxWidth: 336 },
  infeed: { minHeight: { xs: 150, md: 120 }, label: 'In-feed · responsive', maxWidth: 970 },
  anchor: { minHeight: 56, label: 'Mobile anchor · 320×50', maxWidth: 360 },
};

// Show labelled placeholders until AdSense is configured (always in dev, or if opted in).
const SHOW_PLACEHOLDERS = env.DEV || env.VITE_SHOW_AD_PLACEHOLDERS === 'true';

function loadScript() {
  if (!ADS_CLIENT || document.querySelector('script[data-cmf-adsense]')) return;
  const s = document.createElement('script');
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CLIENT}`;
  s.setAttribute('data-cmf-adsense', '1');
  document.head.appendChild(s);
}

export function getConsent() {
  try { return localStorage.getItem('cmf-consent'); } catch { return null; }
}

/**
 * Google AdSense responsive unit with reserved space.
 * type: 'leaderboard' | 'rectangle' | 'sidebar' | 'infeed' | 'anchor'
 */
export default function AdSlot({ type = 'rectangle', sx }) {
  const { t } = useLang();
  const { pathname } = useLocation();
  const insRef = useRef(null);
  const spec = SPECS[type];
  const slot = SLOT_IDS[type];
  const configured = Boolean(ADS_CLIENT && slot);

  useEffect(() => {
    if (!configured) return;
    loadScript();
    const ins = insRef.current;
    if (!ins || ins.dataset.adsbygoogleStatus) return;
    try {
      const q = (window.adsbygoogle = window.adsbygoogle || []);
      q.requestNonPersonalizedAds = getConsent() === 'essential' ? 1 : 0;
      q.push({});
    } catch (e) {
      // Ad blockers or duplicate pushes should never break the page.
    }
  }, [configured, pathname]);

  if (!configured && !SHOW_PLACEHOLDERS) return null;

  const isAnchor = type === 'anchor';
  return (
    <Box
      component="aside"
      aria-label="Advertisement"
      data-ad-type={type}
      sx={{ width: '100%', maxWidth: spec.maxWidth, mx: 'auto', my: isAnchor ? 0 : { xs: 2.5, md: 3.5 }, ...sx }}
    >
      {!isAnchor && (
        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'text.secondary', letterSpacing: '.12em', textTransform: 'uppercase', fontSize: 10, mb: 0.5 }}>
          {t('ad.label')}
        </Typography>
      )}
      <Box className="ad-frame" sx={{ minHeight: spec.minHeight, display: 'grid', placeItems: 'center' }}>
        {configured ? (
          isAnchor ? (
            <ins key={pathname} ref={insRef} className="adsbygoogle" style={{ display: 'inline-block', width: 320, height: 50 }} data-ad-client={ADS_CLIENT} data-ad-slot={slot} />
          ) : (
            <ins
              key={pathname}
              ref={insRef}
              className="adsbygoogle"
              style={{ display: 'block', width: '100%' }}
              data-ad-client={ADS_CLIENT}
              data-ad-slot={slot}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          )
        ) : (
          <Box sx={{ textAlign: 'center', color: 'text.secondary', p: 2, border: '2px dashed rgba(31,58,147,.25)', borderRadius: 3, m: 1, width: 'calc(100% - 16px)', height: 'calc(100% - 16px)', minHeight: 'inherit', display: 'grid', placeItems: 'center' }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 13 }}>Google ad space</Typography>
              <Typography sx={{ fontSize: 11 }}>{spec.label}</Typography>
              <Typography sx={{ fontSize: 10, opacity: 0.7 }}>Set VITE_ADSENSE_CLIENT + slot IDs in .env</Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
