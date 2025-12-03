/**
 * API Service for Gaza Support Backend
 * Handles all HTTP requests to the Laravel API
 */

const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Generic fetch wrapper with error handling
 */
const fetchAPI = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const { headers: customHeaders = {}, token, ...otherOptions } = options;

  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...otherOptions,
    headers,
  });

  if (response.status === 204) {
    return { success: true };
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || data?.error || `API Error: ${response.status} ${response.statusText}`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
};

/**
 * Donation Categories API
 */
export const donationCategoryAPI = {
  getAll: () => fetchAPI('/donation-categories'),
  getById: (id) => fetchAPI(`/donation-categories/${id}`),
  create: (data) => fetchAPI('/donation-categories', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => fetchAPI(`/donation-categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchAPI(`/donation-categories/${id}`, {
    method: 'DELETE',
  }),
};

/**
 * Donations API
 */
export const donationAPI = {
  getAll: () => fetchAPI('/donations'),
  getById: (id) => fetchAPI(`/donations/${id}`),
  create: (data, options = {}) => fetchAPI('/donations', {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  }),
  update: (id, data, options = {}) => fetchAPI(`/donations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  }),
  delete: (id, options = {}) => fetchAPI(`/donations/${id}`, {
    method: 'DELETE',
    ...options,
  }),
};

/**
 * Articles API
 */
export const articleAPI = {
  getAll: () => fetchAPI('/articles'),
  getById: (id) => fetchAPI(`/articles/${id}`),
  create: (data) => fetchAPI('/articles', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => fetchAPI(`/articles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchAPI(`/articles/${id}`, {
    method: 'DELETE',
  }),
};

/**
 * Testimonials API
 */
export const testimonialAPI = {
  getAll: () => fetchAPI('/testimonials'),
  getById: (id) => fetchAPI(`/testimonials/${id}`),
  create: (data) => fetchAPI('/testimonials', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => fetchAPI(`/testimonials/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchAPI(`/testimonials/${id}`, {
    method: 'DELETE',
  }),
};

/**
 * Admin Testimonials API (requires authentication)
 */
export const adminTestimonialAPI = {
  getAll: (params = {}) => {
    return fetchAPI('/admin/testimonials');
  },
  getPending: () => fetchAPI('/admin/testimonials/pending/all'),
  getStatistics: () => fetchAPI('/admin/testimonials/stats/summary'),
  approve: (id) => fetchAPI(`/admin/testimonials/${id}/approve`, {
    method: 'PUT',
  }),
  reject: (id) => fetchAPI(`/admin/testimonials/${id}/reject`, {
    method: 'PUT',
  }),
  delete: (id) => fetchAPI(`/admin/testimonials/${id}`, {
    method: 'DELETE',
  }),
};

export const authAPI = {
  register: (data) => fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  login: (data) => fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

/**
 * Impact Statistics API
 */
export const impactAPI = {
  getAll: () => fetchAPI('/impact-statistics'),
  getById: (id) => fetchAPI(`/impact-statistics/${id}`),
  create: (data) => fetchAPI('/impact-statistics', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => fetchAPI(`/impact-statistics/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchAPI(`/impact-statistics/${id}`, {
    method: 'DELETE',
  }),
};

export default {
  donationCategoryAPI,
  donationAPI,
  articleAPI,
  testimonialAPI,
  adminTestimonialAPI,
  authAPI,
  impactAPI,
};
