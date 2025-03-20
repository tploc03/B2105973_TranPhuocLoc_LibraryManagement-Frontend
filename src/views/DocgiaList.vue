<template>
  <div class="page">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h1 class="mb-0">Danh sách Độc giả</h1>
        <router-link to="/docgias/add" class="btn btn-light">Thêm độc giả</router-link>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <input v-model="searchText" placeholder="Tìm kiếm độc giả (mã, tên...)" class="form-control" />
        </div>
        <div class="table-responsive">
          <table class="table table-striped table-hover table-bordered">
            <thead class="table-dark">
              <tr>
                <th>Mã độc giả</th>
                <th>Họ lót</th>
                <th>Tên</th>
                <th>Ngày sinh</th>
                <th>Phái</th>
                <th>Địa chỉ</th>
                <th>Điện thoại</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="docgia in paginatedDocgias" :key="docgia.MADOCGIA">
                <td>{{ docgia.MADOCGIA }}</td>
                <td>{{ docgia.HOLOT }}</td>
                <td>{{ docgia.TEN }}</td>
                <td>{{ formatDate(docgia.NGAYSINH) }}</td>
                <td>{{ docgia.PHAI }}</td>
                <td>{{ docgia.DIACHI }}</td>
                <td>{{ docgia.DIENTHOAI }}</td>
                <td>
                  <router-link :to="{ name: 'docgia-edit', params: { id: docgia.MADOCGIA } }" class="btn btn-warning btn-sm me-2">Sửa</router-link>
                  <button class="btn btn-danger btn-sm" @click="deleteDocgia(docgia.MADOCGIA)">Xóa</button>
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
import DocgiaService from '@/services/docgia.service';
import { useToast } from 'vue-toastification';
import dayjs from 'dayjs';

export default {
  data() {
    return {
      docgias: [],
      searchText: '',
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    filteredDocgias() {
      if (!this.searchText) return this.docgias;
      const search = this.searchText.toLowerCase();
      return this.docgias.filter(docgia =>
        docgia.MADOCGIA.toLowerCase().includes(search) ||
        docgia.HOLOT.toLowerCase().includes(search) ||
        docgia.TEN.toLowerCase().includes(search)
      );
    },
    paginatedDocgias() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredDocgias.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredDocgias.length / this.itemsPerPage);
    },
  },
  methods: {
    async retrieveDocgias() {
      try {
        this.docgias = await DocgiaService.getAll();
      } catch (error) {
        console.error(error);
        useToast().error('Không thể tải danh sách độc giả');
      }
    },
    refreshList() {
      this.retrieveDocgias();
      this.currentPage = 1;
      this.searchText = '';
    },
    async deleteDocgia(id) {
      if (confirm('Bạn muốn xóa độc giả này?')) {
        try {
          await DocgiaService.delete(id);
          useToast().success('Xóa độc giả thành công');
          this.refreshList();
        } catch (error) {
          console.error(error);
          useToast().error('Xóa độc giả thất bại');
        }
      }
    },
    formatDate(date) {
      return date ? dayjs(date).format('DD/MM/YYYY') : '';
    },
  },
  mounted() {
    this.retrieveDocgias();
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