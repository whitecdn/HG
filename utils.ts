import { CalculatorState, UserToolState } from './types';

// Constants
export const HG_COST_PER_DOOR = 65;
const DB_STORAGE_KEY = 'hg_scenarios_db';

// Formatters
export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val);
};

export const formatPercent = (val: number) => {
  return `${val}%`;
};

// --- DATABASE SIMULATION ---

/**
 * Simulates saving to a remote database.
 * Generates a unique ID, stores the state, and returns the ID.
 */
export const saveScenarioToDb = (state: CalculatorState): string => {
  // Use company name as ID, or fallback to random ID if no company name
  const companySlug = state.companyName
    ? state.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : 'sc_' + Math.random().toString(36).substring(2, 9);

  try {
    const existingDb = JSON.parse(localStorage.getItem(DB_STORAGE_KEY) || '{}');
    existingDb[companySlug] = {
      ...state,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(existingDb));
    return companySlug;
  } catch (e) {
    console.error('Database Save Failed', e);
    return '';
  }
};

/**
 * Simulates fetching from a remote database by ID.
 */
export const loadScenarioFromDb = (id: string): Partial<CalculatorState> | null => {
  try {
    const existingDb = JSON.parse(localStorage.getItem(DB_STORAGE_KEY) || '{}');
    return existingDb[id] || null;
  } catch (e) {
    console.error('Database Load Failed', e);
    return null;
  }
};

/**
 * Admin: Fetch all scenarios
 */
export const getAllScenariosFromDb = (): Record<string, any> => {
  try {
    return JSON.parse(localStorage.getItem(DB_STORAGE_KEY) || '{}');
  } catch (e) {
    return {};
  }
};

/**
 * Admin: Delete a scenario
 */
export const deleteScenarioFromDb = (id: string) => {
  try {
    const existingDb = JSON.parse(localStorage.getItem(DB_STORAGE_KEY) || '{}');
    delete existingDb[id];
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(existingDb));
  } catch (e) {
    console.error('Database Delete Failed', e);
  }
};

// --- URL State Management ---

export const compressStateToUrl = (state: CalculatorState): string => {
  try {
    // If we are just updating the URL to reflect the current state (without saving to DB explicitly yet),
    // we might still use the data param, BUT if a scenario ID exists in the query params, we prefer that.
    // For this utility, we return the Base64 version for "Live State" unless managed by the App component.
    const json = JSON.stringify(state);
    const b64 = btoa(json);
    return `${window.location.origin}${window.location.pathname}?data=${b64}`;
  } catch (e) {
    console.error('Failed to compress state', e);
    return window.location.href;
  }
};

export const decompressStateFromUrl = (): Partial<CalculatorState> | null => {
  try {
    const params = new URLSearchParams(window.location.search);

    // 1. Priority: Check for unique Scenario ID (Database Look up)
    const scenarioId = params.get('id');
    if (scenarioId) {
      const dbState = loadScenarioFromDb(scenarioId);
      if (dbState) return dbState;
    }

    // 2. Fallback: Check for encoded Data string (Legacy/Quick share)
    const data = params.get('data');
    if (data) {
      const json = atob(data);
      return JSON.parse(json);
    }

    return null;
  } catch (e) {
    console.error('Failed to decompress state', e);
    return null;
  }
};

// --- Pure Calculation Functions ---

// 1. Management Revenue
export const calculateManagementRevenue = (listings: number, avgAnnualRev: number, commission: number) => {
  const annual = listings * avgAnnualRev * (commission / 100);
  return {
    monthly: annual / 12,
    annual
  };
};

// 2. HostGenius Costs
export const calculateHGCost = (listings: number) => {
  const monthly = listings * HG_COST_PER_DOOR;
  return {
    monthly,
    annual: monthly * 12
  };
};

// 3. Tool Savings
// Discounted rates for specific tools
const HG_TOOL_RATES: Record<string, number> = {
  breezeway: 3.49,
  enso: 5.00,
  conduitai: 6.00,
  suiteop: 6.00,
  guestyshield: 40.00, // Per reservation
  truvi: 30.00, // Per reservation
  suiteop_devices: 2.50, // Per device
  guestypay: 2.50, // Percentage
};

