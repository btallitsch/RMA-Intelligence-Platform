import { useState, useMemo } from 'react';
import type { RMACase, RMAStatus, ViewPage } from '../../types';
import { STATUS_COLORS, STATUS_LABELS, PRODUCT_TYPE_LABELS } from '../../utils/constants';
import { formatDate, daysSince } from '../../utils/analytics';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Header } from '../layout/Header';

interface Props {
  cases: RMACase[];
  onNavigate: (page: ViewPage, caseId?: string) => void;
  onNewCase: () => void;
}

const STATUS_FILTER: { value: RMAStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'received', label: 'Received' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'analysis_complete', label: 'Analysis Complete' },
  { value: 'report_pending', label: 'Report Pending' },
  { value: 'closed', label: 'Closed' },
];

export function CasesPage({ cases, onNavigate, onNewCase }: Props) {
  const [statusFilter, setStatusFilter] = useState<RMAStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = cases;
    if (statusFilter !== 'all') list = list.filter((c) => c.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.rmaNumber.toLowerCase().includes(q) ||
          c.customerName.toLowerCase().includes(q) ||
          c.productModel.toLowerCase().includes(q) ||
          c.serialNumber.toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [cases, statusFilter, search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="RMA Cases"
        subtitle={`${cases.length} total · ${cases.filter((c) => c.status !== 'closed').length} open`}
        actions={
          <Button variant="primary" size="sm" onClick={onNewCase}>
            + New RMA
          </Button>
        }
      />

      {/* Filter Bar */}
      <div
        style={{
          padding: '12px 28px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          flexWrap: 'wrap',
          background: 'var(--bg-surface)',
          flexShrink: 0,
        }}
      >
        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search RMA#, customer, model…"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            color: 'var(--text-primary)',
            padding: '6px 12px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            width: '240px',
            outline: 'none',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--amber)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
        />

        {/* Status pills */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {STATUS_FILTER.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              style={{
                padding: '5px 12px',
                background: statusFilter === f.value ? 'var(--bg-active)' : 'transparent',
                color: statusFilter === f.value ? 'var(--amber)' : 'var(--text-muted)',
                border: statusFilter === f.value ? '1px solid var(--amber-dim)' : '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.04em',
                transition: 'all 0.15s',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 28px 28px' }}>
        {filtered.length === 0 ? (
          <div
            style={{
              padding: '60px 0',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
            }}
          >
            No cases match the current filter.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr>
                {['RMA #', 'Status', 'Product Model', 'Type', 'Customer', 'Engineer', 'Findings', 'Age', 'Line?'].map(
                  (col) => (
                    <th
                      key={col}
                      style={{
                        padding: '8px 12px',
                        textAlign: 'left',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        borderBottom: '1px solid var(--border)',
                        fontWeight: 400,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {col}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => onNavigate('case_detail', c.id)}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => {
                    Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(
                      (cell) => { cell.style.background = 'var(--bg-hover)'; },
                    );
                  }}
                  onMouseLeave={(e) => {
                    Array.from((e.currentTarget as HTMLTableRowElement).cells).forEach(
                      (cell) => { cell.style.background = 'transparent'; },
                    );
                  }}
                >
                  <td
                    style={{
                      padding: '10px 12px',
                      borderBottom: '1px solid var(--border)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      color: 'var(--amber)',
                    }}
                  >
                    {c.rmaNumber}
                  </td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
                    <Badge label={STATUS_LABELS[c.status]} color={STATUS_COLORS[c.status]} dot />
                  </td>
                  <td
                    style={{
                      padding: '10px 12px',
                      borderBottom: '1px solid var(--border)',
                      fontWeight: 500,
                      fontSize: '13px',
                    }}
                  >
                    {c.productModel}
                  </td>
                  <td
                    style={{
                      padding: '10px 12px',
                      borderBottom: '1px solid var(--border)',
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {PRODUCT_TYPE_LABELS[c.productType]}
                  </td>
                  <td
                    style={{
                      padding: '10px 12px',
                      borderBottom: '1px solid var(--border)',
                      fontSize: '12px',
                    }}
                  >
                    {c.customerName}
                  </td>
                  <td
                    style={{
                      padding: '10px 12px',
                      borderBottom: '1px solid var(--border)',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {c.assignedEngineer ?? '—'}
                  </td>
                  <td
                    style={{
                      padding: '10px 12px',
                      borderBottom: '1px solid var(--border)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      color: c.findings.length > 0 ? 'var(--cyan)' : 'var(--text-muted)',
                    }}
                  >
                    {c.findings.length}
                  </td>
                  <td
                    style={{
                      padding: '10px 12px',
                      borderBottom: '1px solid var(--border)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {daysSince(c.createdAt)}d
                  </td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
                    {c.isLineProblem && (
                      <span
                        style={{
                          color: 'var(--red)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          fontWeight: 600,
                          letterSpacing: '0.05em',
                        }}
                      >
                        ⚠ LINE
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
