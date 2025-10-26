import api from './api'

export const sendOtp = (email) => api.post('/sendotp', { email })
export const signup = (payload) => api.post('/signup', payload)
export const login = (payload) => api.post('/login', payload)
export const getProfile = () => api.get('/get') 
