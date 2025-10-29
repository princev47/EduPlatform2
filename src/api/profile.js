import api from './api'

export const updateProfile = (payload) => api.post('/api/v1/user/updateprofile', payload) // ✅ POST not PUT
export const getMyProfile = () => api.get('/api/v1/user/get')
export const deleteAccount = () => api.delete('/api/v1/user/deleteuser')
