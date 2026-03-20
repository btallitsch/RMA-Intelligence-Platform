import { type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: 'var(--amber)',
    color: '#000',
    border: 'none',
    fontWeight: 600,
  },
  secondary: {
    background: 'transparent',
    color: 'var(--amber)',
    border: '1px solid var(--amber)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
  },
  danger: {
    background: 'transparent',
    color: 'var(--red)',
    border: '1px solid var(--red)',
  },
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { padding: '5px 12px', fontSize: '11px', gap: '5px' },
  md: { padding: '8px 16px', fontSize: '13px', gap: '6px' },
  lg: { padding: '11px 22px', fontSize: '14px', gap: '8px' },
};

export function Button({ variant = 'ghost', size = 'md', icon, children, style, disabled, ...rest }: Props) {
  return (
    <button
      {...rest}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        borderRadius: 'var(--radius)',
        fontFamily: 'var(--font-sans)',
        letterSpacing: '0.02em',
        transition: 'all 0.15s',
        opacity: disabled ? 0.5 : 1,
        whiteSpace: 'nowrap',
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </button>
  );
}
