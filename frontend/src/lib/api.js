import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear authentication data on auth errors
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Rides API
export const ridesAPI = {
  offer: (rideData) => api.post('/rides/offer', rideData),
  search: (params) => api.get('/rides/search', { params }),
  getMyRides: () => api.get('/rides/my-rides'),
  getRideDetails: (rideId) => api.get(`/rides/${rideId}`),
  updateRide: (rideId, rideData) => api.put(`/rides/${rideId}`, rideData),
  cancelRide: (rideId) => api.delete(`/rides/${rideId}`),
  getRidePassengers: (rideId) => api.get(`/rides/${rideId}/passengers`),
};

// Bookings API
export const bookingsAPI = {
  join: (rideId) => api.post(`/bookings/join/${rideId}`),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  cancelBooking: (bookingId) => api.delete(`/bookings/${bookingId}`),
  approveBooking: (bookingId) => api.put(`/bookings/${bookingId}/approve`),
  rejectBooking: (bookingId) => api.put(`/bookings/${bookingId}/reject`),
};

export default api;

