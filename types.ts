export interface Tool {
  id: string;
  name: string;
  description: string;
  isPMS: boolean; // Mutually exclusive logic trigger
  // For sub-options / add-ons
  linkedTo?: string; // ID of the parent tool (e.g., 'guesty')
  subType?: 'quantity_based' | 'percentage_volume'; // Triggers specific UI with two inputs
  unitLabel?: string; // e.g. "Reservation", "Device"
  quantityLabel?: string; // e.g. "Reservations/Mo", "Devices/Property"
  isPercentage?: boolean; // If true, the cost input is a percentage
}

export interface UserToolState {
  id: string;
  enabled: boolean; // "Use through HostGenius"
  costPerDoor: number; // Current cost entered by user (or Cost per Reservation/Device)
  quantity?: number; // Multiplier (Reservations/Mo or Devices/Property) - Default 0
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

export interface CustomTool {
  id: string;
  name: string;
  costPerDoor: number;
  replacedById: string; // ID of the tool in TOOLS_LIST
}

export interface CalculatorState {
  // Tab 1: Snapshot (Portfolio + Time)
  companyName: string;
  listings: number;
  avgAnnualRevenue: number;
  commissionPercent: number;

  // Time Inputs (Task based)
  // Powerups State
  sdrAppointments: number;
  sdrCloseRate: number;
  revMaxLift: number;

  // Ops Tasks
  opsTasks: UserTaskState[];

  // Tab 4: Tools
  tools: UserToolState[];
  customTools: CustomTool[];

  // Tab 3: Growth
  newProperties: number;

  // UI State
  currentTab: number;
}

export const TOOLS_LIST: Tool[] = [
  { id: 'hostaway', name: 'Hostaway (PMS)', description: 'Property Management System', isPMS: true },
  { id: 'truvi', name: 'Damage Waivers', description: 'Protection & Screening', isPMS: false, linkedTo: 'hostaway', subType: 'quantity_based', unitLabel: 'Reservation', quantityLabel: 'Reservations/Mo' },

  { id: 'guesty', name: 'Guesty (PMS)', description: 'Property Management System', isPMS: true },
  { id: 'guestyshield', name: 'GuestyShield', description: 'Protection & Insurance', isPMS: false, linkedTo: 'guesty', subType: 'quantity_based', unitLabel: 'Reservation', quantityLabel: 'Reservations/Mo' },
  { id: 'guestypay', name: 'GuestyPay', description: 'Payment Processing', isPMS: false, linkedTo: 'guesty', subType: 'percentage_volume', unitLabel: 'Transaction Volume', quantityLabel: 'Processed $/Door/Mo', isPercentage: true },

  { id: 'pricelabs', name: 'PriceLabs', description: 'Dynamic Pricing', isPMS: false },
  { id: 'breezeway', name: 'Breezeway', description: 'Cleaning Operations', isPMS: false },
  { id: 'enso', name: 'Enso', description: 'Guest Experience / Upsells', isPMS: false },

  { id: 'suiteop', name: 'SuiteOp', description: 'Operations & Guest Experience', isPMS: false },
  { id: 'suiteop_devices', name: 'SuiteOp Device Mgmt', description: 'Smart Locks & Thermostats', isPMS: false, linkedTo: 'suiteop', subType: 'quantity_based', unitLabel: 'Device', quantityLabel: 'Devices/Property' },

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
  // Time defaults
  opsTasks: OPS_TASK_LIST.map(t => ({ id: t.id, hours: 0 })), // Default 0 hours per task/week

  // Powerups Defaults
  sdrAppointments: 5,
  sdrCloseRate: 20,
  revMaxLift: 5,

  tools: TOOLS_LIST.map(t => ({ id: t.id, enabled: false, costPerDoor: 0, quantity: 0 })),
  customTools: [],
  newProperties: 0,
  currentTab: 0
};