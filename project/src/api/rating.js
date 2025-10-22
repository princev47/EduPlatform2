import api from './api'

// Backend doesn’t expose rating endpoints, but we keep them in case you add later
export const createRating = (payload) => api.post('/rating/create', payload)
export const getAllRatings = (payload) => api.post('/rating/getall', payload)
export const getAvgRating = (payload) => api.post('/rating/avg', payload)
