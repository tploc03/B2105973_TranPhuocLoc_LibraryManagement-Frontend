import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue-toastification';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true' || false,
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),
  actions: {
    async login(username, password) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', {
          username,
          password,
        });
        this.isAuthenticated = true;
        this.user = response.data.user;
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error) {
        useToast().error(error.response?.data?.message || 'Đăng nhập thất bại');
        throw error;
      }
    },
    async register(username, password, email) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/register', {
          username,
          password,
          email,
        });
        this.isAuthenticated = true;
        this.user = response.data.user;
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error) {
        useToast().error(error.response?.data?.message || 'Đăng ký thất bại');
        throw error;
      }
    },
    logout() {
      this.isAuthenticated = false;
      this.user = null;
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
    },
  },
});