import { useState } from 'react';
import type { RMACase, ProductType, RMAStatus } from '../../types';
import { PRODUCT_TYPE_LABELS, STATUS_LABELS } from '../../utils/constants';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Textarea, Select } from '../ui/FormField';

type CaseDraft = Omit<RMACase, 'id' | 'rmaNumber' | 'createdAt' | 'updatedAt' | 'findings'>;

const EMPTY: CaseDraft = {
  status: 'received',
  productType: 'ro_controller',
  productModel: '',
  serialNumber: '',
  firmwareVersion: '',
  manufactureDate: '',
  installDate: '',
  failureDate: '',
  customerName: '',
  customerAccount: '',
  siteLocation: '',
  contactName: '',
  contactEmail: '',
  customerComplaint: '',
  initialObservations: '',
  assignedEngineer: '',
  isLineProblem: false,
  tags: [],
};

interface Props {
  initial?: Partial<RMACase>;
  onSave: (draft: CaseDraft) => void;
  onClose: () => void;
  mode: 'create' | 'edit';
}

export function CaseFormModal({ initial, onSave, onClose, mode }: Props) {
  const [form, setForm] = useState<CaseDraft>({ ...EMPTY, ...initial });
  const [errors, setErrors] = useState<Partial<Record<keyof CaseDraft, string>>>({});
  const [tagsInput, setTagsInput] = useState(initial?.tags?.join(', ') ?? '');

  function set<K extends keyof CaseDraft>(key: K, value: CaseDraft[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.productModel.trim()) e.productModel = 'Required';
    if (!form.serialNumber.trim()) e.serialNumber = 'Required';
    if (!form.customerName.trim()) e.customerName = 'Required';
    if (!form.customerComplaint.trim()) e.customerComplaint = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    onSave({ ...form, tags });
  }

  const productOpts = Object.entries(PRODUCT_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }));
  const statusOpts = Object.entries(STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }));

  const sectionLabel = (text: string) => (
    <div
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: '9px',
        letterSpacing: '0.15em',
        color: 'var(--amber)',
        textTransform: 'uppercase',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '6px',
        marginBottom: '14px',
        marginTop: '4px',
      }}
    >
      {text}
    </div>
  );

  return (
    <Modal
      title={mode === 'create' ? 'Open New RMA Case' : 'Edit RMA Case'}
      onClose={onClose}
      width="680px"
      actions={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            {mode === 'create' ? 'Open Case' : 'Save Changes'}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {sectionLabel('Product Information')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Select
            label="Product Type"
            value={form.productType}
            onChange={(v) => set('productType', v as ProductType)}
            options={productOpts}
            required
          />
          <Input label="Product Model" value={form.productModel} onChange={(v) => set('productModel', v)}
            placeholder="e.g. AquaLogic Pro 5000" required error={errors.productModel} />
          <Input label="Serial Number" value={form.serialNumber} onChange={(v) => set('serialNumber', v)}
            placeholder="e.g. ALP5-2024-00123" required error={errors.serialNumber} mono />
          <Input label="Firmware Version" value={form.firmwareVersion ?? ''} onChange={(v) => set('firmwareVersion', v)}
            placeholder="e.g. 3.1.2" mono />
          <Input label="Manufacture Date" value={form.manufactureDate ?? ''} onChange={(v) => set('manufactureDate', v)} type="date" />
          <Input label="Install Date" value={form.installDate ?? ''} onChange={(v) => set('installDate', v)} type="date" />
          <Input label="Failure Date" value={form.failureDate ?? ''} onChange={(v) => set('failureDate', v)} type="date" />
          <Select label="Status" value={form.status} onChange={(v) => set('status', v as RMAStatus)} options={statusOpts} />
        </div>

        {sectionLabel('Customer Information')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input label="Customer Name" value={form.customerName} onChange={(v) => set('customerName', v)}
            placeholder="Company name" required error={errors.customerName} />
          <Input label="Account #" value={form.customerAccount ?? ''} onChange={(v) => set('customerAccount', v)}
            placeholder="CMA-0041" mono />
          <Input label="Site Location" value={form.siteLocation ?? ''} onChange={(v) => set('siteLocation', v)}
            placeholder="Plant, City, State" style={{ gridColumn: 'span 2' }} />
          <Input label="Contact Name" value={form.contactName ?? ''} onChange={(v) => set('contactName', v)} />
          <Input label="Contact Email" value={form.contactEmail ?? ''} onChange={(v) => set('contactEmail', v)}
            type="email" />
        </div>

        {sectionLabel('Case Details')}
        <Textarea label="Customer Complaint" value={form.customerComplaint} onChange={(v) => set('customerComplaint', v)}
          placeholder="Describe the reported failure in detail…" required error={errors.customerComplaint} rows={3} />
        <Textarea label="Initial Observations (upon receipt)" value={form.initialObservations}
          onChange={(v) => set('initialObservations', v)}
          placeholder="Visual inspection notes, packaging condition, visible damage…" rows={3} />

        {sectionLabel('Assignment & Classification')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input label="Assigned Engineer" value={form.assignedEngineer ?? ''} onChange={(v) => set('assignedEngineer', v)}
            placeholder="e.g. S. Chen" />
          <Input label="Tags (comma-separated)" value={tagsInput} onChange={setTagsInput}
            placeholder="moisture, pcb, seal" mono />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={form.isLineProblem}
                onChange={(e) => set('isLineProblem', e.target.checked)}
                style={{ accentColor: 'var(--red)', width: '14px', height: '14px' }}
              />
              <span>Flag as Line / Systemic Problem</span>
            </label>
          </div>
        </div>
      </div>
    </Modal>
  );
}
