<template>
  <div class="page">
    <h1>Danh sách sách</h1>
    <router-link to="/sachs/add" class="btn btn-primary mb-3">Thêm sách</router-link>
    <table class="table">
      <thead>
        <tr>
          <th>Tên sách</th>
          <th>Tác giả</th>
          <th>Nhà xuất bản</th>
          <th>Năm xuất bản</th>
          <th>Số quyển</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sach in sachs" :key="sach._id">
          <td>{{ sach.tenSach }}</td>
          <td>{{ sach.tacGia }}</td>
          <td>{{ sach.nhaXuatBan }}</td>
          <td>{{ sach.namXuatBan }}</td>
          <td>{{ sach.soQuyen }}</td>
          <td>
              <router-link :to="{ name: 'sach-edit', params: { id: sach.MASACH } }" class="btn btn-warning btn-sm me-2">Sửa</router-link>
              <button class="btn btn-danger btn-sm" @click="deleteSach(sach.MASACH)">Xóa</button>
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
      sachs: [],
    };
  },
  methods: {
    async fetchSachs() {
      const authStore = useAuthStore();
      try {
        const token = authStore.token;
        const response = await axios.get('http://localhost:3000/api/sachs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.sachs = response.data;
      } catch (error) {
        if (error.response?.status === 401) {
          useToast().error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
          authStore.logout();
          this.$router.push('/login');
        } else {
          useToast().error('Không thể tải danh sách sách');
        }
      }
    },
  },
  mounted() {
    this.fetchSachs();
  },
  // Làm mới danh sách khi quay lại từ trang thêm sách
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.path === '/sachs/add') {
        vm.fetchSachs();
      }
    });
  },
};
</script>

<style scoped>
.page { padding: 20px; }
</style>                  