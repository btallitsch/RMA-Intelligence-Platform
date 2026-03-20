// ─── Enums ────────────────────────────────────────────────────────────────────

export type RMAStatus =
  | 'received'
  | 'in_progress'
  | 'analysis_complete'
  | 'report_pending'
  | 'closed';

export type FailureCategory =
  | 'calcification_scale'
  | 'seal_oring_degradation'
  | 'chemical_corrosion'
  | 'moisture_water_ingress'
  | 'pcb_electrical'
  | 'mechanical_wear'
  | 'housing_crack_break'
  | 'membrane_fouling'
  | 'valve_failure'
  | 'sensor_drift'
  | 'firmware_software'
  | 'manufacturing_defect'
  | 'user_error_misuse'
  | 'thermal_damage'
  | 'unknown_tbd';

export type FailureSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ProductType =
  | 'ro_controller'
  | 'smart_water_meter'
  | 'high_pressure_pump'
  | 'filtration_unit'
  | 'uv_sterilizer'
  | 'dosing_pump'
  | 'flow_sensor'
  | 'pressure_transducer'
  | 'solenoid_valve'
  | 'other';

export type FailureOrigin =
  | 'design_flaw'
  | 'manufacturing_defect'
  | 'field_installation_error'
  | 'operator_error'
  | 'wear_end_of_life'
  | 'environmental'
  | 'undetermined';

// ─── Core Entities ─────────────────────────────────────────────────────────────

export interface RMACase {
  id: string;
  rmaNumber: string;
  createdAt: string;
  updatedAt: string;
  status: RMAStatus;

  // Product info
  productType: ProductType;
  productModel: string;
  serialNumber: string;
  firmwareVersion?: string;
  manufactureDate?: string;
  installDate?: string;
  failureDate?: string;

  // Customer info
  customerName: string;
  customerAccount?: string;
  siteLocation?: string;
  contactName?: string;
  contactEmail?: string;

  // Case summary
  customerComplaint: string;
  initialObservations: string;
  assignedEngineer?: string;

  // Findings (added during investigation)
  findings: Finding[];

  // Root cause summary (filled at close)
  rootCause?: string;
  failureOrigin?: FailureOrigin;
  correctiveAction?: string;
  preventiveAction?: string;

  // Disposition
  disposition?: 'warranty_repair' | 'warranty_replace' | 'no_fault_found' | 'out_of_warranty' | 'scrap';
  isLineProblem: boolean;
  tags: string[];
}

export interface Finding {
  id: string;
  caseId: string;
  createdAt: string;
  category: FailureCategory;
  severity: FailureSeverity;
  component: string;
  description: string;
  measurements?: string;
  photoNotes?: string;
  isRootCause: boolean;
}

// ─── Analytics Types ───────────────────────────────────────────────────────────

export interface ParetoDataPoint {
  category: FailureCategory;
  label: string;
  count: number;
  percentage: number;
  cumulative: number;
}

export interface TrendDataPoint {
  month: string;
  total: number;
  lineProblem: number;
  [key: string]: string | number;
}

export interface DashboardStats {
  totalCases: number;
  openCases: number;
  closedThisMonth: number;
  lineProblems: number;
  avgDaysToClose: number;
  topFailureCategory: string;
}

// ─── Report Types ──────────────────────────────────────────────────────────────

export interface ReportSection {
  title: string;
  content: string;
}

export interface RMAReport {
  caseId: string;
  rmaNumber: string;
  generatedAt: string;
  sections: ReportSection[];
}

// ─── UI State Types ─────────────────────────────────────────────────────────────

export type ViewPage =
  | 'dashboard'
  | 'cases'
  | 'case_detail'
  | 'analytics'
  | 'report_builder';

export interface AppState {
  currentPage: ViewPage;
  selectedCaseId: string | null;
}
