import { v4 as uuidv4 } from 'uuid';
import { subDays, subMonths, formatISO } from 'date-fns';
import type { RMACase, Finding } from '../types';

function d(daysAgo: number): string {
  return formatISO(subDays(new Date(), daysAgo));
}

function m(monthsAgo: number): string {
  return formatISO(subMonths(new Date(), monthsAgo));
}

function makeFinding(
  caseId: string,
  overrides: Partial<Finding> = {},
): Finding {
  return {
    id: uuidv4(),
    caseId,
    createdAt: new Date().toISOString(),
    category: 'unknown_tbd',
    severity: 'medium',
    component: 'Unknown Component',
    description: 'No description',
    isRootCause: false,
    ...overrides,
  };
}

export function generateSeedData(): RMACase[] {
  const case1Id = uuidv4();
  const case2Id = uuidv4();
  const case3Id = uuidv4();
  const case4Id = uuidv4();
  const case5Id = uuidv4();
  const case6Id = uuidv4();

  return [
    {
      id: case1Id,
      rmaNumber: 'RMA-250310-4821',
      createdAt: d(14),
      updatedAt: d(2),
      status: 'analysis_complete',
      productType: 'ro_controller',
      productModel: 'AquaLogic Pro 5000',
      serialNumber: 'ALP5-2023-00482',
      firmwareVersion: '3.1.2',
      manufactureDate: m(18),
      installDate: m(14),
      failureDate: d(20),
      customerName: 'Clearwater Municipal Authority',
      customerAccount: 'CMA-0041',
      siteLocation: 'Treatment Plant B, Phoenix AZ',
      contactName: 'James Rowe',
      contactEmail: 'j.rowe@clearwater.gov',
      customerComplaint:
        'Controller displaying "High TDS alarm" continuously. Unit unresponsive to manual reset. RO system offline causing production shutdown.',
      initialObservations:
        'White crystalline deposit on PCB near sensor inputs. Visible moisture staining on board. Membrane connector corroded.',
      findings: [
        makeFinding(case1Id, {
          category: 'moisture_water_ingress',
          severity: 'high',
          component: 'Main PCB',
          description:
            'Moisture ingress via improperly sealed cable entry port. Corrosion on J4 connector and surrounding traces.',
          measurements: 'Insulation resistance at J4: 0.4 MΩ (spec: >10 MΩ)',
          isRootCause: true,
        }),
        makeFinding(case1Id, {
          category: 'calcification_scale',
          severity: 'medium',
          component: 'TDS Sensor Probe',
          description:
            'Heavy calcium carbonate scale on probe electrodes. Contributing factor to false alarm.',
          measurements: 'Scale thickness: ~1.2 mm',
        }),
      ],
      rootCause:
        'Water ingress through unsealed cable gland (PG-7 fitting). The O-ring in the gland was missing, allowing process water to reach the PCB. Combined with calcified TDS probe, the unit latched into a continuous fault state.',
      failureOrigin: 'field_installation_error',
      correctiveAction:
        'Replace main PCB, TDS probe. Install new cable gland with O-ring. Clean and inspect all entry points.',
      preventiveAction:
        'Update installation checklist to include cable gland O-ring inspection. Add sealing torque specification to IOM document.',
      disposition: 'warranty_repair',
      isLineProblem: false,
      tags: ['moisture', 'cable_gland', 'pcb', 'installation_error'],
      assignedEngineer: 'S. Chen',
    },

    {
      id: case2Id,
      rmaNumber: 'RMA-250305-3317',
      createdAt: d(18),
      updatedAt: d(18),
      status: 'in_progress',
      productType: 'high_pressure_pump',
      productModel: 'HydroForce 800',
      serialNumber: 'HF800-2023-01155',
      manufactureDate: m(22),
      installDate: m(19),
      failureDate: d(20),
      customerName: 'Pacific Desalination LLC',
      customerAccount: 'PDL-0089',
      siteLocation: 'San Diego Desalination Facility',
      contactName: 'Maria Santos',
      contactEmail: 'msantos@pacdes.com',
      customerComplaint:
        'Pump vibrating excessively and output pressure dropping from rated 800 psi to approximately 520 psi over 6 weeks.',
      initialObservations:
        'Visible scoring on pump shaft. Mechanical seal shows weeping. Impeller has minor chipping on two vanes.',
      findings: [
        makeFinding(case2Id, {
          category: 'seal_oring_degradation',
          severity: 'high',
          component: 'Mechanical Seal',
          description:
            'Seal faces show pitting and wear beyond service limits. EPDM O-ring hardened and cracked.',
          measurements: 'Seal face flatness: 4.2 µm (spec: <1.5 µm)',
          isRootCause: false,
        }),
        makeFinding(case2Id, {
          category: 'calcification_scale',
          severity: 'medium',
          component: 'Impeller',
          description:
            'Scale deposits causing imbalance and contributing to vibration.',
        }),
      ],
      isLineProblem: false,
      tags: ['seal', 'vibration', 'pump', 'pressure_loss'],
      assignedEngineer: 'T. Morgan',
    },

    {
      id: case3Id,
      rmaNumber: 'RMA-250228-9944',
      createdAt: d(24),
      updatedAt: d(5),
      status: 'closed',
      productType: 'smart_water_meter',
      productModel: 'AquaMeter V3',
      serialNumber: 'AMV3-2022-03341',
      firmwareVersion: '2.0.5',
      manufactureDate: m(28),
      installDate: m(25),
      failureDate: d(28),
      customerName: 'Rio Verde Utilities',
      customerAccount: 'RVU-0022',
      siteLocation: 'Distribution Network Zone 7',
      contactName: 'Ben Okafor',
      contactEmail: 'b.okafor@rioverde.com',
      customerComplaint:
        'Meter reporting zero flow despite confirmed active service. Billing discrepancies flagged by customer.',
      initialObservations:
        'Unit physically intact. Display shows dashes on flow reading. Battery at 1.8V. Communication module unresponsive.',
      findings: [
        makeFinding(case3Id, {
          category: 'pcb_electrical',
          severity: 'critical',
          component: 'Ultrasonic Transducer PCB',
          description:
            'Hairline crack on PCB trace between U3 and J7. Crack propagated from mounting stress point.',
          measurements: 'Continuity test: OPEN between TP3-TP4 (spec: <2 Ω)',
          isRootCause: true,
        }),
      ],
      rootCause:
        'Fractured PCB trace caused by torque over-specification on the field-replaceable module mounting screws. Consistent with torque marks exceeding 0.6 Nm on M2.5 fasteners.',
      failureOrigin: 'field_installation_error',
      correctiveAction: 'Replace ultrasonic PCB. Unit returned to service.',
      preventiveAction:
        'Issue field bulletin specifying correct torque value. Explore self-limiting captive screw design for next revision.',
      disposition: 'warranty_repair',
      isLineProblem: true,
      tags: ['pcb', 'torque', 'ultrasonic', 'line_problem', 'field_bulletin'],
      assignedEngineer: 'S. Chen',
    },

    {
      id: case4Id,
      rmaNumber: 'RMA-250220-7721',
      createdAt: m(1),
      updatedAt: m(1),
      status: 'in_progress',
      productType: 'dosing_pump',
      productModel: 'ChemDose 50',
      serialNumber: 'CD50-2024-00881',
      manufactureDate: m(10),
      installDate: m(8),
      failureDate: m(1),
      customerName: 'NuWater Industrial',
      customerAccount: 'NWI-0105',
      siteLocation: 'Plant 3 – Chlorination Stage',
      contactName: 'Ravi Patel',
      contactEmail: 'r.patel@nuwater.com',
      customerComplaint:
        'Dosing pump delivering inconsistent volumes. Some strokes produce no output.',
      initialObservations:
        'Diaphragm shows signs of chemical attack. Check valves stained yellow.',
      findings: [
        makeFinding(case4Id, {
          category: 'chemical_corrosion',
          severity: 'high',
          component: 'Diaphragm',
          description:
            'PTFE-coated diaphragm shows significant blistering and pinhole perforations consistent with exposure to undiluted sodium hypochlorite above rated concentration.',
          isRootCause: true,
        }),
        makeFinding(case4Id, {
          category: 'valve_failure',
          severity: 'medium',
          component: 'Discharge Check Valve',
          description: 'Ball seat fouled with chemical precipitate. Flow intermittent.',
        }),
      ],
      isLineProblem: false,
      tags: ['chemical', 'diaphragm', 'dosing', 'chlorine'],
      assignedEngineer: 'T. Morgan',
    },

    {
      id: case5Id,
      rmaNumber: 'RMA-250115-5502',
      createdAt: m(2),
      updatedAt: m(2).replace('T', 'U'),
      status: 'closed',
      productType: 'pressure_transducer',
      productModel: 'PressureSense 600',
      serialNumber: 'PS600-2023-04422',
      manufactureDate: m(15),
      installDate: m(13),
      failureDate: m(3),
      customerName: 'Aqualine Systems',
      customerAccount: 'AQS-0067',
      siteLocation: 'Booster Station 4',
      contactName: 'Linda Fraser',
      contactEmail: 'l.fraser@aqualine.net',
      customerComplaint: 'Pressure reading drifting — reading 12 psi above actual system pressure.',
      initialObservations: 'Unit physically undamaged. Zero/span calibration out of spec.',
      findings: [
        makeFinding(case5Id, {
          category: 'sensor_drift',
          severity: 'medium',
          component: 'Piezoresistive Sensing Element',
          description: 'Long-term drift in piezoresistive bridge. Span coefficient shifted +8% from factory value.',
          measurements: 'Output at 0 psi: 4.62 mA (spec: 4.00 mA). Output at 600 psi: 20.0 mA (spec: 20.0 mA)',
          isRootCause: true,
        }),
      ],
      rootCause: 'Gradual zero drift in sensing element over 13 months. Within predicted lifecycle for this sensor type but accelerated by higher-than-rated fluid temperature exposure.',
      failureOrigin: 'wear_end_of_life',
      correctiveAction: 'Replace transducer. Customer advised to recalibrate annually.',
      preventiveAction: 'Add temperature rating warning to datasheet. Consider active temperature compensation in next hardware revision.',
      disposition: 'out_of_warranty',
      isLineProblem: false,
      tags: ['sensor_drift', 'calibration', 'pressure'],
      assignedEngineer: 'S. Chen',
    },

    {
      id: case6Id,
      rmaNumber: 'RMA-241210-1188',
      createdAt: m(3),
      updatedAt: m(3),
      status: 'closed',
      productType: 'ro_controller',
      productModel: 'AquaLogic Pro 5000',
      serialNumber: 'ALP5-2022-00120',
      firmwareVersion: '2.9.0',
      manufactureDate: m(30),
      installDate: m(27),
      failureDate: m(4),
      customerName: 'Clearwater Municipal Authority',
      customerAccount: 'CMA-0041',
      siteLocation: 'Treatment Plant A, Phoenix AZ',
      contactName: 'James Rowe',
      contactEmail: 'j.rowe@clearwater.gov',
      customerComplaint: 'Unit locked out after power surge during grid storm event.',
      initialObservations: 'Burn marks on MOV and input fuse blown.',
      findings: [
        makeFinding(case6Id, {
          category: 'pcb_electrical',
          severity: 'high',
          component: 'Surge Protection MOV',
          description: 'Metal oxide varistor sacrificially failed due to over-voltage transient >2000V. Secondary trace damage near input rectifier.',
          isRootCause: true,
        }),
      ],
      rootCause: 'Electrical surge exceeded varistor clamping voltage. Protection worked as designed but secondary damage occurred beyond clamp threshold.',
      failureOrigin: 'environmental',
      correctiveAction: 'Replace PCB assembly and fuse.',
      preventiveAction: 'Recommend customer install external surge protection at service panel.',
      disposition: 'warranty_repair',
      isLineProblem: false,
      tags: ['surge', 'pcb', 'power', 'environmental'],
      assignedEngineer: 'T. Morgan',
    },
  ];
}
