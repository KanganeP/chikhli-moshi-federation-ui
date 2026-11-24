import { Box, Chip, Stack, Typography } from '@mui/material';
import PageShell from '../components/PageShell';
import SmartForm from '../components/SmartForm';
import Card3D from '../components/Card3D';
import { CardGrid, SectionTitle } from '../components/ui';
import { areas, societyTypes, tiers } from '../data/content';
import { CheckCircleIcon } from '../icons';

const fields = [
  { name: 'membership', label: 'Membership type', type: 'select', required: true, options: tiers.map((t) => t.name) },
  { name: 'society', label: 'Society / organisation name', required: true },
  { name: 'regNo', label: 'Registration number (if society)' },
  { name: 'type', label: 'Society type', type: 'select', options: societyTypes },
  { name: 'area', label: 'Area', type: 'select', required: true, options: areas },
  { name: 'flats', label: 'Number of flats / units', type: 'number' },
  { name: 'contactName', label: 'Contact person', required: true },
  { name: 'designation', label: 'Designation (Chairperson, Secretary…)' },
  { name: 'phone', label: 'Mobile number', type: 'tel', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'note', label: 'Anything else we should know?', type: 'multiline' },
];

export default function Membership() {
  return (
    <PageShell title="Become a Member" eyebrow="Join us" subtitle="Societies, residents and local businesses — find the membership that fits." description="Join the Chikhli–Moshi Federation as a society member, associate resident or patron. Benefits, fees and online application.">
      <CardGrid cols={{ xs: 1, md: 3 }} gap={2.5}>
        {tiers.map((t) => (
          <Card3D key={t.id} sx={{ p: 3, height: '100%', ...(t.highlight && { outline: '3px solid #ff8f1f' }) }}>
            {t.highlight && <Chip color="secondary" size="small" label="Most popular" sx={{ mb: 1 }} />}
            <Typography variant="h6">{t.name}</Typography>
            <Typography variant="h5" sx={{ color: 'primary.main', my: 1 }} className="pop-sm">{t.price}</Typography>
            <Stack spacing={1}>
              {t.points.map((p) => <Stack key={p} direction="row" spacing={1}><CheckCircleIcon color="success" fontSize="small" /><Typography variant="body2">{p}</Typography></Stack>)}
            </Stack>
          </Card3D>
        ))}
      </CardGrid>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>Fees shown are sample values — update in <code>src/data/content.js</code>.</Typography>

      <Box sx={{ mt: 6 }}>
        <SectionTitle eyebrow="Apply online" title="Membership application" />
        <SmartForm type="membership" fields={fields} submitLabel="Submit application" successTitle="Application received"
          successText="Thank you! Our membership secretary will verify the details and contact you within a few working days." />
      </Box>
    </PageShell>
  );
}
