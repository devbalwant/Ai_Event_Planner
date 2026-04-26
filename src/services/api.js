import axios from "axios";

const BASE_URL = "https://event-backend-6kzk.onrender.com/api";

const api = axios.create({ baseURL: BASE_URL });

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token =
    sessionStorage.getItem("token") || localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Auth ────────────────────────────────────────────────
export const loginAPI = (data) => api.post("/auth/login", data);
export const registerAPI = (data) => api.post("/auth/register", data);
export const getMeAPI = () => api.get("/auth/me");

// ─── Events ──────────────────────────────────────────────
export const getMyEventsAPI = () => api.get("/events");
export const getPublicEventsAPI = () => api.get("/events/public");
export const getEventByIdAPI = (id) => api.get(`/events/${id}`);
export const createEventAPI = (data) => api.post("/events", data);
export const updateEventAPI = (id, data) => api.put(`/events/${id}`, data);
export const deleteEventAPI = (id) => api.delete(`/events/${id}`);

// ─── Bookings ─────────────────────────────────────────────
export const bookEventAPI = (data) => api.post("/bookings", data);
export const getMyBookingsAPI = () => api.get("/bookings/my");
export const getEventBookingsAPI = (eventId) =>
  api.get(`/bookings/event/${eventId}`);
export const cancelBookingAPI = (id) => api.delete(`/bookings/${id}`);

// ─── Admin ────────────────────────────────────────────────
export const getAdminStatsAPI = () => api.get("/admin/stats");
export const getOrganizersAPI = () => api.get("/admin/organizers");
export const verifyOrganizerAPI = (id) =>
  api.put(`/admin/organizers/${id}/verify`);
export const rejectOrganizerAPI = (id) =>
  api.put(`/admin/organizers/${id}/reject`);
export const adminDeleteEventAPI = (id) => api.delete(`/admin/events/${id}`);
export const getAllEventsAdminAPI = () => api.get("/admin/events");
// Event approve / reject
export const getPendingEventsAPI = () => api.get("/admin/events/pending");
export const approveEventAPI = (id) => api.put(`/admin/events/${id}/approve`);
export const rejectEventAPI = (id) => api.put(`/admin/events/${id}/reject`);

// ─── AI Planner ───────────────────────────────────────────
export const generatePlanAPI = (data) => api.post("/plan", data);
