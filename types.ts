export interface Tool {
  id: string;
  name: string;
  description: string;
  isPMS: boolean; // Mutually exclusive logic trigger
}

export interface UserToolState {
  id: string;
  enabled: boolean; // "Use through HostGenius"
  costPerDoor: number; // Current cost entered by user
}

export interface OperationalTask {
  id: string;
  name: string;
  category: string;
}

export interface UserTaskState {
  id: string;
  hours: number;
}

export interface CalculatorState {
  // Tab 1: Snapshot (Portfolio + Time)
  companyName: string;
  listings: number;
  avgAnnualRevenue: number;
  commissionPercent: number;

  // Time Inputs (Task based)
  opsTasks: UserTaskState[];

  // Tab 4: Tools
  tools: UserToolState[];

  // Tab 3: Growth
  newProperties: number;

  // UI State
  currentTab: number;
}

export const TOOLS_LIST: Tool[] = [
  { id: 'hostaway', name: 'Hostaway (PMS)', description: 'Property Management System', isPMS: true },
  { id: 'guesty', name: 'Guesty (PMS)', description: 'Property Management System', isPMS: true },
  { id: 'pricelabs', name: 'PriceLabs', description: 'Dynamic Pricing', isPMS: false },
  { id: 'breezeway', name: 'Breezeway', description: 'Operations & Safety', isPMS: false },
  { id: 'enso', name: 'Enso', description: 'Guest Experience / Upsells', isPMS: false },
  { id: 'suiteop', name: 'SuiteOp', description: 'Smart Device Management', isPMS: false },
  { id: 'conduitai', name: 'ConduitAI', description: 'AI Communication', isPMS: false },
];

export const OPS_TASK_LIST: OperationalTask[] = [
  { id: 'guest_support', name: 'Guest Messaging & Support', category: 'Guest Services' },
  { id: 'cleaner_scheduling', name: 'Cleaner & Maintenance Scheduling', category: 'Operations' },
  { id: 'pricing', name: 'Revenue Management & Pricing', category: 'Finance' },
  { id: 'tech_setup', name: 'Tech Setup & Troubleshooting', category: 'IT' },
  { id: 'admin', name: 'Owner Statements & Admin', category: 'Admin' },
];

export const INITIAL_STATE: CalculatorState = {
  companyName: '',
  listings: 30,
  avgAnnualRevenue: 60000,
  commissionPercent: 20,

  // Time defaults
  opsTasks: OPS_TASK_LIST.map(t => ({ id: t.id, hours: 0 })), // Default 0 hours per task/week

  tools: TOOLS_LIST.map(t => ({ id: t.id, enabled: false, costPerDoor: 0 })),
  newProperties: 0,
  currentTab: 0
};