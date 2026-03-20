import { useState } from 'react';
import type { ViewPage } from './types';
import { useCases } from './hooks/useCases';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardPage } from './components/pages/DashboardPage';
import { CasesPage } from './components/pages/CasesPage';
import { CaseDetailPage } from './components/pages/CaseDetailPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { ReportBuilderPage } from './components/pages/ReportBuilderPage';
import { CaseFormModal } from './components/cases/CaseFormModal';
import type { RMACase } from './types';

export default function App() {
  const [page, setPage] = useState<ViewPage>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [showNewCase, setShowNewCase] = useState(false);
  const [reportCaseId, setReportCaseId] = useState<string | null>(null);

  const {
    cases,
    createCase,
    updateCase,
    deleteCase,
    getCaseById,
    addFinding,
    updateFinding,
    deleteFinding,
    resetToDemo,
  } = useCases();

  function navigate(target: ViewPage, caseId?: string) {
    setPage(target);
    if (caseId) setSelectedCaseId(caseId);
    if (target === 'report_builder' && caseId) setReportCaseId(caseId);
  }

  const selectedCase = selectedCaseId ? getCaseById(selectedCaseId) : null;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar currentPage={page} onNavigate={(p) => navigate(p)} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        {/* Demo reset strip */}
        <div
          style={{
            background: 'var(--bg-elevated)',
            borderBottom: '1px solid var(--border)',
            padding: '4px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0,
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
            LOCAL STORAGE · {cases.length} cases
          </span>
          <button
            onClick={resetToDemo}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--amber)',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              marginLeft: 'auto',
              opacity: 0.7,
              letterSpacing: '0.04em',
            }}
          >
            ↺ Reset Demo Data
          </button>
        </div>

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {page === 'dashboard' && (
            <DashboardPage
              cases={cases}
              onNavigate={navigate}
              onNewCase={() => setShowNewCase(true)}
            />
          )}

          {page === 'cases' && (
            <CasesPage
              cases={cases}
              onNavigate={navigate}
              onNewCase={() => setShowNewCase(true)}
            />
          )}

          {page === 'case_detail' && selectedCase && (
            <CaseDetailPage
              rmaCase={selectedCase}
              onUpdate={(changes) => updateCase(selectedCase.id, changes)}
              onAddFinding={(draft) => addFinding(selectedCase.id, draft)}
              onUpdateFinding={(fid, changes) => updateFinding(selectedCase.id, fid, changes)}
              onDeleteFinding={(fid) => deleteFinding(selectedCase.id, fid)}
              onDelete={() => {
                deleteCase(selectedCase.id);
                setSelectedCaseId(null);
                setPage('cases');
              }}
              onNavigate={navigate}
              onOpenReport={() => {
                setReportCaseId(selectedCase.id);
                setPage('report_builder');
              }}
            />
          )}

          {page === 'analytics' && <AnalyticsPage cases={cases} />}

          {page === 'report_builder' && (
            <ReportBuilderPage cases={cases} initialCaseId={reportCaseId} />
          )}
        </div>
      </main>

      {showNewCase && (
        <CaseFormModal
          mode="create"
          onSave={(draft) => {
            const newCase = createCase(draft as Omit<RMACase, 'id' | 'rmaNumber' | 'createdAt' | 'updatedAt' | 'findings'>);
            setShowNewCase(false);
            navigate('case_detail', newCase.id);
          }}
          onClose={() => setShowNewCase(false)}
        />
      )}
    </div>
  );
}
