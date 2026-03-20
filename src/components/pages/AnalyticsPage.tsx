import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from 'recharts';
import type { RMACase } from '../../types';
import { buildParetoData, buildTrendData } from '../../utils/analytics';
import { FAILURE_CATEGORY_COLORS } from '../../utils/constants';
import { Header } from '../layout/Header';
import { Card } from '../ui/Card';

interface Props {
  cases: RMACase[];
}

const TOOLTIP_STYLE = {
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-strong)',
  borderRadius: '4px',
  color: 'var(--text-primary)',
  fontSize: '12px',
  fontFamily: 'IBM Plex Mono, monospace',
};

export function AnalyticsPage({ cases }: Props) {
  const pareto = buildParetoData(cases);
  const trend = buildTrendData(cases);

  // Disposition breakdown
  const dispCounts: Record<string, number> = {};
  cases.forEach((c) => {
    const key = c.disposition ?? 'pending';
    dispCounts[key] = (dispCounts[key] ?? 0) + 1;
  });
  const dispData = Object.entries(dispCounts).map(([name, value]) => ({ name, value }));

  // Origin breakdown
  const originCounts: Record<string, number> = {};
  cases.forEach((c) => {
    const key = c.failureOrigin ?? 'undetermined';
    originCounts[key] = (originCounts[key] ?? 0) + 1;
  });
  const originData = Object.entries(originCounts).map(([name, value]) => ({ name, value }));

  const PIE_COLORS = ['#f59e0b', '#06b6d4', '#10b981', '#8b5cf6', '#ef4444', '#f97316', '#ec4899'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Analytics"
        subtitle={`${cases.length} cases · Failure mode analysis & trending`}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Pareto Chart */}
        <Card>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--amber)', textTransform: 'uppercase' }}>
              Pareto Analysis · Failure Mode Frequency
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Bar = count (left axis) · Line = cumulative % (right axis) · 80% rule highlighted
            </div>
          </div>
          {pareto.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={pareto} margin={{ top: 8, right: 40, left: 0, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
                  angle={-40}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis yAxisId="left" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} unit="%" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar yAxisId="left" dataKey="count" name="Count" radius={[2, 2, 0, 0]}>
                  {pareto.map((entry) => (
                    <Cell key={entry.category} fill={FAILURE_CATEGORY_COLORS[entry.category]} />
                  ))}
                </Bar>
                <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="var(--amber)" strokeWidth={2} dot={{ fill: 'var(--amber)', r: 3 }} name="Cumulative %" />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Trend Chart */}
        <Card>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--amber)', textTransform: 'uppercase', marginBottom: '16px' }}>
            Monthly Intake Trend
          </div>
          {trend.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={trend} margin={{ top: 8, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'IBM Plex Mono' }} />
                <Bar dataKey="total" name="Total Cases" fill="var(--cyan)" opacity={0.6} radius={[2, 2, 0, 0]} />
                <Line type="monotone" dataKey="lineProblem" name="Line Problems" stroke="var(--red)" strokeWidth={2} dot={{ fill: 'var(--red)', r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Pie charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Card>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--amber)', textTransform: 'uppercase', marginBottom: '16px' }}>
              Disposition Breakdown
            </div>
            {dispData.length === 0 ? <EmptyState /> : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={dispData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} paddingAngle={2}>
                    {dispData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'IBM Plex Mono' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>

          <Card>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--amber)', textTransform: 'uppercase', marginBottom: '16px' }}>
              Failure Origin
            </div>
            {originData.length === 0 ? <EmptyState /> : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={originData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} paddingAngle={2}>
                    {originData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'IBM Plex Mono' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        {/* Findings table */}
        <Card>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--amber)', textTransform: 'uppercase', marginBottom: '14px' }}>
            Failure Mode Data Table
          </div>
          {pareto.length === 0 ? <EmptyState /> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Rank', 'Failure Mode', 'Count', 'Frequency', 'Cumulative'].map((h) => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pareto.map((row, i) => (
                  <tr key={row.category}>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: FAILURE_CATEGORY_COLORS[row.category], flexShrink: 0 }} />
                        <span style={{ fontSize: '13px' }}>{row.label}</span>
                      </div>
                    </td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--cyan)' }}>{row.count}</td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '6px', background: 'var(--bg-elevated)', borderRadius: '3px', maxWidth: '120px' }}>
                          <div style={{ width: `${row.percentage}%`, height: '100%', background: FAILURE_CATEGORY_COLORS[row.category], borderRadius: '3px' }} />
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>{row.percentage}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '12px', color: row.cumulative <= 80 ? 'var(--amber)' : 'var(--text-muted)' }}>{row.cumulative}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
      Not enough data yet. Add findings to cases to see analytics.
    </div>
  );
}
