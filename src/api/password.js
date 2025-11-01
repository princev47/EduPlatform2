import api from './api'

export const requestReset = (payload) => api.post('/api/v1/user/reset-password-token', payload)
export const resetPassword = (payload) => api.post('/api/v1/user/reset-password', payload)
