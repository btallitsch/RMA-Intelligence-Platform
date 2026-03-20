import { useState } from 'react';
import type { Finding, FailureCategory, FailureSeverity } from '../../types';
import { FAILURE_CATEGORY_LABELS, SEVERITY_LABELS } from '../../utils/constants';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Textarea, Select } from '../ui/FormField';

type FindingDraft = Omit<Finding, 'id' | 'caseId' | 'createdAt'>;

const EMPTY: FindingDraft = {
  category: 'unknown_tbd',
  severity: 'medium',
  component: '',
  description: '',
  measurements: '',
  photoNotes: '',
  isRootCause: false,
};

interface Props {
  initial?: Partial<Finding>;
  onSave: (draft: FindingDraft) => void;
  onClose: () => void;
  mode: 'add' | 'edit';
}

export function FindingFormModal({ initial, onSave, onClose, mode }: Props) {
  const [form, setForm] = useState<FindingDraft>({ ...EMPTY, ...initial });
  const [errors, setErrors] = useState<Partial<Record<keyof FindingDraft, string>>>({});

  function set<K extends keyof FindingDraft>(key: K, value: FindingDraft[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate() {
    const e: typeof errors = {};
    if (!form.component.trim()) e.component = 'Required';
    if (!form.description.trim()) e.description = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (validate()) onSave(form);
  }

  const categoryOpts = Object.entries(FAILURE_CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l }));
  const severityOpts = Object.entries(SEVERITY_LABELS).map(([v, l]) => ({ value: v, label: l }));

  return (
    <Modal
      title={mode === 'add' ? 'Add Finding' : 'Edit Finding'}
      onClose={onClose}
      width="580px"
      actions={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            {mode === 'add' ? 'Add Finding' : 'Save'}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Select
            label="Failure Category"
            value={form.category}
            onChange={(v) => set('category', v as FailureCategory)}
            options={categoryOpts}
          />
          <Select
            label="Severity"
            value={form.severity}
            onChange={(v) => set('severity', v as FailureSeverity)}
            options={severityOpts}
          />
        </div>
        <Input
          label="Component / Location"
          value={form.component}
          onChange={(v) => set('component', v)}
          placeholder="e.g. Main PCB, Mechanical Seal, Discharge Check Valve"
          required
          error={errors.component}
        />
        <Textarea
          label="Finding Description"
          value={form.description}
          onChange={(v) => set('description', v)}
          placeholder="Detailed description of the observed failure, damage, or anomaly…"
          required
          error={errors.description}
          rows={4}
        />
        <Input
          label="Measurements / Test Data"
          value={form.measurements ?? ''}
          onChange={(v) => set('measurements', v)}
          placeholder="e.g. Insulation resistance: 0.4 MΩ (spec: >10 MΩ)"
          mono
          hint="Include units and spec values where available"
        />
        <Input
          label="Photo Reference Notes"
          value={form.photoNotes ?? ''}
          onChange={(v) => set('photoNotes', v)}
          placeholder="e.g. IMG_0042 – close-up of corroded trace"
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px' }}>
          <input
            type="checkbox"
            checked={form.isRootCause}
            onChange={(e) => set('isRootCause', e.target.checked)}
            style={{ accentColor: 'var(--amber)', width: '14px', height: '14px' }}
          />
          <div>
            <strong>Mark as Root Cause</strong>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Only one finding should be designated as the primary root cause.
            </div>
          </div>
        </label>
      </div>
    </Modal>
  );
}
