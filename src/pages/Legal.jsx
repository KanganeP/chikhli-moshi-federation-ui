import { Typography, Box } from '@mui/material';
import PageShell from '../components/PageShell';
import Card3D from '../components/Card3D';
import { legal } from '../data/content';

export default function Legal({ kind }) {
  const doc = legal[kind];
  return (
    <PageShell title={doc.title} eyebrow="Legal" subtitle={`Last updated: ${doc.updated}`} description={`${doc.title} for the Chikhli–Moshi Federation website.`} sidebar={false}>
      <Card3D intensity={1} sx={{ p: { xs: 2.5, md: 5 } }}>
        {doc.sections.map(([h, p]) => (
          <Box key={h} sx={{ mb: 3, '&:last-child': { mb: 0 } }}>
            <Typography variant="h6" sx={{ mb: .5 }}>{h}</Typography>
            <Typography color="text.secondary">{p}</Typography>
          </Box>
        ))}
      </Card3D>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>This is a general template. Have it reviewed by a legal professional before publishing.</Typography>
    </PageShell>
  );
}
