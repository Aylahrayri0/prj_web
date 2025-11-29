/**
 * API Service for Gaza Support Backend
 * Handles all HTTP requests to the Laravel API
 */

const API_BASE_URL = 'http://localhost/gaza-support-backend/simple-api.php';

/**
 * Generic fetch wrapper with error handling
 */
const fetchAPI = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
    });

    if (!response.ok && response.status !== 204) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    if (response.status === 204) {
      return { success: true };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
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
  create: (data) => fetchAPI('/donations', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => fetchAPI(`/donations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchAPI(`/donations/${id}`, {
    method: 'DELETE',
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
  getAll: () => fetchAPI(''),
  getById: (id) => fetchAPI(`/${id}`),
  create: (data) => fetchAPI('', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => fetchAPI(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => fetchAPI(`/${id}`, {
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
  impactAPI,
};
