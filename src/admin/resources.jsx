import { Avatar, Box, Chip, Stack, Typography } from '@mui/material';
import { areas, societyTypes, noticeCategories, tiers } from '../data/content';
import { MarkEmailReadIcon, BuildIcon, CheckCircleIcon, UndoIcon, CheckIcon, AutorenewIcon, BlockIcon } from '../icons';
import { addYear, fmtD, fmtDT, publishState, todayStr } from './adminApi';

const strong = (t) => <Typography sx={{ fontWeight: 600, lineHeight: 1.3 }}>{t}</Typography>;
const stateChip = (r) => { const s = publishState(r); return <Chip size="small" color={s.color} label={s.label} />; };
const STATUS_OPTS = [{ value: 'published', label: 'Published' }, { value: 'draft', label: 'Draft (not shown)' }];
const PUBLISH_HELP = 'Shows on the website from this date and time. Leave empty to publish right away.';

export const ISSUE_STATUS = { new: ['New', 'error'], read: ['Read', 'info'], in_progress: ['In progress', 'warning'], fixed: ['Fixed', 'success'] };
const prioColor = (p = '') => (p.startsWith('Emergency') || p === 'High' ? 'error' : p === 'Medium' ? 'warning' : 'default');
const daysTo = (d) => Math.ceil((new Date(d) - new Date()) / 864e5);

const kv = (label, value) => (
  <Box key={label} sx={{ display: 'grid', gridTemplateColumns: { xs: '110px 1fr', sm: '150px 1fr' }, gap: 1, py: 0.8, borderBottom: '1px solid', borderColor: 'divider' }}>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    <Typography variant="body2" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{value || '—'}</Typography>
  </Box>
);

