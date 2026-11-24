import { Box, Stack, Typography, Chip } from '@mui/material';
import PageShell from '../components/PageShell';
import Card3D from '../components/Card3D';
import AdSlot from '../components/AdSlot';
import { CardGrid, IconBlock, SectionTitle } from '../components/ui';
import { areas } from '../data/content';
import { FlagIcon, VisibilityIcon, HandshakeIcon, CheckCircleIcon } from '../icons';
import { brand } from '../theme';

const pillars = [
  { icon: FlagIcon, color: brand.indigo, title: 'Our mission', text: 'To unite housing societies of Chikhli and Moshi, strengthen their governance and give residents a credible, organised voice with civic authorities.' },
  { icon: VisibilityIcon, color: brand.saffronDark, title: 'Our vision', text: 'Safe, clean, well-governed neighbourhoods where every family can rely on transparent societies and responsive civic services.' },
  { icon: HandshakeIcon, color: brand.teal, title: 'Our values', text: 'Transparency, inclusiveness, non-partisanship, accountability and volunteer-driven service.' },
];

const timeline = [
  ['2018', 'A handful of society chairpersons meet to coordinate on water supply and road issues.'],
  ['2019', 'Federation formalised; first general body and committee elected.'],
  ['2021', 'Legal & audit helpdesk and law clinics begin for member societies.'],
  ['2023', 'Safety programme: fire-safety drills and lift-safety awareness across societies.'],
  ['2025', 'Digital issue tracking and this community website launched.'],
  ['2026', 'Over 120 member societies and growing.'],
];

const objectives = [
  'Promote co-operative spirit and good governance in housing societies',
  'Provide guidance on bye-laws, audit, conveyance and redevelopment',
  'Represent residents’ collective civic concerns to PCMC and other agencies',
  'Run safety, cleanliness, environment and awareness programmes',
  'Maintain a directory and communication network of member societies',
  'Promote harmony, culture and wellbeing of residents',
];

export default function About() {
  return (
    <PageShell title="About the Federation" eyebrow="Who we are" subtitle="A non-political, volunteer-driven federation of housing societies in Chikhli and Moshi." description="About the Chikhli–Moshi Federation: mission, vision, objectives, history and the areas we serve.">
      <CardGrid cols={{ xs: 1, md: 3 }}>
        {pillars.map(({ icon: Icon, color, title, text }) => (
          <Card3D key={title} sx={{ p: 3, height: '100%' }}>
            <IconBlock color={color}><Icon /></IconBlock>
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }} className="pop-sm">{title}</Typography>
            <Typography variant="body2" color="text.secondary">{text}</Typography>
          </Card3D>
        ))}
      </CardGrid>

      <AdSlot type="infeed" />

      <SectionTitle eyebrow="Our journey" title="History at a glance" />
      <Box sx={{ position: 'relative', pl: { xs: 4, sm: 5 }, '&:before': { content: '""', position: 'absolute', left: { xs: 11, sm: 15 }, top: 6, bottom: 6, width: 4, borderRadius: 4, background: `linear-gradient(${brand.saffron}, ${brand.indigo})` } }}>
        <Stack spacing={2.5}>
          {timeline.map(([year, text]) => (
            <Box key={year} sx={{ position: 'relative' }}>
              <Box sx={{ position: 'absolute', left: { xs: -33, sm: -37 }, top: 14, width: 18, height: 18, borderRadius: '50%', bgcolor: 'secondary.main', boxShadow: '0 3px 0 #d9700a, 0 0 0 4px #fff' }} />
              <Card3D intensity={3} sx={{ p: 2.2 }}>
                <Typography sx={{ fontWeight: 800, color: 'primary.main' }}>{year}</Typography>
                <Typography variant="body2" color="text.secondary">{text}</Typography>
              </Card3D>
            </Box>
          ))}
        </Stack>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>Timeline entries are sample text — replace with your federation’s real history.</Typography>

      <Box sx={{ mt: 6 }}>
        <SectionTitle eyebrow="What we aim for" title="Objectives" />
        <Card3D intensity={2} sx={{ p: { xs: 2.5, md: 4 } }}>
          <Stack spacing={1.6}>
            {objectives.map((o) => (
              <Stack key={o} direction="row" spacing={1.5}><CheckCircleIcon color="success" /><Typography>{o}</Typography></Stack>
            ))}
          </Stack>
        </Card3D>
      </Box>

      <Box sx={{ mt: 6 }}>
        <SectionTitle eyebrow="Coverage" title="Areas we serve" subtitle="Indicative list — societies from neighbouring localities are welcome." />
        <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>{areas.map((a) => <Chip key={a} label={a} color="primary" />)}</Stack>
      </Box>
    </PageShell>
  );
}
