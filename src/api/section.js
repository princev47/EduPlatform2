import api from './api'

export const createSection = (payload) => api.post('/api/v1/user/createsection', payload)
export const getAllSections = () => api.get('/api/v1/user/allsections')

// Backend doesn’t have update/delete → keep but point to same endpoint for now
export const updateSection = (payload) => api.put('/api/v1/user/section/update', payload)
export const deleteSection = (payload) => api.delete('/api/v1/user/section/delete', { data: payload })
