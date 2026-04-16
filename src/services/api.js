/**
 * API SERVICE LAYER
 * ─────────────────
 * All functions return { data, error }.
 * Replace BASE_URL with your backend base URL.
 * Each function maps 1-to-1 with a backend endpoint.
 * Uncomment the axios calls and remove the placeholder returns when ready.
 */

import axios from 'axios'

export const BASE_URL = 'https://deployement-nylv.onrender.com/api' // ← change to your backend URL

const api = axios.create({ baseURL: BASE_URL })

// Attach auth token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const call = async (fn) => {
  try {
    const res = await fn()
    return { data: res.data, error: null }
  } catch (err) {
    return { data: null, error: err?.response?.data?.message || 'Something went wrong' }
  }
}

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:    (body) => call(() => api.post('/auth/login', body)),
  register: (body) => call(() => api.post('/auth/register', body)),
  logout:   ()     => call(() => api.post('/auth/logout')),
  me:       ()     => call(() => api.get('/auth/me')),
}

// ─── WALLET ──────────────────────────────────────────────────────────────────
export const walletAPI = {
  getOverview:       ()     => call(() => api.get('/wallet/overview')),
  getTransactions:   (p)    => call(() => api.get('/wallet/transactions', { params: p })),
  sendUPI:           (body) => call(() => api.post('/wallet/upi/send', body)),
  requestMoney:      (body) => call(() => api.post('/wallet/request', body)),
  addMoney:          (body) => call(() => api.post('/wallet/add', body)),
  getContacts:       ()     => call(() => api.get('/wallet/contacts')),
  getQRCode:         ()     => call(() => api.get('/wallet/qr')),
  splitCreate:       (body) => call(() => api.post('/wallet/split', body)),
  splitSettle:       (id)   => call(() => api.post(`/wallet/split/${id}/settle`)),
  getGroups:         ()     => call(() => api.get('/wallet/groups')),
  createGroup:       (body) => call(() => api.post('/wallet/groups', body)),
  settleGroup:       (id)   => call(() => api.post(`/wallet/groups/${id}/settle`)),
  getBusPass:        ()     => call(() => api.get('/wallet/transport/pass')),
  getRoutes:         ()     => call(() => api.get('/wallet/transport/routes')),
  payTransport:      (body) => call(() => api.post('/wallet/transport/pay', body)),
  getTripHistory:    ()     => call(() => api.get('/wallet/transport/trips')),
  getExpenses:       (p)    => call(() => api.get('/wallet/expenses', { params: p })),
  getAISuggestions:  ()     => call(() => api.get('/wallet/expenses/suggestions')),
  getPendingRequests:()     => call(() => api.get('/wallet/requests/pending')),
  respondToRequest:  (id,a) => call(() => api.post(`/wallet/requests/${id}/respond`, { action: a })),
  getParentInsights: ()     => call(() => api.get('/wallet/parent-insights')),
}

// ─── ACADEMICS ───────────────────────────────────────────────────────────────
export const academicsAPI = {
  getDashboard:       () => call(() => api.get('/academics/dashboard')),
  getAnnouncements:   () => call(() => api.get('/academics/announcements')),
  getAttendance:      () => call(() => api.get('/academics/attendance')),
  getTimetable:       () => call(() => api.get('/academics/timetable')),
  getNotes:           () => call(() => api.get('/academics/notes')),
  downloadNote:     (id) => call(() => api.get(`/academics/notes/${id}/download`)),
  uploadNote:      (fd)  => call(() => api.post('/academics/notes/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })),
  getResults:         () => call(() => api.get('/academics/results')),
}

// ─── PROFILE ─────────────────────────────────────────────────────────────────
export const profileAPI = {
  getProfile:      ()     => call(() => api.get('/profile')),
  updateProfile:   (body) => call(() => api.put('/profile', body)),
  updateSettings:  (body) => call(() => api.put('/profile/settings', body)),
  changePassword:  (body) => call(() => api.put('/profile/password', body)),
}
