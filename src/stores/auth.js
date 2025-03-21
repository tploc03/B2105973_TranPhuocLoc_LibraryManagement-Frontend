// src\stores\auth.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue-toastification';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true' || false,
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(username, password) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', { username, password });
        this.isAuthenticated = true;
        this.user = response.data.user;
        this.token = response.data.token;
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('token', this.token);
        // useToast().success('Đăng nhập thành công');
      } catch (error) {
        // useToast().error(error.response?.data?.message || 'Đăng nhập thất bại');
        throw error;
      }
    },
    async register(username, password, email, hoLot, ten, ngaySinh, phai, diaChi, dienThoai) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/register', {
          username,
          password,
          email,
          hoLot,
          ten,
          ngaySinh,
          phai,
          diaChi,
          dienThoai,
        });
        this.isAuthenticated = true;
        this.user = response.data.user;
        this.token = response.data.token;
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('token', this.token);
        useToast().success('Đăng ký thành công');
      } catch (error) {
        useToast().error(error.response?.data?.message || 'Đăng ký thất bại');
        throw error;
      }
    },
    logout() {
      this.isAuthenticated = false;
      this.user = null;
      this.token = null;
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    loadUserFromToken() {
      if (this.token && !this.user) {
        axios.get('http://localhost:3000/api/auth/me', {
          headers: { Authorization: `Bearer ${this.token}` },
        }).then(response => {
          this.user = response.data.user;
          localStorage.setItem('user', JSON.stringify(this.user));
        }).catch(() => this.logout());
      }
    },
    isAdmin() {
      return this.user?.role === 'admin';
    },
  },
});