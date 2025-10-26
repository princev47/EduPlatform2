import api from './api'

export const updateProfile = (payload) => api.post('/updateprofile', payload) // ✅ POST not PUT
export const getMyProfile = () => api.get('/get')
export const deleteAccount = () => api.delete('/deleteuser')
