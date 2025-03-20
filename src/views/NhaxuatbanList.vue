<template>
  <div class="page">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h1 class="mb-0">Danh sách Nhà xuất bản</h1>
        <router-link to="/nhaxuatbans/add" class="btn btn-light">Thêm nhà xuất bản</router-link>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <input v-model="searchText" placeholder="Tìm kiếm nhà xuất bản (mã, tên...)" class="form-control" />
        </div>
        <div class="table-responsive">
          <table class="table table-striped table-hover table-bordered">
            <thead class="table-dark">
              <tr>
                <th>Mã nhà xuất bản</th>
                <th>Tên nhà xuất bản</th>
                <th>Địa chỉ</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="nhaxuatban in paginatedNhaxuatbans" :key="nhaxuatban.MANXB">
                <td>{{ nhaxuatban.MANXB }}</td>
                <td>{{ nhaxuatban.TENNXB }}</td>
                <td>{{ nhaxuatban.DIACHI }}</td>
                <td>
                  <router-link :to="{ name: 'nhaxuatban-edit', params: { id: nhaxuatban.MANXB } }" class="btn btn-warning btn-sm me-2">Sửa</router-link>
                  <button class="btn btn-danger btn-sm" @click="deleteNhaxuatban(nhaxuatban.MANXB)">Xóa</button>
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
import NhaxuatbanService from '@/services/nhaxuatban.service';
import { useToast } from 'vue-toastification';

export default {
  data() {
    return {
      nhaxuatbans: [],
      searchText: '',
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    filteredNhaxuatbans() {
      if (!this.searchText) return this.nhaxuatbans;
      const search = this.searchText.toLowerCase();
      return this.nhaxuatbans.filter(nhaxuatban =>
        nhaxuatban.MANXB.toLowerCase().includes(search) ||
        nhaxuatban.TENNXB.toLowerCase().includes(search)
      );
    },
    paginatedNhaxuatbans() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredNhaxuatbans.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredNhaxuatbans.length / this.itemsPerPage);
    },
  },
  methods: {
    async retrieveNhaxuatbans() {
      try {
        this.nhaxuatbans = await NhaxuatbanService.getAll();
      } catch (error) {
        console.error(error);
        useToast().error('Không thể tải danh sách nhà xuất bản');
      }
    },
    refreshList() {
      this.retrieveNhaxuatbans();
      this.currentPage = 1;
      this.searchText = '';
    },
    async deleteNhaxuatban(id) {
      if (confirm('Bạn muốn xóa nhà xuất bản này?')) {
        try {
          await NhaxuatbanService.delete(id);
          useToast().success('Xóa nhà xuất bản thành công');
          this.refreshList();
        } catch (error) {
          console.error(error);
          useToast().error('Xóa nhà xuất bản thất bại');
        }
      }
    },
  },
  mounted() {
    this.retrieveNhaxuatbans();
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