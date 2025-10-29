import api from './api'

export const sendOtp = (email) => api.post('/api/v1/user/sendotp', { email })
export const signup = (payload) => api.post('/api/v1/user/signup', payload)
export const login = (payload) => api.post('/api/v1/user/login', payload)
export const getProfile = () => api.get('/api/v1/user/get') 
