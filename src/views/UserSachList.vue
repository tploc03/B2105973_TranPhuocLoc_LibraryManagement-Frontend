<template>
  <div class="page">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h1 class="mb-0">Danh sách Sách</h1>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <input v-model="searchText" placeholder="Tìm kiếm sách (mã, tên...)" class="form-control" />
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
                <td>{{ formatCurrency(sach.DONGIA) }}</td>
                <td>{{ sach.SOQUYEN }}</td>
                <td>{{ sach.NAMXUATBAN }}</td>
                <td>{{ sach.MANXB }}</td>
                <td>
                  <button
                    class="btn btn-success btn-sm"
                    @click="borrowBook(sach.MASACH)"
                    :disabled="sach.SOQUYEN <= 0 || pendingRequests.includes(sach.MASACH)"
                  >
                    Mượn
                  </button>
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
import TheodoimuonsachService from '@/services/theodoimuonsach.service';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import { formatCurrency } from '@/utils/format';

export default {
  data() {
    return {
      sachs: [],
      muonsachs: [],
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
        sach.TENSACH.toLowerCase().includes(search)
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
    pendingRequests() {
      return this.muonsachs.filter(m => m.status === 'pending').map(m => m.MASACH);
    },
  },
  methods: {
    async retrieveSachs() {
      const authStore = useAuthStore();
      try {
        this.sachs = await SachService.getAll();
        this.muonsachs = await TheodoimuonsachService.getAll();
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
    refreshList() {
      this.retrieveSachs();
      this.currentPage = 1;
      this.searchText = '';
    },
    async borrowBook(masach) {
      const authStore = useAuthStore();
      try {
        await TheodoimuonsachService.create({ MASACH: masach, NGAYMUON: new Date().toISOString() });
        useToast().success('Yêu cầu mượn sách đã được gửi, chờ duyệt');
        this.refreshList();
      } catch (error) {
        if (error.response?.status === 401) {
          useToast().error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
          authStore.logout();
          this.$router.push('/login');
        } else {
          useToast().error(error.response?.data?.message || 'Gửi yêu cầu mượn sách thất bại');
        }
      }
    },
    formatCurrency,
  },
  mounted() {
    this.retrieveSachs();
  },
};
</script>

<style scoped>
.page { max-width: 1200px; margin: 0 auto; padding: 20px; }
.card { border-radius: 10px; }
.card-header { border-radius: 10px 10px 0 0; }
.table-hover tbody tr:hover { background-color: #f5f5f5; }
.table th, .table td { vertical-align: middle; text-align: center; }
.form-control { border-radius: 5px; }
.btn { border-radius: 5px; }
.shadow-sm { box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
</style>