export const cfg = {
  societies: {
    name: 'societies', title: 'Societies', singular: 'society', subtitle: 'Member societies shown in the public directory.',
    searchKeys: ['name', 'area', 'chairman', 'type'],
    filters: [{ key: 'area', label: 'Area', options: areas, get: (r) => r.area }, { key: 'type', label: 'Type', options: societyTypes, get: (r) => r.type }],
    columns: [
      { key: 'name', label: 'Society', render: (r) => strong(r.name) },
      { key: 'area', label: 'Area' },
      { key: 'type', label: 'Type', hideXs: true },
      { key: 'flats', label: 'Flats', align: 'right' },
      { key: 'since', label: 'Since', hideXs: true },
      { key: 'featured', label: 'Featured', hideXs: true, render: (r) => (r.featured ? <Chip size="small" color="secondary" label="Featured" /> : '—') },
    ],
    fields: [
      { name: 'name', label: 'Society name', required: true, full: true },
      { name: 'area', label: 'Area', type: 'select', options: areas, required: true },
      { name: 'type', label: 'Type', type: 'select', options: societyTypes, required: true },
      { name: 'flats', label: 'Number of flats / units', type: 'number' },
      { name: 'since', label: 'Registered / since (year)', type: 'number' },
      { name: 'chairman', label: 'Chairperson' },
      { name: 'contact', label: 'Contact number', type: 'tel' },
      { name: 'address', label: 'Address', full: true },
      { name: 'amenities', label: 'Amenities (comma separated)', type: 'tags' },
      { name: 'featured', label: 'Show on the home page', type: 'switch' },
    ],
    defaults: { area: areas[0], type: societyTypes[0], featured: false },
    activeLabel: 'Active (listed on the website)',
  },

  notices: {
    name: 'notices', title: 'Notices', singular: 'notice', subtitle: 'Create a notice, set when it goes live, and keep drafts private.',
    searchKeys: ['title', 'body', 'category'],
    filters: [
      { key: 'category', label: 'Category', options: noticeCategories.filter((c) => c !== 'All'), get: (r) => r.category },
      { key: 'state', label: 'Status', options: ['Live', 'Scheduled', 'Draft', 'Inactive'], get: (r) => publishState(r).label },
    ],
    columns: [
      { key: 'title', label: 'Notice', render: (r) => strong(r.title) },
      { key: 'category', label: 'Category', render: (r) => <Chip size="small" label={r.category || '—'} /> },
      { key: 'date', label: 'Notice date', hideXs: true, render: (r) => fmtD(r.date) },
      { key: 'publishAt', label: 'Goes live', hideXs: true, render: (r) => fmtDT(r.publishAt) },
      { key: 'state', label: 'Status', render: stateChip },
    ],
    fields: [
      { name: 'title', label: 'Title', required: true, full: true },
      { name: 'category', label: 'Category', type: 'select', options: noticeCategories.filter((c) => c !== 'All'), required: true },
      { name: 'date', label: 'Notice date', type: 'date' },
      { name: 'body', label: 'Details', type: 'multiline' },
      { name: 'file', label: 'Attachment (optional)', type: 'file' },
      { name: 'status', label: 'Publishing', type: 'select', options: STATUS_OPTS, required: true },
      { name: 'publishAt', label: 'Publish at', type: 'datetime', help: PUBLISH_HELP },
    ],
    exportKeys: ['title', 'category', 'date', 'status', 'publishAt', 'active', 'body'],
    defaults: { category: 'General', status: 'published', date: todayStr() },
    activeLabel: 'Active (turn off to hide without deleting)',
  },

  events: {
    name: 'events', title: 'Events', singular: 'event', subtitle: 'Set the event date and time, and when it should appear on the website.',
    searchKeys: ['title', 'venue', 'summary', 'tag'],
    filters: [
      { key: 'tag', label: 'Type', options: ['Meeting', 'Safety', 'Community', 'Legal', 'Health', 'Civic'], get: (r) => r.tag },
      { key: 'state', label: 'Status', options: ['Live', 'Scheduled', 'Draft', 'Inactive'], get: (r) => publishState(r).label },
      { key: 'when', label: 'When', options: ['Upcoming', 'Past'], get: (r) => (new Date(r.date) >= new Date() ? 'Upcoming' : 'Past') },
    ],
    columns: [
      { key: 'title', label: 'Event', render: (r) => strong(r.title) },
      { key: 'date', label: 'Date and time', render: (r) => <Box sx={{ whiteSpace: 'nowrap' }}>{fmtDT(r.date)}{new Date(r.date) < new Date() && <Typography variant="caption" color="text.secondary" display="block">Past</Typography>}</Box> },
      { key: 'venue', label: 'Venue', hideXs: true },
      { key: 'tag', label: 'Type', hideXs: true, render: (r) => <Chip size="small" label={r.tag || '—'} /> },
      { key: 'state', label: 'Status', render: stateChip },
    ],
    fields: [
      { name: 'title', label: 'Event name', required: true, full: true },
      { name: 'date', label: 'Event date and time', type: 'datetime', required: true },
      { name: 'durationHours', label: 'Duration (hours)', type: 'number' },
      { name: 'venue', label: 'Venue', full: true },
      { name: 'tag', label: 'Type', type: 'select', options: ['Meeting', 'Safety', 'Community', 'Legal', 'Health', 'Civic'] },
      { name: 'summary', label: 'Description', type: 'multiline' },
      { name: 'status', label: 'Publishing', type: 'select', options: STATUS_OPTS, required: true },
      { name: 'publishAt', label: 'Publish at', type: 'datetime', help: PUBLISH_HELP },
    ],
    exportKeys: ['title', 'date', 'venue', 'tag', 'status', 'publishAt', 'active', 'summary'],
    defaults: { status: 'published', tag: 'Meeting', durationHours: 2 },
    activeLabel: 'Active (turn off to hide without deleting)',
  },

  issues: {
    name: 'issues', title: 'Issues', singular: 'issue', subtitle: 'Reports from the “Raise an Issue” page. Open one to mark it read, in progress or fixed.',
    searchKeys: ['ref', 'name', 'society', 'category', 'details', 'location'],
    filters: [
      { key: 'status', label: 'Status', options: Object.values(ISSUE_STATUS).map((s) => s[0]), get: (r) => ISSUE_STATUS[r.status]?.[0] },
      { key: 'priority', label: 'Urgency', options: ['Low', 'Medium', 'High', 'Emergency (also call 112)'], get: (r) => r.priority },
      { key: 'category', label: 'Category', options: ['Water supply', 'Roads & potholes', 'Drainage & sewage', 'Street-lights', 'Garbage & sanitation', 'Electricity', 'Safety & security', 'Builder / legal matter', 'Other'], get: (r) => r.category },
    ],
    columns: [
      { key: 'ref', label: 'Reference', hideXs: true, render: (r) => <Typography className="mono" sx={{ fontFamily: 'monospace', fontSize: 13 }}>{r.ref || '—'}</Typography> },
      { key: 'createdAt', label: 'Received', hideXs: true, render: (r) => fmtDT(r.createdAt) },
      { key: 'name', label: 'Reported by', render: (r) => strong(r.name) },
      { key: 'society', label: 'Society', hideXs: true },
      { key: 'category', label: 'Category' },
      { key: 'priority', label: 'Urgency', hideXs: true, render: (r) => <Chip size="small" color={prioColor(r.priority)} label={(r.priority || '—').replace(' (also call 112)', '')} /> },
      { key: 'status', label: 'Status', render: (r) => { const [l, c] = ISSUE_STATUS[r.status] || ['—', 'default']; return <Chip size="small" color={c} label={l} />; } },
    ],
    fields: [
      { name: 'name', label: 'Reporter name', required: true },
      { name: 'phone', label: 'Mobile', type: 'tel' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'society', label: 'Society / building' },
      { name: 'category', label: 'Category', type: 'select', options: ['Water supply', 'Roads & potholes', 'Drainage & sewage', 'Street-lights', 'Garbage & sanitation', 'Electricity', 'Safety & security', 'Builder / legal matter', 'Other'] },
      { name: 'priority', label: 'Urgency', type: 'select', options: ['Low', 'Medium', 'High', 'Emergency (also call 112)'] },
      { name: 'location', label: 'Location / landmark', full: true },
      { name: 'details', label: 'Details', type: 'multiline', required: true },
      { name: 'status', label: 'Status', type: 'select', required: true, options: Object.entries(ISSUE_STATUS).map(([value, [label]]) => ({ value, label })) },
      { name: 'adminNote', label: 'Internal note (not public)', type: 'multiline' },
    ],
    defaults: { status: 'new', priority: 'Medium' },
    activeLabel: 'Active (turn off to archive)',
    detailTitle: (r) => `${r.ref || 'Issue'} · ${r.category || ''}`,
    detail: (r) => (
      <Box>
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
          <Chip size="small" color={ISSUE_STATUS[r.status]?.[1]} label={ISSUE_STATUS[r.status]?.[0]} />
          <Chip size="small" color={prioColor(r.priority)} label={r.priority} />
          {r.active === false && <Chip size="small" label="Archived" />}
        </Stack>
        {[['Received', fmtDT(r.createdAt)], ['Reported by', r.name], ['Mobile', r.phone], ['Email', r.email], ['Society', r.society], ['Location', r.location], ['Details', r.details], ['Internal note', r.adminNote], ['Source', r.source || 'website']].map(([k, v]) => kv(k, v))}
      </Box>
    ),
    rowActions: (r) => [
      r.status === 'new' && { label: 'Mark read', icon: <MarkEmailReadIcon fontSize="small" />, patch: { status: 'read' }, done: 'Marked as read' },
      (r.status === 'new' || r.status === 'read') && { label: 'Start work', icon: <BuildIcon fontSize="small" />, patch: { status: 'in_progress' }, done: 'Marked in progress' },
      r.status !== 'fixed' && { label: 'Mark fixed', icon: <CheckCircleIcon fontSize="small" color="success" />, patch: { status: 'fixed' }, done: 'Marked as fixed' },
      r.status === 'fixed' && { label: 'Reopen', icon: <UndoIcon fontSize="small" />, patch: { status: 'in_progress' }, done: 'Reopened' },
    ],
  },

  committee: {
    name: 'committee', title: 'Committee', singular: 'member', subtitle: 'Office-bearers shown on the Committee page. Lower order numbers appear first.',
    searchKeys: ['designation', 'personName', 'email'],
    columns: [
      { key: 'designation', label: 'Position', render: (r) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar src={r.photo || undefined} sx={{ width: 36, height: 36, fontSize: 14 }}>{r.initials || (r.designation || '?').slice(0, 2).toUpperCase()}</Avatar>
          {strong(r.designation)}
        </Stack>) },
      { key: 'personName', label: 'Name', render: (r) => r.personName || <Typography variant="body2" color="warning.main">Name to be added</Typography> },
      { key: 'phone', label: 'Phone', hideXs: true },
      { key: 'email', label: 'Email', hideXs: true },
      { key: 'order', label: 'Order', align: 'right' },
    ],
    fields: [
      { name: 'photo', label: 'Photo', type: 'image' },
      { name: 'designation', label: 'Position (e.g. President)', required: true },
      { name: 'personName', label: 'Person’s name' },
      { name: 'role', label: 'Position in Marathi (optional)' },
      { name: 'initials', label: 'Initials (shown without a photo)' },
      { name: 'phone', label: 'Phone', type: 'tel' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'order', label: 'Order', type: 'number' },
      { name: 'bio', label: 'Short bio', type: 'multiline' },
    ],
    defaults: { order: 99 },
    activeLabel: 'Active (shown on the website)',
  },

  members: {
    name: 'members', title: 'Membership', singular: 'member', subtitle: 'All federation members. New website applications arrive as Pending: approve them to activate.',
    searchKeys: ['name', 'society', 'phone', 'email', 'area', 'regNo'],
    filters: [
      { key: 'tier', label: 'Type', options: tiers.map((t) => t.name), get: (r) => r.tier },
      { key: 'status', label: 'Status', options: ['Pending', 'Active', 'Expired', 'Rejected'], get: (r) => r.status },
      { key: 'pay', label: 'Payment', options: ['Paid', 'Unpaid', 'Waived'], get: (r) => r.paymentStatus },
    ],
    columns: [
      { key: 'name', label: 'Member', render: (r) => <Box>{strong(r.name)}<Typography variant="caption" color="text.secondary">{r.designation}</Typography></Box> },
      { key: 'society', label: 'Society', hideXs: true },
      { key: 'tier', label: 'Type', hideXs: true },
      { key: 'status', label: 'Status', render: (r) => <Chip size="small" label={r.status || '—'} color={{ Active: 'success', Pending: 'warning', Expired: 'error', Rejected: 'default' }[r.status] || 'default'} /> },
      { key: 'paymentStatus', label: 'Payment', hideXs: true, render: (r) => <Chip size="small" variant="outlined" label={r.paymentStatus || '—'} color={r.paymentStatus === 'Paid' ? 'success' : r.paymentStatus === 'Unpaid' ? 'warning' : 'default'} /> },
      { key: 'expiryDate', label: 'Valid until', render: (r) => {
        if (!r.expiryDate) return '—';
        const d = daysTo(r.expiryDate);
        return <Box sx={{ whiteSpace: 'nowrap' }}>{fmtD(r.expiryDate)}{r.status === 'Active' && d <= 30 && <Typography variant="caption" color={d < 0 ? 'error' : 'warning.main'} display="block">{d < 0 ? 'Expired' : `${d} day${d === 1 ? '' : 's'} left`}</Typography>}</Box>;
      } },
    ],
    fields: [
      { name: 'name', label: 'Member / contact name', required: true },
      { name: 'society', label: 'Society / organisation' },
      { name: 'designation', label: 'Designation' },
      { name: 'tier', label: 'Membership type', type: 'select', options: tiers.map((t) => t.name), required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Active', 'Expired', 'Rejected'], required: true },
      { name: 'paymentStatus', label: 'Payment', type: 'select', options: ['Paid', 'Unpaid', 'Waived'] },
      { name: 'fee', label: 'Fee (₹)', type: 'number' },
      { name: 'startDate', label: 'Member since', type: 'date' },
      { name: 'expiryDate', label: 'Valid until', type: 'date' },
      { name: 'phone', label: 'Phone', type: 'tel' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'area', label: 'Area', type: 'select', options: areas },
      { name: 'flats', label: 'Flats / units', type: 'number' },
      { name: 'regNo', label: 'Society registration no.' },
      { name: 'notes', label: 'Notes', type: 'multiline' },
    ],
    exportKeys: ['name', 'society', 'designation', 'tier', 'status', 'paymentStatus', 'fee', 'startDate', 'expiryDate', 'phone', 'email', 'area', 'flats', 'regNo', 'notes'],
    defaults: { tier: 'Society Member', status: 'Active', paymentStatus: 'Paid', fee: 2500, startDate: todayStr(), expiryDate: addYear(todayStr()) },
    activeLabel: 'Active member',
    rowActions: (r) => [
      r.status === 'Pending' && { label: 'Approve', icon: <CheckIcon fontSize="small" color="success" />, patch: { status: 'Active', active: true, startDate: todayStr(), expiryDate: addYear(todayStr()) }, done: 'Member approved and activated' },
      r.status === 'Pending' && { label: 'Reject', icon: <BlockIcon fontSize="small" />, patch: { status: 'Rejected', active: false }, done: 'Application rejected' },
      (r.status === 'Active' || r.status === 'Expired') && { label: 'Renew for 1 year', icon: <AutorenewIcon fontSize="small" />, patch: { status: 'Active', active: true, expiryDate: addYear(new Date(r.expiryDate) > new Date() ? r.expiryDate : todayStr()) }, done: 'Renewed for one year' },
    ],
  },
};
