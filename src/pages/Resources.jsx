import { Box, Button, Chip, Link, Stack, Typography } from '@mui/material';
import PageShell from '../components/PageShell';
import AdSlot from '../components/AdSlot';
import Card3D from '../components/Card3D';
import { CardGrid, IconBlock, SectionTitle } from '../components/ui';
import { getIcon } from '../components/cards';
import { resources } from '../data/content';
import { DescriptionIcon, DownloadIcon, OpenInNewIcon } from '../icons';
import { brand } from '../theme';

export default function Resources() {
  return (
    <PageShell title="Resources" eyebrow="Forms, guides & links" subtitle="Templates, checklists and quick links to government portals." description="Downloadable forms, checklists and useful government links for housing societies in Chikhli and Moshi.">
      <SectionTitle eyebrow="Download" title="Documents & templates" />
      <Stack spacing={2}>
        {resources.documents.map((d) => (
          <Card3D key={d.title} intensity={2} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconBlock size={44} color={brand.indigo}><DescriptionIcon /></IconBlock>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, lineHeight: 1.3 }}>{d.title}</Typography>
              <Chip size="small" label={d.type} sx={{ mt: .5 }} />
            </Box>
            <Button component="a" href={d.file} download variant="outlined" startIcon={<DownloadIcon />} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>Download</Button>
            <Button component="a" href={d.file} download aria-label={`Download ${d.title}`} sx={{ display: { xs: 'inline-flex', sm: 'none' }, minWidth: 0 }}><DownloadIcon /></Button>
          </Card3D>
        ))}
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>Add your real files to <code>/public/docs</code> using the filenames in <code>src/data/content.js</code>.</Typography>

      <AdSlot type="infeed" />

      <SectionTitle eyebrow="Official portals" title="Useful links" />
      <CardGrid cols={{ xs: 1, sm: 2 }} gap={2}>
        {resources.links.map((l) => (
          <Card3D key={l.url} sx={{ p: 2.5, height: '100%' }}>
            <Link href={l.url} target="_blank" rel="noopener noreferrer" underline="hover" sx={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: .6 }}>{l.title}<OpenInNewIcon sx={{ fontSize: 16 }} /></Link>
            <Typography variant="body2" color="text.secondary">{l.note}</Typography>
          </Card3D>
        ))}
      </CardGrid>

      <SectionTitle eyebrow="In an emergency" title="Emergency numbers" />
      <CardGrid cols={{ xs: 2, md: 4 }} gap={2}>
        {resources.emergency.map((e, i) => {
          const Icon = getIcon(e.icon);
          return (
            <Card3D key={e.label} intensity={9} component="a" href={`tel:${e.number}`} sx={{ p: 2, textAlign: 'center', textDecoration: 'none', color: 'inherit' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}><IconBlock size={48} color={[brand.indigo, '#d9381e', brand.teal, brand.rose][i]}><Icon /></IconBlock></Box>
              <Typography variant="h5" sx={{ mt: 2, color: 'primary.main' }}>{e.number}</Typography>
              <Typography variant="body2" color="text.secondary">{e.label}</Typography>
            </Card3D>
          );
        })}
      </CardGrid>
    </PageShell>
  );
}
