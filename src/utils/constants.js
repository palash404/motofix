/**
 * MotoFix – Application Constants
 */

export const APP_NAME = 'MotoFix';
export const APP_TAGLINE = 'Your Two-Wheeler, Our Priority.';

// ── API ──────────────────────────────────────────────────────
const rawApiUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').trim().replace(/\/+$/, '');
export const API_BASE_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;

// ── Booking Types ─────────────────────────────────────────────
export const BOOKING_TYPES = {
  HOME_REPAIR:      'HOME_REPAIR',
  SERVICE_CENTER:   'SERVICE_CENTER',
  BREAKDOWN:        'BREAKDOWN',
};

export const BOOKING_TYPE_LABELS = {
  [BOOKING_TYPES.HOME_REPAIR]:    'Home Repair',
  [BOOKING_TYPES.SERVICE_CENTER]: 'Service Center',
  [BOOKING_TYPES.BREAKDOWN]:      'Breakdown Assistance',
};

// ── Repair Status ─────────────────────────────────────────────
export const REPAIR_STATUS = {
  BOOKING_CONFIRMED:  'BOOKING_CONFIRMED',
  MECHANIC_ASSIGNED:  'MECHANIC_ASSIGNED',
  MECHANIC_ON_WAY:    'MECHANIC_ON_WAY',
  INSPECTION:         'INSPECTION',
  REPAIR_IN_PROGRESS: 'REPAIR_IN_PROGRESS',
  SERVICE_CENTER:     'SERVICE_CENTER',
  COMPLETED:          'COMPLETED',
};

export const REPAIR_STATUS_LABELS = {
  [REPAIR_STATUS.BOOKING_CONFIRMED]:  'Booking Confirmed',
  [REPAIR_STATUS.MECHANIC_ASSIGNED]:  'Mechanic Assigned',
  [REPAIR_STATUS.MECHANIC_ON_WAY]:    'Mechanic On The Way',
  [REPAIR_STATUS.INSPECTION]:         'Inspection',
  [REPAIR_STATUS.REPAIR_IN_PROGRESS]: 'Repair In Progress',
  [REPAIR_STATUS.SERVICE_CENTER]:     'Service Center',
  [REPAIR_STATUS.COMPLETED]:          'Completed',
};

export const REPAIR_STATUS_ORDER = [
  REPAIR_STATUS.BOOKING_CONFIRMED,
  REPAIR_STATUS.MECHANIC_ASSIGNED,
  REPAIR_STATUS.MECHANIC_ON_WAY,
  REPAIR_STATUS.INSPECTION,
  REPAIR_STATUS.REPAIR_IN_PROGRESS,
  REPAIR_STATUS.SERVICE_CENTER,
  REPAIR_STATUS.COMPLETED,
];

// ── Common Bike Problems ──────────────────────────────────────
export const BIKE_PROBLEMS = [
  { id: 'puncture',      label: 'Puncture / Flat Tyre' },
  { id: 'engine',        label: 'Engine Not Starting' },
  { id: 'battery',       label: 'Battery Dead' },
  { id: 'brakes',        label: 'Brake Issues' },
  { id: 'oil_change',    label: 'Oil Change' },
  { id: 'chain',         label: 'Chain Issue' },
  { id: 'electrical',    label: 'Electrical / Wiring' },
  { id: 'lights',        label: 'Lights Not Working' },
  { id: 'clutch',        label: 'Clutch Problem' },
  { id: 'suspension',    label: 'Suspension Issue' },
  { id: 'general',       label: 'General Service' },
  { id: 'other',         label: 'Other / Not Sure' },
];

// ── Service Types (for service center booking) ─────────────────
export const SERVICE_TYPES = [
  { id: 'basic',     label: 'Basic Service', description: 'Oil change, filter, basic check' },
  { id: 'standard',  label: 'Standard Service', description: 'Basic + brakes, tyres, electrics' },
  { id: 'full',      label: 'Full Service', description: 'Comprehensive top-to-bottom service' },
  { id: 'repair',    label: 'Specific Repair', description: 'Fix a known issue' },
];

// ── Demo Admin ────────────────────────────────────────────────
export const DEMO_ADMIN_PIN = '0000'; // Shown only in demo panel
