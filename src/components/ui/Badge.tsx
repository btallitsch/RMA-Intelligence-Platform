interface Props {
  label: string;
  color?: string;
  bg?: string;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export function Badge({ label, color = 'var(--text-secondary)', bg = 'var(--bg-elevated)', size = 'sm', dot }: Props) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: size === 'sm' ? '2px 8px' : '4px 10px',
        background: bg,
        color,
        border: `1px solid ${color}44`,
        borderRadius: '2px',
        fontFamily: 'var(--font-mono)',
        fontSize: size === 'sm' ? '10px' : '12px',
        fontWeight: 500,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {dot && (
        <span
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: color,
            flexShrink: 0,
          }}
        />
      )}
      {label}
    </span>
  );
}
