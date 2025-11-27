/**
 * API Service for Gaza Support Backend
 * Handles all HTTP requests to the Laravel API
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

/**
 * Generic fetch wrapper with error handling
 */
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
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

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
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
  impactAPI,
};
