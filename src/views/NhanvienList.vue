<template>
  <div class="page">
    <h1>Danh sách nhân viên</h1>
    <router-link to="/nhanviens/add" class="btn btn-primary mb-3">Thêm nhân viên</router-link>
    <table class="table">
      <thead>
        <tr>
          <th>Họ lót</th>
          <th>Tên</th>
          <th>Ngày sinh</th>
          <th>Phái</th>
          <th>Địa chỉ</th>
          <th>Số điện thoại</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="nhanvien in nhanviens" :key="nhanvien._id">
          <td>{{ nhanvien.hoLot }}</td>
          <td>{{ nhanvien.ten }}</td>
          <td>{{ nhanvien.ngaySinh }}</td>
          <td>{{ nhanvien.phai }}</td>
          <td>{{ nhanvien.diaChi }}</td>
          <td>{{ nhanvien.dienThoai }}</td>
          <td>
            <router-link :to="{ name: 'nhanvien-edit', params: { id: nhanvien.MSNV } }" class="btn btn-warning btn-sm me-2">Sửa</router-link>
            <button class="btn btn-danger btn-sm" @click="deleteNhanvien(nhanvien.MSNV)">Xóa</button>
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
      nhanviens: [],
    };
  },
  methods: {
    async fetchNhanviens() {
      const authStore = useAuthStore();
      try {
        const token = authStore.token;
        const response = await axios.get('http://localhost:3000/api/nhanviens', {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.nhanviens = response.data;
      } catch (error) {
        if (error.response?.status === 401) {
          useToast().error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
          authStore.logout();
          this.$router.push('/login');
        } else {
          useToast().error('Không thể tải danh sách nhân viên');
        }
      }
    },
  },
  mounted() {
    this.fetchNhanviens();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.path === '/nhanviens/add') {
        vm.fetchNhanviens();
      }
    });
  },
};
</script>

<style scoped>
.page { padding: 20px; }
</style>