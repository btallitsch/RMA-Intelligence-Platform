import type { FailureCategory, FailureSeverity, FailureOrigin, ProductType, RMAStatus } from '../types';

export const FAILURE_CATEGORY_LABELS: Record<FailureCategory, string> = {
  calcification_scale: 'Calcification / Scale Buildup',
  seal_oring_degradation: 'Seal / O-Ring Degradation',
  chemical_corrosion: 'Chemical Corrosion',
  moisture_water_ingress: 'Moisture / Water Ingress',
  pcb_electrical: 'PCB / Electrical Failure',
  mechanical_wear: 'Mechanical Wear',
  housing_crack_break: 'Housing Crack / Break',
  membrane_fouling: 'Membrane Fouling',
  valve_failure: 'Valve Failure',
  sensor_drift: 'Sensor Drift / Calibration',
  firmware_software: 'Firmware / Software Issue',
  manufacturing_defect: 'Manufacturing Defect',
  user_error_misuse: 'User Error / Misuse',
  thermal_damage: 'Thermal Damage',
  unknown_tbd: 'Unknown / TBD',
};

export const FAILURE_CATEGORY_COLORS: Record<FailureCategory, string> = {
  calcification_scale: '#f59e0b',
  seal_oring_degradation: '#ef4444',
  chemical_corrosion: '#8b5cf6',
  moisture_water_ingress: '#06b6d4',
  pcb_electrical: '#ec4899',
  mechanical_wear: '#f97316',
  housing_crack_break: '#84cc16',
  membrane_fouling: '#14b8a6',
  valve_failure: '#6366f1',
  sensor_drift: '#a78bfa',
  firmware_software: '#22d3ee',
  manufacturing_defect: '#fb7185',
  user_error_misuse: '#34d399',
  thermal_damage: '#fbbf24',
  unknown_tbd: '#64748b',
};

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  ro_controller: 'Reverse Osmosis Controller',
  smart_water_meter: 'Smart Water Meter',
  high_pressure_pump: 'High-Pressure Pump',
  filtration_unit: 'Filtration Unit',
  uv_sterilizer: 'UV Sterilizer',
  dosing_pump: 'Dosing Pump',
  flow_sensor: 'Flow Sensor',
  pressure_transducer: 'Pressure Transducer',
  solenoid_valve: 'Solenoid Valve',
  other: 'Other',
};

export const STATUS_LABELS: Record<RMAStatus, string> = {
  received: 'Received',
  in_progress: 'In Progress',
  analysis_complete: 'Analysis Complete',
  report_pending: 'Report Pending',
  closed: 'Closed',
};

export const STATUS_COLORS: Record<RMAStatus, string> = {
  received: '#64748b',
  in_progress: '#f59e0b',
  analysis_complete: '#06b6d4',
  report_pending: '#8b5cf6',
  closed: '#10b981',
};

export const SEVERITY_COLORS: Record<FailureSeverity, string> = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
  critical: '#dc2626',
};

export const SEVERITY_LABELS: Record<FailureSeverity, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const FAILURE_ORIGIN_LABELS: Record<FailureOrigin, string> = {
  design_flaw: 'Design Flaw',
  manufacturing_defect: 'Manufacturing Defect',
  field_installation_error: 'Field / Installation Error',
  operator_error: 'Operator Error',
  wear_end_of_life: 'Wear / End of Life',
  environmental: 'Environmental',
  undetermined: 'Undetermined',
};

export const DISPOSITION_LABELS = {
  warranty_repair: 'Warranty Repair',
  warranty_replace: 'Warranty Replace',
  no_fault_found: 'No Fault Found',
  out_of_warranty: 'Out of Warranty',
  scrap: 'Scrap',
};
