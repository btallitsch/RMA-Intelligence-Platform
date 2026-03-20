import { format, parseISO, startOfMonth } from 'date-fns';
import type { RMACase, ParetoDataPoint, TrendDataPoint, DashboardStats, Finding } from '../types';
import { FAILURE_CATEGORY_LABELS } from './constants';

// ─── Pareto Analysis ───────────────────────────────────────────────────────────

export function buildParetoData(cases: RMACase[]): ParetoDataPoint[] {
  const counts: Record<string, number> = {};

  cases.forEach((c) => {
    c.findings.forEach((f) => {
      counts[f.category] = (counts[f.category] ?? 0) + 1;
    });
  });

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total === 0) return [];

  const sorted = Object.entries(counts)
    .map(([cat, count]) => ({
      category: cat as Finding['category'],
      label: FAILURE_CATEGORY_LABELS[cat as Finding['category']] ?? cat,
      count,
      percentage: Math.round((count / total) * 100),
      cumulative: 0,
    }))
    .sort((a, b) => b.count - a.count);

  let running = 0;
  sorted.forEach((item) => {
    running += item.percentage;
    item.cumulative = running;
  });

  return sorted;
}

// ─── Trend Analysis ────────────────────────────────────────────────────────────

export function buildTrendData(cases: RMACase[]): TrendDataPoint[] {
  const buckets: Record<string, { total: number; lineProblem: number }> = {};

  cases.forEach((c) => {
    const key = format(startOfMonth(parseISO(c.createdAt)), 'MMM yy');
    if (!buckets[key]) buckets[key] = { total: 0, lineProblem: 0 };
    buckets[key].total++;
    if (c.isLineProblem) buckets[key].lineProblem++;
  });

  return Object.entries(buckets)
    .map(([month, v]) => ({ month, ...v }))
    .slice(-12);
}

// ─── Dashboard Stats ───────────────────────────────────────────────────────────

export function computeDashboardStats(cases: RMACase[]): DashboardStats {
  const now = new Date();
  const monthStart = startOfMonth(now).toISOString();

  const openCases = cases.filter((c) => c.status !== 'closed').length;
  const closedThisMonth = cases.filter(
    (c) => c.status === 'closed' && c.updatedAt >= monthStart,
  ).length;
  const lineProblems = cases.filter((c) => c.isLineProblem).length;

  const closed = cases.filter((c) => c.status === 'closed');
  let avgDays = 0;
  if (closed.length > 0) {
    const totalDays = closed.reduce((sum, c) => {
      const days = Math.round(
        (new Date(c.updatedAt).getTime() - new Date(c.createdAt).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      return sum + days;
    }, 0);
    avgDays = Math.round(totalDays / closed.length);
  }

  const pareto = buildParetoData(cases);
  const topFailure = pareto[0]?.label ?? '—';

  return {
    totalCases: cases.length,
    openCases,
    closedThisMonth,
    lineProblems,
    avgDaysToClose: avgDays,
    topFailureCategory: topFailure,
  };
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

export function generateRMANumber(): string {
  const date = format(new Date(), 'yyMMdd');
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `RMA-${date}-${rand}`;
}

export function formatDate(iso: string): string {
  return format(parseISO(iso), 'dd MMM yyyy');
}

export function formatDateTime(iso: string): string {
  return format(parseISO(iso), 'dd MMM yyyy HH:mm');
}

export function daysSince(iso: string): number {
  return Math.round(
    (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24),
  );
}
