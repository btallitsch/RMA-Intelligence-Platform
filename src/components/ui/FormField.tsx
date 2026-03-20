interface BaseProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  style?: React.CSSProperties;
}

interface InputProps extends BaseProps {
  type?: 'text' | 'date' | 'email';
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
}

interface TextareaProps extends BaseProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}

interface SelectProps extends BaseProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  marginBottom: '6px',
};

const inputBase: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  color: 'var(--text-primary)',
  padding: '8px 12px',
  fontSize: '13px',
  fontFamily: 'var(--font-sans)',
  transition: 'border-color 0.15s',
  outline: 'none',
};

export function Field({ label, required, hint, error, style, children }: BaseProps & { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: 'var(--amber)', marginLeft: '2px' }}>*</span>}
      </label>
      {children}
      {hint && !error && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{hint}</div>}
      {error && <div style={{ fontSize: '11px', color: 'var(--red)', marginTop: '4px' }}>{error}</div>}
    </div>
  );
}

export function Input({ label, required, hint, error, style, type = 'text', value, onChange, placeholder, mono }: InputProps) {
  return (
    <Field label={label} required={required} hint={hint} error={error} style={style}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          ...inputBase,
          fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
          borderColor: error ? 'var(--red)' : 'var(--border)',
        }}
        onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--amber)'; }}
        onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = error ? 'var(--red)' : 'var(--border)'; }}
      />
    </Field>
  );
}

export function Textarea({ label, required, hint, error, style, value, onChange, placeholder, rows = 4 }: TextareaProps) {
  return (
    <Field label={label} required={required} hint={hint} error={error} style={style}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          ...inputBase,
          resize: 'vertical',
          lineHeight: 1.6,
          borderColor: error ? 'var(--red)' : 'var(--border)',
        }}
        onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--amber)'; }}
        onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = error ? 'var(--red)' : 'var(--border)'; }}
      />
    </Field>
  );
}

export function Select({ label, required, hint, error, style, value, onChange, options }: SelectProps) {
  return (
    <Field label={label} required={required} hint={hint} error={error} style={style}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...inputBase,
          cursor: 'pointer',
          borderColor: error ? 'var(--red)' : 'var(--border)',
        }}
        onFocus={(e) => { (e.target as HTMLSelectElement).style.borderColor = 'var(--amber)'; }}
        onBlur={(e) => { (e.target as HTMLSelectElement).style.borderColor = error ? 'var(--red)' : 'var(--border)'; }}
      >
        <option value="">— Select —</option>
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: 'var(--bg-elevated)' }}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
