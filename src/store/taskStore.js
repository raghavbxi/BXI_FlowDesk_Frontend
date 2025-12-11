import { create } from 'zustand';
import { tasksAPI } from '../services/api';

const useTaskStore = create((set, get) => ({
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
  filters: {
    status: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
    get().fetchTasks();
  },

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const response = await tasksAPI.getTasks(filters);
      set({ tasks: response.data.data, loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch tasks';
      set({ loading: false, error: message });
      return { success: false, error: message };
    }
  },

  fetchTask: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await tasksAPI.getTask(id);
      set({ currentTask: response.data.data, loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch task';
      set({ loading: false, error: message });
      return { success: false, error: message };
    }
  },

  createTask: async (taskData) => {
    set({ loading: true, error: null });
    try {
      const response = await tasksAPI.createTask(taskData);
      set((state) => ({
        tasks: [response.data.data, ...state.tasks],
        loading: false,
      }));
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      set({ loading: false, error: message });
      return { success: false, error: message };
    }
  },

  updateTask: async (id, taskData) => {
    set({ loading: true, error: null });
    try {
      const response = await tasksAPI.updateTask(id, taskData);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id ? response.data.data : task
        ),
        currentTask: response.data.data,
        loading: false,
      }));
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      set({ loading: false, error: message });
      return { success: false, error: message };
    }
  },

  deleteTask: async (id) => {
    set({ loading: true, error: null });
    try {
      await tasksAPI.deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== id),
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      set({ loading: false, error: message });
      return { success: false, error: message };
    }
  },

  stopWork: async (id, reason) => {
    set({ loading: true, error: null });
    try {
      const response = await tasksAPI.stopWork(id, reason);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id ? response.data.data : task
        ),
        currentTask: response.data.data,
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to stop work';
      set({ loading: false, error: message });
      return { success: false, error: message };
    }
  },

  resumeWork: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await tasksAPI.resumeWork(id);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id ? response.data.data : task
        ),
        currentTask: response.data.data,
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resume work';
      set({ loading: false, error: message });
      return { success: false, error: message };
    }
  },

  updateProgress: async (id, manualProgress, comment) => {
    set({ loading: true, error: null });
    try {
      const response = await tasksAPI.updateProgress(id, manualProgress, comment);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id ? response.data.data : task
        ),
        currentTask: response.data.data,
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update progress';
      set({ loading: false, error: message });
      return { success: false, error: message };
    }
  },

  requestHelp: async (id) => {
    set({ loading: true, error: null });
    try {
      await tasksAPI.requestHelp(id);
      set({ loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send help request';
      set({ loading: false, error: message });
      return { success: false, error: message };
    }
  },
}));

export default useTaskStore;

