import api from './api'

export const createSection = (payload) => api.post('/createsection', payload)
export const getAllSections = () => api.get('/allsections')

// Backend doesn’t have update/delete → keep but point to same endpoint for now
export const updateSection = (payload) => api.put('/section/update', payload)
export const deleteSection = (payload) => api.delete('/section/delete', { data: payload })
