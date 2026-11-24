import { Link as RouterLink } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Typography } from '@mui/material';
import PageShell from '../components/PageShell';
import AdSlot from '../components/AdSlot';
import { CardGrid, SectionTitle } from '../components/ui';
import { ServiceCard } from '../components/cards';
import { faqs, services } from '../data/content';
import { ExpandMoreIcon, ArrowForwardIcon } from '../icons';

export default function Services() {
  return (
    <PageShell title="Services & FAQ" eyebrow="How we help" subtitle="Practical support for committees and residents of member societies." description="Services offered by the Chikhli–Moshi Federation: legal guidance, conveyance, audit support, civic liaison, safety and green living, plus frequently asked questions.">
      <CardGrid cols={{ xs: 1, sm: 2 }} gap={2.5}>
        {services.map((s, i) => <ServiceCard key={s.title} index={i} {...s} />)}
      </CardGrid>

      <AdSlot type="infeed" />

      <SectionTitle eyebrow="Answers" title="Frequently asked questions" />
      {faqs.map((f, i) => (
        <Accordion key={f.q} disableGutters defaultExpanded={i === 0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography sx={{ fontWeight: 700 }}>{f.q}</Typography></AccordionSummary>
          <AccordionDetails><Typography color="text.secondary">{f.a}</Typography></AccordionDetails>
        </Accordion>
      ))}
      <Alert severity="info" sx={{ mt: 3 }}>This page gives general information only and is not legal advice. Please consult a qualified professional for your specific situation.</Alert>
      <Box sx={{ mt: 3 }}><Button component={RouterLink} to="/contact" variant="contained" endIcon={<ArrowForwardIcon />}>Ask us a question</Button></Box>
    </PageShell>
  );
}
