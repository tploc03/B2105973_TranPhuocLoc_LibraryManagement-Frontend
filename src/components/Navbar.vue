<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Quản lý Thư viện</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/sachs">Sách</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/docgias">Độc giả</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/nhanviens">Nhân viên</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/nhaxuatbans">Nhà xuất bản</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/muonsachs">Mượn sách</router-link>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item">
            <button class="nav-link btn btn-link text-white" @click="logout">Đăng xuất</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';

export default {
  methods: {
    logout() {
      const authStore = useAuthStore();
      authStore.logout();
      useToast().success('Đăng xuất thành công');
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.navbar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.nav-link:hover {
  color: #ffffff !important;
}
</style>