import { useState } from 'react';
import type { RMACase, Finding, RMAStatus, FailureOrigin, ViewPage } from '../../types';
import {
  STATUS_COLORS, STATUS_LABELS, SEVERITY_COLORS, SEVERITY_LABELS,
  FAILURE_CATEGORY_LABELS, FAILURE_ORIGIN_LABELS, DISPOSITION_LABELS,
  PRODUCT_TYPE_LABELS,
} from '../../utils/constants';
import { formatDate, formatDateTime } from '../../utils/analytics';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Header } from '../layout/Header';
import { Input, Textarea, Select } from '../ui/FormField';
import { FindingFormModal } from '../cases/FindingFormModal';

interface Props {
  rmaCase: RMACase;
  onUpdate: (changes: Partial<RMACase>) => void;
  onAddFinding: (draft: Omit<Finding, 'id' | 'caseId' | 'createdAt'>) => void;
  onUpdateFinding: (findingId: string, changes: Partial<Finding>) => void;
  onDeleteFinding: (findingId: string) => void;
  onDelete: () => void;
  onNavigate: (page: ViewPage, caseId?: string) => void;
  onOpenReport: () => void;
}

type Tab = 'overview' | 'findings' | 'conclusions' | 'timeline';

export function CaseDetailPage({
  rmaCase,
  onUpdate,
  onAddFinding,
  onUpdateFinding,
  onDeleteFinding,
  onDelete,
  onNavigate,
  onOpenReport,
}: Props) {
  const [tab, setTab] = useState<Tab>('overview');
  const [showFindingModal, setShowFindingModal] = useState(false);
  const [editingFinding, setEditingFinding] = useState<Finding | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const statusOpts = Object.entries(STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }));
  const originOpts = Object.entries(FAILURE_ORIGIN_LABELS).map(([v, l]) => ({ value: v, label: l }));
  const dispositionOpts = Object.entries(DISPOSITION_LABELS).map(([v, l]) => ({ value: v, label: l }));

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'findings', label: `Findings (${rmaCase.findings.length})` },
    { id: 'conclusions', label: 'Root Cause & Actions' },
    { id: 'timeline', label: 'Timeline' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header
        title={rmaCase.rmaNumber}
        subtitle={`${rmaCase.productModel} · ${rmaCase.customerName}`}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('cases')}>
              ← Cases
            </Button>
            <Button variant="secondary" size="sm" onClick={onOpenReport}>
              Generate Report
            </Button>
            <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
              Delete
            </Button>
          </div>
        }
      />

      {/* Status bar */}
      <div
        style={{
          padding: '10px 28px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          flexShrink: 0,
        }}
      >
        <Badge label={STATUS_LABELS[rmaCase.status]} color={STATUS_COLORS[rmaCase.status]} dot size="md" />
        <Badge label={PRODUCT_TYPE_LABELS[rmaCase.productType]} color="var(--cyan)" />
        {rmaCase.isLineProblem && <Badge label="⚠ LINE PROBLEM" color="var(--red)" />}
        {rmaCase.assignedEngineer && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
            Engineer: <span style={{ color: 'var(--text-secondary)' }}>{rmaCase.assignedEngineer}</span>
          </span>
        )}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
          Updated {formatDateTime(rmaCase.updatedAt)}
        </span>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-surface)',
          padding: '0 28px',
          flexShrink: 0,
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '10px 18px',
              background: 'none',
              border: 'none',
              borderBottom: tab === t.id ? '2px solid var(--amber)' : '2px solid transparent',
              color: tab === t.id ? 'var(--amber)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.04em',
              transition: 'color 0.15s',
              marginBottom: '-1px',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

        {/* ─── OVERVIEW ─────────────────────────────────────────────────────── */}
        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '960px' }}>
            {/* Status */}
            <Card>
              <SectionTitle>Status & Classification</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Select
                  label="Case Status"
                  value={rmaCase.status}
                  onChange={(v) => onUpdate({ status: v as RMAStatus })}
                  options={statusOpts}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input
                    type="checkbox"
                    checked={rmaCase.isLineProblem}
                    onChange={(e) => onUpdate({ isLineProblem: e.target.checked })}
                    style={{ accentColor: 'var(--red)', width: '14px', height: '14px' }}
                  />
                  Flag as Line / Systemic Problem
                </label>
              </div>
            </Card>

            {/* Product */}
            <Card>
              <SectionTitle>Product Details</SectionTitle>
              <KVGrid>
                <KV label="Type" value={PRODUCT_TYPE_LABELS[rmaCase.productType]} />
                <KV label="Model" value={rmaCase.productModel} mono />
                <KV label="Serial #" value={rmaCase.serialNumber} mono />
                {rmaCase.firmwareVersion && <KV label="Firmware" value={rmaCase.firmwareVersion} mono />}
                {rmaCase.manufactureDate && <KV label="Manufactured" value={formatDate(rmaCase.manufactureDate)} />}
                {rmaCase.installDate && <KV label="Installed" value={formatDate(rmaCase.installDate)} />}
                {rmaCase.failureDate && <KV label="Failure Date" value={formatDate(rmaCase.failureDate)} />}
              </KVGrid>
            </Card>

            {/* Customer */}
            <Card>
              <SectionTitle>Customer</SectionTitle>
              <KVGrid>
                <KV label="Name" value={rmaCase.customerName} />
                {rmaCase.customerAccount && <KV label="Account" value={rmaCase.customerAccount} mono />}
                {rmaCase.siteLocation && <KV label="Site" value={rmaCase.siteLocation} />}
                {rmaCase.contactName && <KV label="Contact" value={rmaCase.contactName} />}
                {rmaCase.contactEmail && <KV label="Email" value={rmaCase.contactEmail} mono />}
              </KVGrid>
            </Card>

            {/* Complaint */}
            <Card>
              <SectionTitle>Customer Complaint</SectionTitle>
              <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--text-primary)' }}>
                {rmaCase.customerComplaint || <span style={{ color: 'var(--text-muted)' }}>No complaint recorded.</span>}
              </p>
            </Card>

            {/* Initial Observations */}
            <Card style={{ gridColumn: 'span 2' }}>
              <SectionTitle>Initial Observations (Upon Receipt)</SectionTitle>
              <Textarea
                label=""
                value={rmaCase.initialObservations}
                onChange={(v) => onUpdate({ initialObservations: v })}
                placeholder="Record visual inspection notes here…"
                rows={4}
              />
            </Card>

            {/* Tags */}
            <Card>
              <SectionTitle>Tags</SectionTitle>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {rmaCase.tags.length === 0 ? (
                  <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>No tags.</span>
                ) : (
                  rmaCase.tags.map((t) => (
                    <Badge key={t} label={t} color="var(--cyan)" />
                  ))
                )}
              </div>
            </Card>
          </div>
        )}

        {/* ─── FINDINGS ─────────────────────────────────────────────────────── */}
        {tab === 'findings' && (
          <div style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                {rmaCase.findings.length} finding{rmaCase.findings.length !== 1 ? 's' : ''} recorded
              </span>
              <Button variant="primary" size="sm" onClick={() => setShowFindingModal(true)}>
                + Add Finding
              </Button>
            </div>

            {rmaCase.findings.length === 0 ? (
              <div
                style={{
                  padding: '48px',
                  textAlign: 'center',
                  border: '1px dashed var(--border-strong)',
                  borderRadius: 'var(--radius-lg)',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                }}
              >
                No findings recorded yet.
                <br />
                Start by documenting what you observe during disassembly.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {rmaCase.findings.map((f, idx) => (
                  <div
                    key={f.id}
                    style={{
                      background: 'var(--bg-surface)',
                      border: f.isRootCause ? '1px solid var(--amber-dim)' : '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '16px 20px',
                      boxShadow: f.isRootCause ? '0 0 16px var(--amber-glow)' : undefined,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          color: 'var(--text-muted)',
                          minWidth: '24px',
                        }}
                      >
                        F{idx + 1}
                      </span>
                      {f.isRootCause && (
                        <Badge label="★ Root Cause" color="var(--amber)" />
                      )}
                      <Badge
                        label={FAILURE_CATEGORY_LABELS[f.category]}
                        color={SEVERITY_COLORS[f.severity]}
                      />
                      <Badge label={SEVERITY_LABELS[f.severity]} color={SEVERITY_COLORS[f.severity]} />
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
                        <Button variant="ghost" size="sm" onClick={() => setEditingFinding(f)}>Edit</Button>
                        <Button variant="danger" size="sm" onClick={() => onDeleteFinding(f.id)}>✕</Button>
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{f.component}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: f.measurements ? '8px' : 0 }}>
                      {f.description}
                    </div>
                    {f.measurements && (
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: 'var(--cyan)',
                          background: 'var(--bg-elevated)',
                          padding: '6px 10px',
                          borderRadius: 'var(--radius)',
                          marginTop: '8px',
                        }}
                      >
                        📐 {f.measurements}
                      </div>
                    )}
                    {f.photoNotes && (
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--text-muted)',
                          marginTop: '6px',
                          fontStyle: 'italic',
                        }}
                      >
                        📷 {f.photoNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── CONCLUSIONS ─────────────────────────────────────────────────── */}
        {tab === 'conclusions' && (
          <div style={{ maxWidth: '760px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Select
                label="Failure Origin"
                value={rmaCase.failureOrigin ?? ''}
                onChange={(v) => onUpdate({ failureOrigin: v as FailureOrigin || undefined })}
                options={originOpts}
              />
              <Select
                label="Unit Disposition"
                value={rmaCase.disposition ?? ''}
                onChange={(v) => onUpdate({ disposition: v as RMACase['disposition'] || undefined })}
                options={dispositionOpts}
              />
            </div>
            <Textarea
              label="Root Cause Summary"
              value={rmaCase.rootCause ?? ''}
              onChange={(v) => onUpdate({ rootCause: v })}
              placeholder="Summarise the definitive root cause of failure. Reference specific findings by number."
              rows={5}
            />
            <Textarea
              label="Corrective Action"
              value={rmaCase.correctiveAction ?? ''}
              onChange={(v) => onUpdate({ correctiveAction: v })}
              placeholder="Immediate actions taken to repair or replace the unit and address the failure…"
              rows={4}
            />
            <Textarea
              label="Preventive Action"
              value={rmaCase.preventiveAction ?? ''}
              onChange={(v) => onUpdate({ preventiveAction: v })}
              placeholder="Systemic changes to prevent recurrence: design updates, process changes, field bulletins…"
              rows={4}
            />
          </div>
        )}

        {/* ─── TIMELINE ────────────────────────────────────────────────────── */}
        {tab === 'timeline' && (
          <div style={{ maxWidth: '560px' }}>
            <TimelineItem
              date={rmaCase.createdAt}
              label="Case Opened"
              detail={`Assigned to ${rmaCase.assignedEngineer ?? 'unassigned'}`}
              color="var(--green)"
            />
            {rmaCase.failureDate && (
              <TimelineItem
                date={rmaCase.failureDate}
                label="Reported Failure Date"
                detail={rmaCase.productModel}
                color="var(--red)"
              />
            )}
            {rmaCase.findings.map((f, i) => (
              <TimelineItem
                key={f.id}
                date={f.createdAt}
                label={`Finding F${i + 1} Added${f.isRootCause ? ' ★' : ''}`}
                detail={`${f.component} — ${FAILURE_CATEGORY_LABELS[f.category]}`}
                color={f.isRootCause ? 'var(--amber)' : 'var(--cyan)'}
              />
            ))}
            {rmaCase.rootCause && (
              <TimelineItem
                date={rmaCase.updatedAt}
                label="Root Cause Determined"
                detail={rmaCase.rootCause.slice(0, 80) + (rmaCase.rootCause.length > 80 ? '…' : '')}
                color="var(--purple)"
              />
            )}
            <TimelineItem
              date={rmaCase.updatedAt}
              label="Last Updated"
              detail={`Status: ${STATUS_LABELS[rmaCase.status]}`}
              color="var(--text-muted)"
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {showFindingModal && (
        <FindingFormModal
          mode="add"
          onSave={(draft) => { onAddFinding(draft); setShowFindingModal(false); }}
          onClose={() => setShowFindingModal(false)}
        />
      )}
      {editingFinding && (
        <FindingFormModal
          mode="edit"
          initial={editingFinding}
          onSave={(draft) => { onUpdateFinding(editingFinding.id, draft); setEditingFinding(null); }}
          onClose={() => setEditingFinding(null)}
        />
      )}
      {confirmDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--red)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              maxWidth: '380px',
              textAlign: 'center',
            }}
          >
            <div style={{ color: 'var(--red)', fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '0.1em', marginBottom: '12px' }}>
              CONFIRM DELETE
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Permanently delete <strong style={{ color: 'var(--text-primary)' }}>{rmaCase.rmaNumber}</strong>? This cannot be undone.
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <Button variant="ghost" onClick={() => setConfirmDelete(false)}>Cancel</Button>
              <Button variant="danger" onClick={onDelete}>Delete Case</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Local sub-components ────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--amber)',
        marginBottom: '12px',
      }}
    >
      {children}
    </div>
  );
}

function KVGrid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {children}
    </div>
  );
}

function KV({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          minWidth: '90px',
          paddingTop: '1px',
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '13px',
          color: 'var(--text-primary)',
          fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
        }}
      >
        {value}
      </span>
    </div>
  );
}

function TimelineItem({ date, label, detail, color }: { date: string; label: string; detail?: string; color: string }) {
  return (
    <div style={{ display: 'flex', gap: '14px', paddingBottom: '20px', position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: color,
            flexShrink: 0,
            marginTop: '3px',
          }}
        />
        <div style={{ width: '1px', flex: 1, background: 'var(--border)', marginTop: '4px' }} />
      </div>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '2px' }}>{label}</div>
        {detail && <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{detail}</div>}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginTop: '3px' }}>
          {formatDateTime(date)}
        </div>
      </div>
    </div>
  );
}
