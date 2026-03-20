import { format, parseISO } from 'date-fns';
import type { RMACase, RMAReport } from '../types';
import {
  FAILURE_CATEGORY_LABELS,
  PRODUCT_TYPE_LABELS,
  STATUS_LABELS,
  SEVERITY_LABELS,
  FAILURE_ORIGIN_LABELS,
  DISPOSITION_LABELS,
} from './constants';

function safeFormatDate(iso: string | undefined | null): string {
  if (!iso) return '—';
  try {
    const d = parseISO(iso);
    if (isNaN(d.getTime())) return '—';
    return format(d, 'dd MMM yyyy');
  } catch { return '—'; }
}

export function generateReport(rmaCase: RMACase): RMAReport {
  const now = new Date().toISOString();
  const sections = [];

  // 1 ─ Header / Case Overview
  sections.push({
    title: '1. CASE OVERVIEW',
    content: [
      `RMA Number:        ${rmaCase.rmaNumber}`,
      `Report Date:       ${format(new Date(), 'dd MMMM yyyy')}`,
      `Engineer:          ${rmaCase.assignedEngineer ?? 'Unassigned'}`,
      `Status:            ${STATUS_LABELS[rmaCase.status]}`,
      ``,
      `Customer:          ${rmaCase.customerName}`,
      `Account:           ${rmaCase.customerAccount ?? '—'}`,
      `Site Location:     ${rmaCase.siteLocation ?? '—'}`,
      `Contact:           ${rmaCase.contactName ?? '—'}  |  ${rmaCase.contactEmail ?? '—'}`,
    ].join('\n'),
  });

  // 2 ─ Product Information
  sections.push({
    title: '2. PRODUCT INFORMATION',
    content: [
      `Product Type:      ${PRODUCT_TYPE_LABELS[rmaCase.productType]}`,
      `Model:             ${rmaCase.productModel}`,
      `Serial Number:     ${rmaCase.serialNumber}`,
      `Firmware:          ${rmaCase.firmwareVersion ?? '—'}`,
      `Manufacture Date:  ${safeFormatDate(rmaCase.manufactureDate)}`,
      `Installation Date: ${safeFormatDate(rmaCase.installDate)}`,
      `Failure Date:      ${safeFormatDate(rmaCase.failureDate)}`,
    ].join('\n'),
  });

  // 3 ─ Customer Complaint
  sections.push({
    title: '3. CUSTOMER COMPLAINT',
    content: rmaCase.customerComplaint || 'No complaint description provided.',
  });

  // 4 ─ Initial Observations
  sections.push({
    title: '4. INITIAL OBSERVATIONS (UPON RECEIPT)',
    content: rmaCase.initialObservations || 'No initial observations recorded.',
  });

  // 5 ─ Failure Analysis Findings
  const findingLines: string[] = [];
  if (rmaCase.findings.length === 0) {
    findingLines.push('No findings recorded.');
  } else {
    rmaCase.findings.forEach((f, idx) => {
      findingLines.push(`Finding ${idx + 1}${f.isRootCause ? ' ★ ROOT CAUSE' : ''}`);
      findingLines.push(`  Category:     ${FAILURE_CATEGORY_LABELS[f.category]}`);
      findingLines.push(`  Severity:     ${SEVERITY_LABELS[f.severity]}`);
      findingLines.push(`  Component:    ${f.component}`);
      findingLines.push(`  Description:  ${f.description}`);
      if (f.measurements) findingLines.push(`  Measurements: ${f.measurements}`);
      if (f.photoNotes) findingLines.push(`  Photo Notes:  ${f.photoNotes}`);
      findingLines.push('');
    });
  }
  sections.push({
    title: '5. FAILURE ANALYSIS FINDINGS',
    content: findingLines.join('\n'),
  });

  // 6 ─ Root Cause Determination
  sections.push({
    title: '6. ROOT CAUSE DETERMINATION',
    content: [
      `Root Cause Summary:\n${rmaCase.rootCause ?? 'Pending determination.'}`,
      '',
      `Failure Origin: ${rmaCase.failureOrigin ? FAILURE_ORIGIN_LABELS[rmaCase.failureOrigin] : '—'}`,
      `Line / Systemic Problem: ${rmaCase.isLineProblem ? 'YES – Escalate to Quality Engineering' : 'No – Isolated incident'}`,
    ].join('\n'),
  });

  // 7 ─ Corrective & Preventive Actions
  sections.push({
    title: '7. CORRECTIVE & PREVENTIVE ACTIONS',
    content: [
      `Corrective Action:\n${rmaCase.correctiveAction ?? 'Pending.'}`,
      '',
      `Preventive Action:\n${rmaCase.preventiveAction ?? 'Pending.'}`,
    ].join('\n'),
  });

  // 8 ─ Disposition
  sections.push({
    title: '8. UNIT DISPOSITION',
    content: rmaCase.disposition
      ? DISPOSITION_LABELS[rmaCase.disposition]
      : 'Pending disposition decision.',
  });

  // 9 ─ Tags / Classification
  if (rmaCase.tags.length > 0) {
    sections.push({
      title: '9. TAGS / CLASSIFICATION',
      content: rmaCase.tags.join(', '),
    });
  }

  return { caseId: rmaCase.id, rmaNumber: rmaCase.rmaNumber, generatedAt: now, sections };
}

export function reportToText(report: RMAReport): string {
  const divider = '═'.repeat(72);
  const lines: string[] = [
    divider,
    `  RMA FAILURE ANALYSIS REPORT`,
    `  ${report.rmaNumber}`,
    `  Generated: ${format(parseISO(report.generatedAt), 'dd MMM yyyy HH:mm')}`,
    divider,
    '',
  ];
  report.sections.forEach((s) => {
    lines.push(`${'─'.repeat(72)}`);
    lines.push(`  ${s.title}`);
    lines.push(`${'─'.repeat(72)}`);
    lines.push(s.content);
    lines.push('');
  });
  lines.push(divider);
  return lines.join('\n');
}
