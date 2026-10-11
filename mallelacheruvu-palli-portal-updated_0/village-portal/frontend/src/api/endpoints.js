import client from './client';

// ---- Public reads ----
export const getVillageInfo = () => client.get('/village/info').then(r => r.data);
export const getFacilities = (category) => client.get('/village/facilities', { params: { category } }).then(r => r.data);
export const getContacts = () => client.get('/village/contacts').then(r => r.data);

export const getCrops = () => client.get('/agriculture/crops').then(r => r.data);
export const getFarmerResources = () => client.get('/agriculture/resources').then(r => r.data);

export const getEvents = (params) => client.get('/events', { params }).then(r => r.data);
export const getLatestEvents = (limit = 3) => client.get('/events/latest', { params: { limit } }).then(r => r.data);

export const getAnnouncements = (category) => client.get('/announcements', { params: { category } }).then(r => r.data);
export const getLatestAnnouncements = (limit = 3) => client.get('/announcements/latest', { params: { limit } }).then(r => r.data);

export const getServices = (params) => client.get('/services', { params }).then(r => r.data);

export const getGallery = (category) => client.get('/gallery', { params: { category } }).then(r => r.data);

export const getMemories = () => client.get('/memories').then(r => r.data);
export const submitMemory = (payload) => client.post('/memories', payload).then(r => r.data);

export const submitFeedback = (payload) => client.post('/feedback', payload).then(r => r.data);

export const getYouthActivities = () => client.get('/youth/activities').then(r => r.data);

export const getPeople = () => client.get('/people').then(r => r.data);

export const globalSearch = (q) => client.get('/search', { params: { q } }).then(r => r.data);

// ---- Admin auth ----
export const adminLogin = (email, password) => client.post('/auth/login', { email, password }).then(r => r.data);
export const getMe = () => client.get('/auth/me').then(r => r.data);
export const changePassword = (payload) => client.post('/auth/change-password', payload).then(r => r.data);

// ---- Admin dashboard ----
export const getDashboardStats = () => client.get('/admin/dashboard').then(r => r.data);

// ---- Village info / facilities / contacts (admin writes) ----
export const updateVillageInfo = (payload) => client.put('/village/info', payload).then(r => r.data);
export const createFacility = (payload) => client.post('/village/facilities', payload).then(r => r.data);
export const deleteFacility = (id) => client.delete(`/village/facilities/${id}`).then(r => r.data);
export const createContact = (payload) => client.post('/village/contacts', payload).then(r => r.data);
export const deleteContact = (id) => client.delete(`/village/contacts/${id}`).then(r => r.data);

// ---- People (admin writes) ----
export const createPerson = (payload) => client.post('/people', payload).then(r => r.data);
export const deletePerson = (id) => client.delete(`/people/${id}`).then(r => r.data);

// ---- Gallery (admin writes) ----
export const createGalleryItem = (payload) => client.post('/gallery', payload).then(r => r.data);
export const deleteGalleryItem = (id) => client.delete(`/gallery/${id}`).then(r => r.data);
export const uploadImage = (file) => {
  const form = new FormData();
  form.append('image', file);
  return client.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
};

// ---- Events (admin writes) ----
export const createEvent = (payload) => client.post('/events', payload).then(r => r.data);
export const deleteEvent = (id) => client.delete(`/events/${id}`).then(r => r.data);

// ---- Announcements (admin writes) ----
export const getAllAnnouncementsAdmin = () => client.get('/announcements/admin/all').then(r => r.data);
export const createAnnouncement = (payload) => client.post('/announcements', payload).then(r => r.data);
export const deleteAnnouncement = (id) => client.delete(`/announcements/${id}`).then(r => r.data);

// ---- Services (admin writes) ----
export const createService = (payload) => client.post('/services', payload).then(r => r.data);
export const deleteService = (id) => client.delete(`/services/${id}`).then(r => r.data);

// ---- Agriculture (admin writes) ----
export const createCrop = (payload) => client.post('/agriculture/crops', payload).then(r => r.data);
export const deleteCrop = (id) => client.delete(`/agriculture/crops/${id}`).then(r => r.data);
export const createFarmerResource = (payload) => client.post('/agriculture/resources', payload).then(r => r.data);
export const deleteFarmerResource = (id) => client.delete(`/agriculture/resources/${id}`).then(r => r.data);

// ---- Youth (admin writes) ----
export const createYouthActivity = (payload) => client.post('/youth/activities', payload).then(r => r.data);
export const deleteYouthActivity = (id) => client.delete(`/youth/activities/${id}`).then(r => r.data);

// ---- Feedback (admin) ----
export const getAllFeedback = () => client.get('/feedback/admin/all').then(r => r.data);
export const reviewFeedback = (id) => client.put(`/feedback/admin/${id}/review`).then(r => r.data);
export const deleteFeedback = (id) => client.delete(`/feedback/admin/${id}`).then(r => r.data);

// ---- Memories (admin) ----
export const getPendingMemories = () => client.get('/memories/admin/pending').then(r => r.data);
export const moderateMemory = (id, status) => client.put(`/memories/admin/${id}/moderate`, { status }).then(r => r.data);