import { TOOLS_LIST } from './types'; // Import to check subType

export const calculateToolSavings = (listings: number, userTools: UserToolState[]) => {
  let monthlyTotal = 0;
  const itemized = userTools.map(t => {
    let monthly = 0;

    if (t.enabled) {
      // Find tool definition to check logic type
      const def = TOOLS_LIST.find(d => d.id === t.id);

      // Logic split:
      // Logic split:
      // 1. Quantity Based (Rates per reservation/device)
      // Logic split:
      // 1. Quantity Based (Rates per reservation/device)
      if (def?.subType === 'quantity_based') {
        const rate = HG_TOOL_RATES[t.id] || 0;
        const quantity = t.quantity || 0;
        // Ensure we don't return negative savings. If user pays less than our rate, savings is 0.
        const savingsPerUnit = Math.max(0, t.costPerDoor - rate);

        const savingsPerDoor = savingsPerUnit * quantity;
        monthly = listings * savingsPerDoor;
      }
      // 2. Percentage Volume Based (GuestyPay)
      else if (def?.subType === 'percentage_volume') {
        const rate = HG_TOOL_RATES[t.id] || 0;
        const volumePerDoor = t.quantity || 0; // "Processed $/Door/Mo"
        // Savings is (UserRate% - HG_Rate%) * Volume
        // t.costPerDoor here is the percentage (e.g. 3.0)
        const rateDiff = Math.max(0, t.costPerDoor - rate);

        const savingsPerDoor = (rateDiff / 100) * volumePerDoor;
        monthly = listings * savingsPerDoor;
      }
      // 2. Standard Tech Tools (Rates per door)
      else if (HG_TOOL_RATES[t.id] !== undefined) {
        // Ensure we don't return negative savings.
        const savingsPerDoor = Math.max(0, t.costPerDoor - HG_TOOL_RATES[t.id]);
        monthly = listings * savingsPerDoor;
      }
      // 3. PMS / Default (Full Cost Savings)
      else {
        monthly = listings * t.costPerDoor;
      }
    }

    if (t.enabled) monthlyTotal += monthly;

    return {
      id: t.id,
      monthly,
      annual: monthly * 12
    };
  });

  return {
    monthly: monthlyTotal,
    annual: monthlyTotal * 12,
    itemized
  };
};

// 4. Time/Operational Savings
export const calculateTimeSavings = (state: CalculatorState) => {
  // Sum hours from tasks array
  const totalWeeklyHours = state.opsTasks ? state.opsTasks.reduce((acc, t) => acc + t.hours, 0) : 0;

  const monthlyHours = totalWeeklyHours * 4.33; // Average weeks in a month

  return {
    weeklyHours: totalWeeklyHours,
    monthlyHours
  };
};

// 5. Net Impact (Efficiency: Tech Savings - HG Cost)
// REMOVED Time Savings Value from Net Impact Calculation
export const calculateNetImpact = (hgCostMonthly: number, techSavingsMonthly: number) => {
  // We consider Tech as "Hard Savings"
  // The Total Net Impact is the value gained (Hard Savings - Cost).
  const monthly = techSavingsMonthly - hgCostMonthly;
  return {
    monthly,
    annual: monthly * 12
  };
};

// 6. Growth Upside
export const calculateGrowthUpside = (newProps: number, avgAnnualRev: number, commission: number, effectiveCostPerDoor?: number) => {
  const annualRevenue = newProps * avgAnnualRev * (commission / 100);
  const monthlyRevenue = annualRevenue / 12;

  // Use effective cost if provided (can be negative implies net profit from tech savings), else default
  const costBasis = effectiveCostPerDoor !== undefined ? effectiveCostPerDoor : HG_COST_PER_DOOR;
  const monthlyCost = newProps * costBasis;
  const monthlyNetProfit = monthlyRevenue - monthlyCost;

  return {
    monthlyRevenue,
    annualRevenue,
    monthlyNetProfit,
    annualNetProfit: monthlyNetProfit * 12
  };
};