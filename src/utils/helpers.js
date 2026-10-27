/**
 * MotoFix – General utility helpers
 */

/**
 * Format a date to a human-readable string.
 * @param {string|Date} date
 * @param {object} opts - Intl.DateTimeFormat options
 */
export function formatDate(date, opts = { dateStyle: 'medium' }) {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-IN', opts).format(new Date(date));
}

/**
 * Format a time slot string to 12-hour format.
 * @param {string} time - "HH:MM" 24-hour
 */
export function formatTime(time) {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

/**
 * Format currency in INR.
 * @param {number} amount
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Truncate a string to maxLength, appending '...'
 */
export function truncate(str, maxLength = 80) {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + '...';
}

/**
 * Generate a simple local booking reference (pre-API).
 */
export function generateBookingRef() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'MF-';
  for (let i = 0; i < 6; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return ref;
}

/**
 * Get today's date in YYYY-MM-DD format (for date input min attribute).
 */
export function todayISODate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get the index of a repair status in the progress chain.
 * @param {string} status
 * @param {string[]} order
 */
export function getStatusIndex(status, order) {
  return order.indexOf(status);
}

/**
 * Debounce a function call.
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Get initials from a full name.
 */
export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
}

/**
 * Deep clone a plain JS object/array (JSON-safe).
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
