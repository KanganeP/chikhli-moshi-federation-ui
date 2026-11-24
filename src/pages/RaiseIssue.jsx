import PageShell from '../components/PageShell';
import SmartForm from '../components/SmartForm';
import { useCollection } from '../api';

const buildFields = (names) => [
  { name: 'name', label: 'Your name', required: true },
  { name: 'phone', label: 'Mobile number', type: 'tel', required: true },
  { name: 'email', label: 'Email (optional)', type: 'email' },
  { name: 'society', label: 'Society / building', type: 'autocomplete', options: names, required: true },
  { name: 'category', label: 'Category', type: 'select', required: true, options: ['Water supply', 'Roads & potholes', 'Drainage & sewage', 'Street-lights', 'Garbage & sanitation', 'Electricity', 'Safety & security', 'Builder / legal matter', 'Other'] },
  { name: 'priority', label: 'Urgency', type: 'select', required: true, options: ['Low', 'Medium', 'High', 'Emergency (also call 112)'] },
  { name: 'location', label: 'Exact location / landmark', full: true, required: true },
  { name: 'details', label: 'Describe the issue', type: 'multiline', required: true },
];

export default function RaiseIssue() {
  const { data: societies } = useCollection('societies');
  const fields = buildFields(societies.map((s) => s.name));
  return (
    <PageShell title="Raise an Issue" eyebrow="Civic & society help" subtitle="Tell us about a problem in your society or locality. We group similar reports and escalate them together." description="Report water, road, drainage, garbage, electricity or safety issues in Chikhli and Moshi to the federation for follow-up with authorities." noAds={false}>
      <SmartForm type="issue" title="Issue details" intro="Fields marked * are required. For emergencies, call 112 (police), 101 (fire) or 108 (ambulance) first."
        fields={fields} submitLabel="Submit issue" successTitle="Issue received"
        successText="Thanks — our civic liaison team will review it and get back to you. Keep the reference number below for follow-up." />
    </PageShell>
  );
}
