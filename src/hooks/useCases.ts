import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { RMACase, Finding } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { generateRMANumber } from '../utils/analytics';
import { generateSeedData } from '../utils/seedData';

const STORAGE_KEY = 'rma_tool_v1_cases';

function getInitialCases(): RMACase[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as RMACase[];
  } catch {/* */}
  return generateSeedData();
}

export function useCases() {
  const [cases, setCases] = useLocalStorage<RMACase[]>(STORAGE_KEY, getInitialCases());

  // ─── Case CRUD ────────────────────────────────────────────────────────────────

  const createCase = useCallback(
    (draft: Omit<RMACase, 'id' | 'rmaNumber' | 'createdAt' | 'updatedAt' | 'findings'>): RMACase => {
      const newCase: RMACase = {
        ...draft,
        id: uuidv4(),
        rmaNumber: generateRMANumber(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        findings: [],
      };
      setCases((prev) => [newCase, ...prev]);
      return newCase;
    },
    [setCases],
  );

  const updateCase = useCallback(
    (id: string, changes: Partial<RMACase>) => {
      setCases((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, ...changes, updatedAt: new Date().toISOString() } : c,
        ),
      );
    },
    [setCases],
  );

  const deleteCase = useCallback(
    (id: string) => {
      setCases((prev) => prev.filter((c) => c.id !== id));
    },
    [setCases],
  );

  const getCaseById = useCallback(
    (id: string) => cases.find((c) => c.id === id) ?? null,
    [cases],
  );

  // ─── Finding CRUD ─────────────────────────────────────────────────────────────

  const addFinding = useCallback(
    (caseId: string, draft: Omit<Finding, 'id' | 'caseId' | 'createdAt'>): Finding => {
      const finding: Finding = {
        ...draft,
        id: uuidv4(),
        caseId,
        createdAt: new Date().toISOString(),
      };
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? { ...c, findings: [...c.findings, finding], updatedAt: new Date().toISOString() }
            : c,
        ),
      );
      return finding;
    },
    [setCases],
  );

  const updateFinding = useCallback(
    (caseId: string, findingId: string, changes: Partial<Finding>) => {
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? {
                ...c,
                findings: c.findings.map((f) => (f.id === findingId ? { ...f, ...changes } : f)),
                updatedAt: new Date().toISOString(),
              }
            : c,
        ),
      );
    },
    [setCases],
  );

  const deleteFinding = useCallback(
    (caseId: string, findingId: string) => {
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? {
                ...c,
                findings: c.findings.filter((f) => f.id !== findingId),
                updatedAt: new Date().toISOString(),
              }
            : c,
        ),
      );
    },
    [setCases],
  );

  const resetToDemo = useCallback(() => {
    setCases(generateSeedData());
  }, [setCases]);

  return {
    cases,
    createCase,
    updateCase,
    deleteCase,
    getCaseById,
    addFinding,
    updateFinding,
    deleteFinding,
    resetToDemo,
  };
}
