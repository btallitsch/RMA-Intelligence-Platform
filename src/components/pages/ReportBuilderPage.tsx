import { useState } from 'react';
import type { RMACase } from '../../types';
import { generateReport, reportToText } from '../../utils/reportGenerator';
import { STATUS_LABELS, STATUS_COLORS } from '../../utils/constants';
import { formatDate } from '../../utils/analytics';
import { Header } from '../layout/Header';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface Props {
  cases: RMACase[];
  initialCaseId?: string | null;
}

export function ReportBuilderPage({ cases, initialCaseId }: Props) {
  const [selectedId, setSelectedId] = useState<string>(initialCaseId ?? '');
  const [reportText, setReportText] = useState('');
  const [generated, setGenerated] = useState(false);

  const selected = cases.find((c) => c.id === selectedId) ?? null;

  function handleGenerate() {
    if (!selected) return;
    const report = generateReport(selected);
    setReportText(reportToText(report));
    setGenerated(true);
  }

  function handleCopy() {
    navigator.clipboard.writeText(reportText);
  }

  function handleDownload() {
    if (!selected) return;
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selected.rmaNumber}-report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const closedCases = cases.filter((c) => c.status !== 'received');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title="Report Builder"
        subtitle="Generate structured failure analysis reports"
      />

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '300px 1fr', overflow: 'hidden' }}>

        {/* Case Selector Panel */}
        <div
          style={{
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--border)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              flexShrink: 0,
            }}
          >
            Select Case
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {closedCases.length === 0 ? (
              <div style={{ padding: '20px 16px', color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                No cases available. Open and investigate RMA cases first.
              </div>
            ) : (
              closedCases
                .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
                .map((c) => (
                  <div
                    key={c.id}
                    onClick={() => { setSelectedId(c.id); setGenerated(false); }}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      background: selectedId === c.id ? 'var(--bg-active)' : 'transparent',
                      borderLeft: selectedId === c.id ? '2px solid var(--amber)' : '2px solid transparent',
                      borderBottom: '1px solid var(--border)',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedId !== c.id)
                        (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-hover)';
                    }}
                    onMouseLeave={(e) => {
                      if (selectedId !== c.id)
                        (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber)', marginBottom: '3px' }}>
                      {c.rmaNumber}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 500, marginBottom: '4px' }}>{c.productModel}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>{c.customerName}</div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <Badge label={STATUS_LABELS[c.status]} color={STATUS_COLORS[c.status]} dot />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                        {formatDate(c.updatedAt)}
                      </span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Report Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {!selected ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '32px' }}>◪</span>
              Select a case from the panel to generate a report.
            </div>
          ) : (
            <>
              {/* Report toolbar */}
              <div
                style={{
                  padding: '12px 20px',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    {selected.rmaNumber} · {selected.productModel}
                  </div>
                </div>
                <Button variant="primary" size="sm" onClick={handleGenerate}>
                  {generated ? '↻ Regenerate' : 'Generate Report'}
                </Button>
                {generated && (
                  <>
                    <Button variant="secondary" size="sm" onClick={handleCopy}>Copy</Button>
                    <Button variant="ghost" size="sm" onClick={handleDownload}>Download .txt</Button>
                  </>
                )}
              </div>

              {/* Report preview */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                {!generated ? (
                  <Card style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px', marginBottom: '16px' }}>
                      Ready to generate report for {selected.rmaNumber}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
                      <InfoPill label="Findings" value={selected.findings.length.toString()} />
                      <InfoPill label="Root Cause" value={selected.rootCause ? '✓' : '—'} />
                      <InfoPill label="Corrective Action" value={selected.correctiveAction ? '✓' : '—'} />
                      <InfoPill label="Disposition" value={selected.disposition ?? '—'} />
                    </div>
                    <Button variant="primary" onClick={handleGenerate}>Generate Report</Button>
                  </Card>
                ) : (
                  <pre
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      lineHeight: 1.8,
                      color: 'var(--text-primary)',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '24px',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {reportText}
                  </pre>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '8px 16px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontSize: '14px', fontWeight: 600, color: value === '—' ? 'var(--text-muted)' : 'var(--cyan)' }}>
        {value}
      </div>
    </div>
  );
}
