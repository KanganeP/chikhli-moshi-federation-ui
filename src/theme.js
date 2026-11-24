import { createTheme, responsiveFontSizes } from '@mui/material/styles';

export const brand = {
  indigo: '#1f3a93',
  indigoDark: '#142766',
  indigoDeep: '#0c1744',
  saffron: '#ff8f1f',
  saffronDark: '#d9700a',
  teal: '#0f9d8a',
  rose: '#e8527a',
  sky: '#6f86e0',
};

const extrude = (face, side) => ({
  boxShadow: `0 6px 0 ${side}, 0 12px 22px rgba(20,39,102,.32)`,
  transition: 'transform .15s ease, box-shadow .15s ease, background-color .2s',
  '&:hover': {
    backgroundColor: face,
    transform: 'translateY(2px)',
    boxShadow: `0 4px 0 ${side}, 0 8px 16px rgba(20,39,102,.3)`,
  },
  '&:active': {
    transform: 'translateY(6px)',
    boxShadow: `0 0 0 ${side}, 0 2px 6px rgba(20,39,102,.3)`,
  },
});

let theme = createTheme({
  palette: {
    primary: { main: brand.indigo, dark: brand.indigoDark, light: '#4a63c0' },
    secondary: { main: brand.saffron, dark: brand.saffronDark, contrastText: '#1b1205' },
    success: { main: brand.teal },
    background: { default: '#eef1fb', paper: '#ffffff' },
    text: { primary: '#14183a', secondary: '#4b5275' },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Poppins","Noto Sans Devanagari",system-ui,-apple-system,"Segoe UI",sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 },
    h2: { fontWeight: 800, letterSpacing: '-0.015em', lineHeight: 1.15 },
    h3: { fontWeight: 700, lineHeight: 1.2 },
    h4: { fontWeight: 700, lineHeight: 1.25 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0 },
    overline: { fontWeight: 700, letterSpacing: '.14em' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            'radial-gradient(1200px 600px at 10% -10%, rgba(111,134,224,.18), transparent 60%), radial-gradient(900px 500px at 100% 10%, rgba(255,143,31,.12), transparent 60%)',
          backgroundAttachment: 'fixed',
          overflowX: 'hidden',
        },
        '#root': { overflowX: 'clip' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 14, paddingInline: 22 },
        sizeLarge: { paddingBlock: 12, fontSize: '1rem' },
        containedPrimary: extrude(brand.indigo, brand.indigoDeep),
        containedSecondary: extrude(brand.saffron, brand.saffronDark),
        containedSuccess: extrude(brand.teal, '#0a6f61'),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid rgba(31,58,147,.08)',
          boxShadow: '0 1px 0 #fff inset, 0 10px 30px rgba(20,39,102,.10), 0 2px 6px rgba(20,39,102,.06)',
        },
      },
    },
    MuiPaper: { styleOverrides: { rounded: { borderRadius: 20 } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 14, backgroundColor: '#fff' } } },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: '16px !important',
          border: '1px solid rgba(31,58,147,.1)',
          boxShadow: '0 6px 18px rgba(20,39,102,.08)',
          '&:before': { display: 'none' },
          marginBottom: 12,
        },
      },
    },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 24 } } },
  },
});

theme = responsiveFontSizes(theme, { factor: 2.4 });
export default theme;
