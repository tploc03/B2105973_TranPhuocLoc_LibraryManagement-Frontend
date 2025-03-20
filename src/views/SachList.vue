<template>
  <div class="page">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h1 class="mb-0">Danh sách Sách</h1>
        <router-link to="/sachs/add" class="btn btn-light">Thêm sách</router-link>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <input v-model="searchText" placeholder="Tìm kiếm sách (mã, tên, nhà xuất bản...)" class="form-control" />
        </div>
        <div class="table-responsive">
          <table class="table table-striped table-hover table-bordered">
            <thead class="table-dark">
              <tr>
                <th>Mã sách</th>
                <th>Tên sách</th>
                <th>Đơn giá</th>
                <th>Số quyển</th>
                <th>Năm xuất bản</th>
                <th>Nhà xuất bản</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sach in paginatedSachs" :key="sach.MASACH">
                <td>{{ sach.MASACH }}</td>
                <td>{{ sach.TENSACH }}</td>
                <td>{{ sach.DONGIA }}</td>
                <td>{{ sach.SOQUYEN }}</td>
                <td>{{ sach.NAMXUATBAN }}</td>
                <td>{{ sach.MANXB }}</td>
                <td>
                  <router-link :to="{ name: 'sach-edit', params: { id: sach.MASACH } }" class="btn btn-warning btn-sm me-2">Sửa</router-link>
                  <button class="btn btn-danger btn-sm" @click="deleteSach(sach.MASACH)">Xóa</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <nav>
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="currentPage--">&laquo; Trước</button>
            </li>
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
              <button class="page-link" @click="currentPage = page">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="currentPage++">Sau &raquo;</button>
            </li>
          </ul>
        </nav>
        <button class="btn btn-primary w-100" @click="refreshList">Làm mới</button>
      </div>
    </div>
  </div>
</template>

<script>
import SachService from '@/services/sach.service';
import { useToast } from 'vue-toastification';

export default {
  data() {
    return {
      sachs: [],
      searchText: '',
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    filteredSachs() {
      if (!this.searchText) return this.sachs;
      const search = this.searchText.toLowerCase();
      return this.sachs.filter(sach =>
        sach.MASACH.toLowerCase().includes(search) ||
        sach.TENSACH.toLowerCase().includes(search) ||
        sach.MANXB.toLowerCase().includes(search)
      );
    },
    paginatedSachs() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredSachs.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredSachs.length / this.itemsPerPage);
    },
  },
  methods: {
    async retrieveSachs() {
      try {
        this.sachs = await SachService.getAll();
      } catch (error) {
        console.error(error);
        useToast().error('Không thể tải danh sách sách');
      }
    },
    refreshList() {
      this.retrieveSachs();
      this.currentPage = 1;
      this.searchText = '';
    },
    async deleteSach(id) {
      if (confirm('Bạn muốn xóa sách này?')) {
        try {
          await SachService.delete(id);
          useToast().success('Xóa sách thành công');
          this.refreshList();
        } catch (error) {
          console.error(error);
          useToast().error('Xóa sách thất bại');
        }
      }
    },
  },
  mounted() {
    this.retrieveSachs();
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