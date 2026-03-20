import type { RMACase, ViewPage } from '../../types';
import { computeDashboardStats, buildParetoData, formatDate } from '../../utils/analytics';
import { STATUS_COLORS, STATUS_LABELS, SEVERITY_COLORS } from '../../utils/constants';
import { StatCard } from '../ui/StatCard';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Header } from '../layout/Header';
import { Button } from '../ui/Button';

interface Props {
  cases: RMACase[];
  onNavigate: (page: ViewPage, caseId?: string) => void;
  onNewCase: () => void;
}

export function DashboardPage({ cases, onNavigate, onNewCase }: Props) {
  const stats = computeDashboardStats(cases);
  const pareto = buildParetoData(cases).slice(0, 5);
  const recent = [...cases].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6);
  const openCases = cases.filter((c) => c.status !== 'closed');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Mission Control"
        subtitle="RMA Intelligence Platform · Real-time failure overview"
        actions={
          <Button variant="primary" size="sm" onClick={onNewCase}>
            + New RMA
          </Button>
        }
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
          <StatCard label="Total Cases" value={stats.totalCases} sub="all time" icon="◈" />
          <StatCard label="Open Cases" value={stats.openCases} sub="active investigations" accent="var(--orange)" icon="◧" />
          <StatCard label="Closed This Month" value={stats.closedThisMonth} sub="current month" accent="var(--green)" icon="✓" />
          <StatCard label="Line Problems" value={stats.lineProblems} sub="systemic issues flagged" accent="var(--red)" icon="⚠" />
          <StatCard label="Avg Days to Close" value={stats.avgDaysToClose === 0 ? '—' : `${stats.avgDaysToClose}d`} sub="closed cases" accent="var(--cyan)" icon="◫" />
        </div>

        {/* Middle row: Pareto + Open cases */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

          {/* Pareto preview */}
          <Card>
            <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                }}
              >
                Top Failure Modes
              </span>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('analytics')}>
                View Pareto →
              </Button>
            </div>
            {pareto.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No findings recorded yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {pareto.map((item) => (
                  <div key={item.category}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{item.label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)' }}>
                        {item.count} · {item.percentage}%
                      </span>
                    </div>
                    <div style={{ background: 'var(--bg-elevated)', height: '4px', borderRadius: '2px' }}>
                      <div
                        style={{
                          width: `${item.percentage}%`,
                          height: '100%',
                          background: 'var(--amber)',
                          borderRadius: '2px',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Open cases */}
          <Card>
            <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                }}
              >
                Active Cases ({openCases.length})
              </span>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('cases')}>
                All Cases →
              </Button>
            </div>
            {openCases.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No open cases. 🎉</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {openCases.slice(0, 8).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => onNavigate('case_detail', c.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      background: 'var(--bg-elevated)',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      border: '1px solid transparent',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-strong)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent';
                    }}
                  >
                    <Badge
                      label={STATUS_LABELS[c.status]}
                      color={STATUS_COLORS[c.status]}
                      dot
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)' }}>
                        {c.rmaNumber}
                      </div>
                      <div className="truncate" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {c.customerName} · {c.productModel}
                      </div>
                    </div>
                    {c.isLineProblem && (
                      <span style={{ color: 'var(--red)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                        LINE
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '14px',
            }}
          >
            Recent Activity
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '10px' }}>
            {recent.map((c) => {
              const rootCauseFinding = c.findings.find((f) => f.isRootCause);
              return (
                <div
                  key={c.id}
                  onClick={() => onNavigate('case_detail', c.id)}
                  style={{
                    padding: '12px 14px',
                    background: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                    border: '1px solid var(--border)',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-strong)';
                    (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-active)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                    (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-elevated)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)' }}>
                      {c.rmaNumber}
                    </span>
                    <Badge label={STATUS_LABELS[c.status]} color={STATUS_COLORS[c.status]} dot />
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>{c.productModel}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>{c.customerName}</div>
                  {rootCauseFinding && (
                    <div
                      style={{
                        fontSize: '11px',
                        color: SEVERITY_COLORS[rootCauseFinding.severity],
                        fontFamily: 'var(--font-mono)',
                        borderTop: '1px solid var(--border)',
                        paddingTop: '6px',
                      }}
                    >
                      ★ Root cause: {rootCauseFinding.component}
                    </div>
                  )}
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                    Updated {formatDate(c.updatedAt)}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

      </div>
    </div>
  );
}
