import axios from "axios";

const API_URL = "https://bxi-flowdesk-backend.onrender.com/api";
// const API_URL = "http://localhost:3000/api"; // For local development

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  sendOTP: (email) => api.post("/auth/send-otp", { email }),
  getMe: () => api.get("/auth/me"),
  // OAuth endpoints
  getOAuthUrl: (provider) => api.get(`/auth/oauth/${provider}`),
  oauthCallback: (provider, code, state) => api.get(`/auth/oauth/${provider}/callback`, { params: { code, state } }),
  oauthLogin: (provider, token) => api.post(`/auth/oauth/${provider}/login`, { token }),
};

// Tasks API
export const tasksAPI = {
  getTasks: (params) => api.get("/tasks", { params }),
  getTask: (id) => api.get(`/tasks/${id}`),
  createTask: (data) => api.post("/tasks", data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  assignUsers: (id, userIds) => api.post(`/tasks/${id}/assign`, { userIds }),
  stopWork: (id, reason) => api.post(`/tasks/${id}/stop`, { reason }),
  resumeWork: (id) => api.post(`/tasks/${id}/resume`),
  updateProgress: (id, manualProgress, comment) =>
    api.put(`/tasks/${id}/progress`, { manualProgress, comment }),
  requestHelp: (id) => api.post(`/tasks/${id}/help`),
};

// Comments API
export const commentsAPI = {
  getComments: (taskId) => api.get(`/comments/tasks/${taskId}/comments`),
  addComment: (taskId, data) =>
    api.post(`/comments/tasks/${taskId}/comments`, data),
  updateComment: (taskId, commentId, data) =>
    api.put(`/comments/tasks/${taskId}/comments/${commentId}`, data),
  deleteComment: (taskId, commentId) =>
    api.delete(`/comments/tasks/${taskId}/comments/${commentId}`),
};

// Users API
export const usersAPI = {
  getUsers: () => api.get("/users"),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
};

// Activities API
export const activitiesAPI = {
  getTaskActivities: (taskId) => api.get(`/activities/tasks/${taskId}`),
};

// Steps API
export const stepsAPI = {
  getTaskSteps: (taskId) => api.get(`/steps/tasks/${taskId}`),
  createStep: (taskId, data) => api.post(`/steps/tasks/${taskId}`, data),
  updateStep: (id, data) => api.put(`/steps/${id}`, data),
  activateStep: (id) => api.put(`/steps/${id}/activate`),
  completeStep: (id) => api.put(`/steps/${id}/complete`),
  deleteStep: (id) => api.delete(`/steps/${id}`),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: (params) => api.get("/notifications", { params }),
  getUnreadCount: () => api.get("/notifications/unread-count"),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put("/notifications/read-all"),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

// Updates API
export const updatesAPI = {
  getTaskUpdates: (taskId) => api.get(`/updates/tasks/${taskId}`),
  createTaskUpdate: (taskId, data) =>
    api.post(`/updates/tasks/${taskId}`, data),
  deleteTaskUpdate: (updateId) => api.delete(`/updates/${updateId}`),
};

export default api;
