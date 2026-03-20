interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
  hoverable?: boolean;
  accent?: boolean;
}

export function Card({ children, style, onClick, hoverable, accent }: Props) {
  const base: React.CSSProperties = {
    background: 'var(--bg-surface)',
    border: accent ? '1px solid var(--amber-dim)' : '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    transition: 'all 0.15s',
    cursor: onClick || hoverable ? 'pointer' : undefined,
    boxShadow: accent ? '0 0 16px var(--amber-glow)' : undefined,
    ...style,
  };

  return (
    <div
      style={base}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick || hoverable) {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-strong)';
          (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-elevated)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick || hoverable) {
          (e.currentTarget as HTMLDivElement).style.borderColor = accent ? 'var(--amber-dim)' : 'var(--border)';
          (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-surface)';
        }
      }}
    >
      {children}
    </div>
  );
}
