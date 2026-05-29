import { defineStore } from 'pinia';

const API_URL = 'https://applications-backend-zpxu.onrender.com/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || '',
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role || '',
    isRoot: (state) => state.user?.role === 'Root',
    isAdmin: (state) => state.user?.role === 'Admin',
    isCounselor: (state) => state.user?.role === 'Counselor' || state.user?.role === 'CounselorLead',
    isCounselorLead: (state) => state.user?.role === 'CounselorLead',
    isOfficer: (state) => state.user?.role === 'ApplicationOfficer',
    isOfficerLead: (state) => state.user?.role === 'OfficerLead',
  },

  actions: {
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed. Please check your credentials.');
        }

        this.token = data.token;
        this.user = data.user;

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        return true;
      } catch (err) {
        console.error('Login action error:', err);
        this.error = err.message || 'Server error. Please try again.';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async registerAgency(organizationName, name, email, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_URL}/auth/register-agency`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ organizationName, name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed.');
        }

        this.token = data.token;
        this.user = data.user;

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        return true;
      } catch (err) {
        console.error('Register agency action error:', err);
        this.error = err.message || 'Server error. Please try again.';
        return false;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    async fetchCurrentUser() {
      if (!this.token) return;

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          this.user = userData;
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          // Token expired or invalid
          this.logout();
        }
      } catch (err) {
        console.error('Fetch current user error:', err);
        this.logout();
      }
    },
  },
});
