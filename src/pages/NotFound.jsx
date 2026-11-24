import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Cube3D } from '../components/Decor';
import { usePageMeta } from '../utils';

// Intentionally no ads on error pages (AdSense policy: no ads on pages without publisher content).
export default function NotFound() {
  usePageMeta('Page not found', 'The page you are looking for does not exist.');
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 8, md: 14 }, textAlign: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}><Cube3D size={120}>
        <Typography sx={{ fontWeight: 800, fontSize: 40 }}>404</Typography>
      </Cube3D></Box>
      <Typography variant="h3" component="h1">Page not found</Typography>
      <Typography color="text.secondary" sx={{ mt: 1.5, mb: 4 }}>The page you’re looking for has moved or doesn’t exist.</Typography>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button component={RouterLink} to="/" variant="contained" size="large">Go home</Button>
        <Button component={RouterLink} to="/contact" size="large">Contact us</Button>
      </Stack>
    </Container>
  );
}
