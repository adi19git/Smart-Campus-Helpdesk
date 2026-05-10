import api from './axios';

export const getTickets = async (params = {}) => {
  const response = await api.get('/tickets/', { params });
  return response.data;
};

export const getTicket = async (id) => {
  const response = await api.get(`/tickets/${id}/`);
  return response.data;
};

export const createTicket = async (data) => {
  const response = await api.post('/tickets/', data);
  return response.data;
};

export const updateTicketStatus = async (id, status) => {
  const response = await api.patch(`/tickets/${id}/`, { status });
  return response.data;
};

export const deleteTicket = async (id) => {
  const response = await api.delete(`/tickets/${id}/`);
  return response.data;
};

export const rateTicket = async (id, rating) => {
  const response = await api.patch(`/tickets/${id}/`, { rating });
  return response.data;
};
