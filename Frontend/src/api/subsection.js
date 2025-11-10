import api from './api'

// ✅ Create a new subsection (with file upload)
export const createSubSection = (formData) =>
  api.post('/api/v1/user/createsubsection', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

// ✅ Update subsection
export const updateSubSection = (payload) =>
  api.put('/api/v1/user/subsection/update', payload)

// ✅ Delete subsection (passing data in DELETE body)
export const deleteSubSection = (payload) =>
  api.delete('/api/v1/user/subsection/delete', { data: payload })
