import api from './api'

export const requestReset = (payload) => api.post('/reset-password-token', payload)
export const resetPassword = (payload) => api.post('/reset-password', payload)
