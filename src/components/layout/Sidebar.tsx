import type { ViewPage } from '../../types';

interface NavItem {
  page: ViewPage;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { page: 'dashboard',      label: 'Dashboard',     icon: '◈' },
  { page: 'cases',          label: 'RMA Cases',     icon: '◧' },
  { page: 'analytics',      label: 'Analytics',     icon: '◫' },
  { page: 'report_builder', label: 'Report Builder', icon: '◪' },
];

interface Props {
  currentPage: ViewPage;
  onNavigate: (page: ViewPage) => void;
}

export function Sidebar({ currentPage, onNavigate }: Props) {
  return (
    <aside
      style={{
        width: 'var(--sidebar-w)',
        minHeight: '100vh',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            color: 'var(--text-muted)',
            marginBottom: '4px',
            textTransform: 'uppercase',
          }}
        >
          Water Solutions
        </div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '13px',
            fontWeight: 900,
            color: 'var(--amber)',
            letterSpacing: '0.08em',
            lineHeight: 1.2,
          }}
        >
          RMA
          <br />
          INTELLIGENCE
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--text-muted)',
            marginTop: '4px',
          }}
        >
          v1.0.0 · Failure Analysis
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {NAV_ITEMS.map((item) => {
          const active = currentPage === item.page || (currentPage === 'case_detail' && item.page === 'cases');
          return (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '10px 20px',
                background: active ? 'var(--bg-active)' : 'transparent',
                color: active ? 'var(--amber)' : 'var(--text-secondary)',
                border: 'none',
                borderLeft: active ? '2px solid var(--amber)' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'var(--font-sans)',
                fontWeight: active ? 600 : 400,
                letterSpacing: '0.02em',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-hover)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
                }
              }}
            >
              <span style={{ fontSize: '16px', lineHeight: 1 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--border)',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--text-muted)',
          lineHeight: 1.8,
          flexShrink: 0,
        }}
      >
        <div style={{ color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--green)',
              display: 'inline-block',
            }}
          />
          SYS ONLINE
        </div>
        <div>LOCAL STORAGE</div>
        <div>{new Date().toLocaleDateString()}</div>
      </div>
    </aside>
  );
}
