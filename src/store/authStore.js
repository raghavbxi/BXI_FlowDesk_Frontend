import { create } from 'zustand';
import { authAPI } from '../services/api';

// Initialize from localStorage if available
const getInitialState = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    console.error('Error parsing user from localStorage:', e);
  }
  return {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading: false,
    error: null,
  };
};

const useAuthStore = create(
  (set) => ({
      ...getInitialState(),

      login: async (email, otp) => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.login({ email, otp });
          const { token, user } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Login failed';
          set({ loading: false, error: message, isAuthenticated: false });
          return { success: false, error: message };
        }
      },

      sendOTP: async (email) => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.sendOTP(email);
          set({ loading: false, error: null });
          return { success: true, message: response.data.message };
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to send OTP';
          set({ loading: false, error: message });
          return { success: false, error: message };
        }
      },

      register: async (name, email) => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.register({ name, email });
          const { token, user } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Registration failed';
          set({ loading: false, error: message, isAuthenticated: false });
          return { success: false, error: message };
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      getMe: async () => {
        try {
          const response = await authAPI.getMe();
          const user = response.data.user;
          localStorage.setItem('user', JSON.stringify(user));
          set({ user, isAuthenticated: true });
          return { success: true };
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          set({ user: null, isAuthenticated: false });
          return { success: false };
        }
      },

      updateUser: (userData) => {
        set({ user: { ...useAuthStore.getState().user, ...userData } });
      },

      // OAuth methods
      initiateOAuth: async (provider) => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.getOAuthUrl(provider);
          const { url } = response.data;
          // Redirect to OAuth provider
          window.location.href = url;
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || `Failed to initiate ${provider} OAuth`;
          set({ loading: false, error: message });
          return { success: false, error: message };
        }
      },

      handleOAuthCallback: async (provider, code, state) => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.oauthCallback(provider, code, state);
          const { token, user } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'OAuth authentication failed';
          set({ loading: false, error: message, isAuthenticated: false });
          return { success: false, error: message };
        }
      },

      oauthLogin: async (provider, token) => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.oauthLogin(provider, token);
          const { token: authToken, user } = response.data;
          localStorage.setItem('token', authToken);
          localStorage.setItem('user', JSON.stringify(user));
          set({
            user,
            token: authToken,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || `${provider} login failed`;
          set({ loading: false, error: message, isAuthenticated: false });
          return { success: false, error: message };
        }
      },
    })
);

export default useAuthStore;

