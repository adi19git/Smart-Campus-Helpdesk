/**
 * Ticket API service.
 *
 * All functions use the centralized axios instance from ./axios.js
 * which handles JWT auth and token refresh automatically.
 */

import api from './axios';

/**
 * Fetch tickets with optional filters.
 * @param {Object} params - Query params: { search, category, status, page }
 */
export const getTickets = async (params = {}) => {
  // Remove empty string values so they don't get sent as query params
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v != null)
  );
  const response = await api.get('/api/tickets/', { params: cleanParams });
  return response.data;
};

/**
 * Fetch a single ticket by ID.
 * @param {number} id - Ticket ID
 */
export const getTicket = async (id) => {
  const response = await api.get(`/api/tickets/${id}/`);
  return response.data;
};

/**
 * Create a new ticket.
 * @param {Object} data - { title, description, category, priority }
 */
export const createTicket = async (data) => {
  const response = await api.post('/api/tickets/', data);
  return response.data;
};

/**
 * Update a ticket's status (admin only).
 * @param {number} id - Ticket ID
 * @param {string} status - New status: 'open' | 'in-progress' | 'closed'
 */
export const updateTicketStatus = async (id, status) => {
  const response = await api.patch(`/api/tickets/${id}/`, { status });
  return response.data;
};

/**
 * Delete a ticket (admin only).
 * @param {number} id - Ticket ID
 */
export const deleteTicket = async (id) => {
  const response = await api.delete(`/api/tickets/${id}/`);
  return response.data;
};

/**
 * Rate a closed ticket (student only).
 * @param {number} id - Ticket ID
 * @param {number} rating - Rating value: 1-5
 */
export const rateTicket = async (id, rating) => {
  const response = await api.patch(`/api/tickets/${id}/`, { rating });
  return response.data;
};

/**
 * Register a new user account.
 * @param {Object} data - { username, email, password, password_confirm }
 */
export const registerUser = async (data) => {
  const response = await api.post('/api/register/', data);
  return response.data;
};
