<template>
  <div class="page">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h1 class="mb-0">Danh sách Nhân viên</h1>
        <router-link to="/nhanviens/add" class="btn btn-light">Thêm nhân viên</router-link>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <input v-model="searchText" placeholder="Tìm kiếm nhân viên (mã, tên...)" class="form-control" />
        </div>
        <div class="table-responsive">
          <table class="table table-striped table-hover table-bordered">
            <thead class="table-dark">
              <tr>
                <th>Mã nhân viên</th>
                <th>Họ tên</th>
                <th>Chức vụ</th>
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="nhanvien in paginatedNhanviens" :key="nhanvien.MSNV">
                <td>{{ nhanvien.MSNV }}</td>
                <td>{{ nhanvien.HOTENNV }}</td>
                <td>{{ nhanvien.CHUCVU }}</td>
                <td>{{ nhanvien.DIACHI }}</td>
                <td>{{ nhanvien.SODIENTHOAI }}</td>
                <td>
                  <router-link :to="{ name: 'nhanvien-edit', params: { id: nhanvien.MSNV } }" class="btn btn-warning btn-sm me-2">Sửa</router-link>
                  <button class="btn btn-danger btn-sm" @click="deleteNhanvien(nhanvien.MSNV)">Xóa</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <nav>
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="currentPage--">« Trước</button>
            </li>
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
              <button class="page-link" @click="currentPage = page">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="currentPage++">Sau »</button>
            </li>
          </ul>
        </nav>
        <button class="btn btn-primary w-100" @click="refreshList">Làm mới</button>
      </div>
    </div>
  </div>
</template>

<script>
import NhanvienService from '@/services/nhanvien.service';
import { useToast } from 'vue-toastification';

export default {
  data() {
    return {
      nhanviens: [],
      searchText: '',
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    filteredNhanviens() {
      if (!this.searchText) return this.nhanviens;
      const search = this.searchText.toLowerCase();
      return this.nhanviens.filter(nhanvien =>
        nhanvien.MSNV.toLowerCase().includes(search) ||
        nhanvien.HOTENNV.toLowerCase().includes(search)
      );
    },
    paginatedNhanviens() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredNhanviens.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredNhanviens.length / this.itemsPerPage);
    },
  },
  methods: {
    async retrieveNhanviens() {
      try {
        this.nhanviens = await NhanvienService.getAll();
      } catch (error) {
        console.error(error);
        useToast().error('Không thể tải danh sách nhân viên');
      }
    },
    refreshList() {
      this.retrieveNhanviens();
      this.currentPage = 1;
      this.searchText = '';
    },
    async deleteNhanvien(id) {
      if (confirm('Bạn muốn xóa nhân viên này?')) {
        try {
          await NhanvienService.delete(id);
          useToast().success('Xóa nhân viên thành công');
          this.refreshList();
        } catch (error) {
          console.error(error);
          useToast().error('Xóa nhân viên thất bại');
        }
      }
    },
  },
  mounted() {
    this.retrieveNhanviens();
  },
};
</script>

<style scoped>
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.card {
  border-radius: 10px;
}
.card-header {
  border-radius: 10px 10px 0 0;
}
.table-hover tbody tr:hover {
  background-color: #f5f5f5;
}
.table th, .table td {
  vertical-align: middle;
  text-align: center;
}
.form-control {
  border-radius: 5px;
}
.btn {
  border-radius: 5px;
}
.shadow-sm {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>