import { Box, Link, Stack, Typography } from '@mui/material';
import PageShell from '../components/PageShell';
import SmartForm from '../components/SmartForm';
import Card3D from '../components/Card3D';
import { IconBlock } from '../components/ui';
import { site } from '../config/site';
import { PhoneIcon, EmailIcon, LocationOnIcon, AccessTimeIcon } from '../icons';
import { brand } from '../theme';

const fields = [
  { name: 'name', label: 'Your name', required: true },
  { name: 'phone', label: 'Mobile number', type: 'tel', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'subject', label: 'Subject', type: 'select', options: ['General enquiry', 'Membership', 'Legal help', 'Events', 'Sponsorship / advertising', 'Feedback'] },
  { name: 'message', label: 'Message', type: 'multiline', required: true },
];

const info = [
  [PhoneIcon, 'Phone', site.phone, `tel:${site.phone.replace(/\s/g, '')}`, brand.indigo],
  [EmailIcon, 'Email', site.email, `mailto:${site.email}`, brand.saffronDark],
  [LocationOnIcon, 'Office', site.address, null, brand.teal],
  [AccessTimeIcon, 'Hours', site.hours, null, brand.rose],
];

export default function Contact() {
  return (
    <PageShell title="Contact Us" eyebrow="Get in touch" subtitle="Questions, suggestions or want to collaborate? We’d love to hear from you." description="Contact the Chikhli–Moshi Federation: phone, email, office address, map and enquiry form." sidebar={false}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: '5fr 7fr' }, gap: 3, alignItems: 'start' }}>
        <Stack spacing={2}>
          {info.map(([Icon, label, value, href, color]) => (
            <Card3D key={label} intensity={4} sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
              <IconBlock size={46} color={color}><Icon /></IconBlock>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary">{label}</Typography>
                {href ? <Link href={href} underline="hover" sx={{ display: 'block', fontWeight: 600, wordBreak: 'break-word' }}>{value}</Link> : <Typography sx={{ fontWeight: 600 }}>{value}</Typography>}
              </Box>
            </Card3D>
          ))}
        </Stack>
        <SmartForm type="contact" title="Send us a message" fields={fields} submitLabel="Send message" successTitle="Message sent" successText="Thanks for reaching out — we’ll reply as soon as we can." />
      </Box>

      <Card3D intensity={1} sx={{ mt: 4, overflow: 'hidden', p: 0 }}>
        <Box component="iframe" title="Map of Chikhli–Moshi area" src={site.mapSrc} loading="lazy" sx={{ border: 0, width: '100%', height: { xs: 280, md: 380 }, display: 'block' }} />
      </Card3D>
      <Typography variant="caption" color="text.secondary">Map is indicative — set the exact office location in <code>src/config/site.js</code>.</Typography>
    </PageShell>
  );
}
