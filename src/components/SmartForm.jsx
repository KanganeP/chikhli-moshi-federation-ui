import { useState } from 'react';
import { Alert, Autocomplete, Box, Button, CircularProgress, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { CheckCircleIcon, SendIcon } from '../icons';
import { submitForm } from '../utils';
import Card3D from './Card3D';

const validators = {
  tel: (v) => (/^[+\d][\d\s-]{9,14}$/.test(v) ? '' : 'Enter a valid phone number'),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email'),
};

/**
 * Config-driven form.
 * fields: [{ name, label, type?: 'text'|'tel'|'email'|'number'|'select'|'multiline'|'autocomplete', options?, required?, full? }]
 */
export default function SmartForm({ type, title, intro, fields, submitLabel = 'Submit', successTitle = 'Thank you!', successText }) {
  const initial = Object.fromEntries(fields.map((f) => [f.name, '']));
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({ status: 'idle' });

  const set = (name) => (e) => setValues((v) => ({ ...v, [name]: e?.target ? e.target.value : e }));

  const validate = () => {
    const err = {};
    fields.forEach((f) => {
      const v = String(values[f.name] ?? '').trim();
      if (f.required && !v) err[f.name] = 'This field is required';
      else if (v && validators[f.type]) {
        const m = validators[f.type](v);
        if (m) err[f.name] = m;
      }
    });
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (e.target.elements.website?.value) return; // honeypot
    if (!validate()) return;
    setState({ status: 'sending' });
    try {
      const res = await submitForm(type, values);
      setState({ status: 'done', ...res });
    } catch (err) {
      setState({ status: 'error', message: err.message });
    }
  };

  if (state.status === 'done') {
    return (
      <Card3D intensity={3} sx={{ p: { xs: 3, md: 5 }, textAlign: 'center' }}>
        <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main' }} />
        <Typography variant="h4" sx={{ mt: 1 }}>{successTitle}</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>{successText}</Typography>
        <Typography sx={{ mt: 2, fontWeight: 700 }}>Reference: <span style={{ fontFamily: 'monospace' }}>{state.id}</span></Typography>
        {state.demo && import.meta.env.DEV && (
          <Alert severity="info" sx={{ mt: 2, textAlign: 'left' }}>Demo mode: nothing was sent. Set <code>VITE_FORM_ENDPOINT</code> in <code>.env</code> to deliver submissions.</Alert>
        )}
        <Button sx={{ mt: 3 }} variant="outlined" onClick={() => { setValues(initial); setState({ status: 'idle' }); }}>Submit another</Button>
      </Card3D>
    );
  }

  return (
    <Card3D intensity={2} sx={{ p: { xs: 2.5, md: 4 } }}>
      {title && <Typography variant="h5" sx={{ mb: 0.5 }}>{title}</Typography>}
      {intro && <Typography color="text.secondary" sx={{ mb: 2.5 }}>{intro}</Typography>}
      <Box component="form" noValidate onSubmit={onSubmit}>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: -9999, opacity: 0 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0,1fr))' }, gap: 2 }}>
          {fields.map((f) => {
            const common = { label: f.label, required: f.required, error: Boolean(errors[f.name]), helperText: errors[f.name] || f.help, fullWidth: true };
            const wrapSx = { gridColumn: f.full || f.type === 'multiline' ? { sm: '1 / -1' } : 'auto' };
            if (f.type === 'autocomplete') {
              return (
                <Box key={f.name} sx={wrapSx}>
                  <Autocomplete freeSolo options={f.options} inputValue={values[f.name]} onInputChange={(_, v) => set(f.name)(v)}
                    renderInput={(p) => <TextField {...p} {...common} />} />
                </Box>
              );
            }
            return (
              <Box key={f.name} sx={wrapSx}>
                <TextField
                  {...common}
                  type={['tel', 'email', 'number'].includes(f.type) ? f.type : 'text'}
                  select={f.type === 'select'}
                  multiline={f.type === 'multiline'}
                  minRows={f.type === 'multiline' ? 4 : undefined}
                  value={values[f.name]}
                  onChange={set(f.name)}
                  inputProps={f.type === 'tel' ? { inputMode: 'tel' } : undefined}
                >
                  {f.type === 'select' && f.options.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </TextField>
              </Box>
            );
          })}
        </Box>
        {state.status === 'error' && <Alert severity="error" sx={{ mt: 2 }}>{state.message}</Alert>}
        <Stack direction="row" sx={{ mt: 3 }}>
          <Button type="submit" size="large" variant="contained" color="primary" disabled={state.status === 'sending'} endIcon={state.status === 'sending' ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}>
            {state.status === 'sending' ? 'Sending…' : submitLabel}
          </Button>
        </Stack>
      </Box>
    </Card3D>
  );
}
