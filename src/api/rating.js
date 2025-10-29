import api from './api'

// Backend doesn’t expose rating endpoints, but we keep them in case you add later
export const createRating = (payload) => api.post('/api/v1/user/rating/create', payload)
export const getAllRatings = (payload) => api.post('/api/v1/user/rating/getall', payload)
export const getAvgRating = (payload) => api.post('/api/v1/user/rating/avg', payload)
