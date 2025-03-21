<template>
  <div class="page">
    <h1>Danh sách nhà xuất bản</h1>
    <router-link to="/nhaxuatbans/add" class="btn btn-primary mb-3">Thêm nhà xuất bản</router-link>
    <table class="table">
      <thead>
        <tr>
          <th>Tên nhà xuất bản</th>
          <th>Địa chỉ</th>
          <th>Email</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="nxb in nhaxuatbans" :key="nxb._id">
          <td>{{ nxb.tenNXB }}</td>
          <td>{{ nxb.diaChi }}</td>
          <td>{{ nxb.email }}</td>
          <td>
            <router-link :to="{ name: 'nhaxuatban-edit', params: { id: nhaxuatban.MANXB } }" class="btn btn-warning btn-sm me-2">Sửa</router-link>
            <button class="btn btn-danger btn-sm" @click="deleteNhaxuatban(nhaxuatban.MANXB)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';

export default {
  data() {
    return {
      nhaxuatbans: [],
    };
  },
  methods: {
    async fetchNhaxuatbans() {
      const authStore = useAuthStore();
      try {
        const token = authStore.token;
        const response = await axios.get('http://localhost:3000/api/nhaxuatbans', {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.nhaxuatbans = response.data;
      } catch (error) {
        if (error.response?.status === 401) {
          useToast().error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
          authStore.logout();
          this.$router.push('/login');
        } else {
          useToast().error('Không thể tải danh sách nhà xuất bản');
        }
      }
    },
  },
  mounted() {
    this.fetchNhaxuatbans();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.path === '/nhaxuatbans/add') {
        vm.fetchNhaxuatbans();
      }
    });
  },
};
</script>

<style scoped>
.page { padding: 20px; }
</style>