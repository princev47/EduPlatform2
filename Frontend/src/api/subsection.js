import api from './api'

export const createSubSection = (formData) => api.post('/createsubsection', formData, { 
  headers: { 'Content-Type': 'multipart/form-data' } 
})

// Backend doesn’t have update/delete → keep but stub them
export const updateSubSection = (payload) => api.put('/api/v1/user/subsection/update', payload)
export const deleteSubSection = (payload) => api.delete('/api/v1/user/subsection/delete', { data: payload })
