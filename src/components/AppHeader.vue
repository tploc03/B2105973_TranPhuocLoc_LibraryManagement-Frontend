<!-- src/components/AppHeader.vue -->
<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Quản lý Thư viện</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'sach-list' }">Sách</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'docgia-list' }">Độc giả</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'nhanvien-list' }">Nhân viên</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'nhaxuatban-list' }">Nhà xuất bản</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'muonsach-list' }">Mượn sách</router-link>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item" v-if="isAuthenticated">
            <span class="nav-link text-light">Xin chào, {{ user?.username }}</span>
          </li>
          <li class="nav-item">
            <router-link v-if="!isAuthenticated" class="nav-link" :to="{ name: 'login' }">Đăng nhập</router-link>
            <button v-else class="nav-link btn btn-link" @click="logout">Đăng xuất</button>
          </li>
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link class="nav-link" :to="{ name: 'register' }">Đăng ký</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  computed: {
    isAuthenticated() {
      return this.authStore.isAuthenticated;
    },
    user() {
      return this.authStore.user;
    },
  },
  methods: {
    logout() {
      this.authStore.logout();
      this.$router.push('/login');
    },
  },
  mounted() {
    this.authStore.loadUserFromToken();
  },
};
</script>

<style scoped>
.navbar {
  margin-bottom: 20px;
}
</style>