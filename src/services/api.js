/**
 * MotoFix – API Service Layer
 * All REST calls to the Spring Boot backend go through here.
 * Uses API_BASE_URL (configured via VITE_API_BASE_URL or defaults to http://localhost:8080/api).
 * Session authentication cookies (MOTOFIX_SESSION) are included via credentials: 'include'.
 */

import { API_BASE_URL } from '../utils/constants';

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

// ── Internal fetch wrapper ────────────────────────────────────
async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const method = (options.method || 'GET').toUpperCase();
  const csrfToken = getCookie('XSRF-TOKEN');
  if (csrfToken && !['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method)) {
    headers['X-XSRF-TOKEN'] = csrfToken;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorObj = {
      status: response.status,
      message: data.message || (response.status === 401 ? 'Invalid credentials or session expired.' : 'Something went wrong.'),
      errors: data.errors || null,
    };
    throw errorObj;
  }

  return data;
}

// ── Auth API ──────────────────────────────────────────────────
export const authApi = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: ({ name, email, password }) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  getProfile: () =>
    request('/auth/me', { method: 'GET' }),

  logout: () =>
    request('/auth/logout', { method: 'POST' }),
};

// ── Booking API ───────────────────────────────────────────────
export const bookingApi = {
  create: (bookingData) =>
    request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),

  getAll: () =>
    request('/bookings', { method: 'GET' }),

  getById: (id) => {
    if (id === undefined || id === null || isNaN(Number(id))) {
      throw { status: 400, message: 'Invalid numeric booking ID.' };
    }
    return request(`/bookings/${id}`, { method: 'GET' });
  },

  getByRef: (ref) => {
    const clean = (ref || '').replace(/^#+/, '');
    return request(`/bookings/ref/${encodeURIComponent(clean)}`, { method: 'GET' });
  },

  getLatest: () =>
    request('/bookings/latest', { method: 'GET' }),
};

// ── Service Centers API ───────────────────────────────────────
export const serviceCenterApi = {
  getAll: () =>
    request('/service-centers'),

  getById: (id) =>
    request(`/service-centers/${id}`),
};
