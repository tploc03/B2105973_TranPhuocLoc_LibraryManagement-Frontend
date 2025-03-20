<template>
  <div class="page">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h1 class="mb-0">Danh sách Mượn sách</h1>
        <router-link to="/muonsachs/add" class="btn btn-light">Thêm mượn sách</router-link>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <input v-model="searchText" placeholder="Tìm kiếm mượn sách (mã độc giả, mã sách...)" class="form-control" />
        </div>
        <div class="table-responsive">
          <table class="table table-striped table-hover table-bordered">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Mã độc giả</th>
                <th>Mã sách</th>
                <th>Ngày mượn</th>
                <th>Ngày trả</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="muonsach in paginatedMuonsachs" :key="muonsach._id">
                <td>{{ muonsach._id }}</td>
                <td>{{ muonsach.MADOCGIA }}</td>
                <td>{{ muonsach.MASACH }}</td>
                <td>{{ formatDate(muonsach.NGAYMUON) }}</td>
                <td>{{ formatDate(muonsach.NGAYTRA) || 'Chưa trả' }}</td>
                <td>
                  <router-link :to="{ name: 'muonsach-edit', params: { id: muonsach._id } }" class="btn btn-warning btn-sm me-2">Sửa</router-link>
                  <button class="btn btn-danger btn-sm me-2" @click="deleteMuonsach(muonsach._id)">Xóa</button>
                  <button v-if="!muonsach.NGAYTRA" class="btn btn-success btn-sm" @click="returnBook(muonsach._id)">Trả sách</button>
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
import MuonsachService from '@/services/muonsach.service';
import SachService from '@/services/sach.service';
import { useToast } from 'vue-toastification';
import dayjs from 'dayjs';

export default {
  data() {
    return {
      muonsachs: [],
      searchText: '',
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    filteredMuonsachs() {
      if (!this.searchText) return this.muonsachs;
      const search = this.searchText.toLowerCase();
      return this.muonsachs.filter(muonsach =>
        muonsach.MADOCGIA.toLowerCase().includes(search) ||
        muonsach.MASACH.toLowerCase().includes(search)
      );
    },
    paginatedMuonsachs() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredMuonsachs.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredMuonsachs.length / this.itemsPerPage);
    },
  },
  methods: {
    async retrieveMuonsachs() {
      try {
        this.muonsachs = await MuonsachService.getAll();
      } catch (error) {
        console.error(error);
        useToast().error('Không thể tải danh sách mượn sách');
      }
    },
    refreshList() {
      this.retrieveMuonsachs();
      this.currentPage = 1;
      this.searchText = '';
    },
    async deleteMuonsach(id) {
      if (confirm('Bạn muốn xóa mượn sách này?')) {
        try {
          await MuonsachService.delete(id);
          useToast().success('Xóa mượn sách thành công');
          this.refreshList();
        } catch (error) {
          console.error(error);
          useToast().error('Xóa mượn sách thất bại');
        }
      }
    },
    async returnBook(id) {
      try {
        const muonsach = this.muonsachs.find(m => m._id === id);
        await MuonsachService.update(id, { ...muonsach, NGAYTRA: new Date().toISOString() });
        const sach = await SachService.get(muonsach.MASACH);
        await SachService.update(muonsach.MASACH, { ...sach, SOQUYEN: sach.SOQUYEN + 1 });
        useToast().success('Trả sách thành công');
        this.refreshList();
      } catch (error) {
        console.error(error);
        useToast().error('Trả sách thất bại');
      }
    },
    formatDate(date) {
      return date ? dayjs(date).format('DD/MM/YYYY') : '';
    },
  },
  mounted() {
    this.retrieveMuonsachs();
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