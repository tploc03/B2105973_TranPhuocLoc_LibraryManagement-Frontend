<!-- src\views\UserMuonsachList.vue -->
<template>
  <div class="page">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h1 class="mb-0">Lịch sử Mượn sách</h1>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-hover table-bordered">
            <thead class="table-dark">
              <tr>
                <th>Mã sách</th>
                <th>Tên sách</th>
                <th>Ngày mượn</th>
                <th>Ngày trả</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="muonsach in paginatedMuonsachs" :key="muonsach._id">
                <td>{{ muonsach.MASACH }}</td>
                <td>{{ getSachName(muonsach.MASACH) || 'Không xác định' }}</td>
                <td>{{ formatDate(muonsach.NGAYMUON) }}</td>
                <td>{{ formatDate(muonsach.NGAYTRA) || 'Chưa trả' }}</td>
                <td>
                  {{ muonsach.status === 'pending' ? 'Chờ duyệt' : muonsach.status === 'approved' ? 'Đã duyệt' : 'Bị từ chối' }}
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
import TheodoimuonsachService from '@/services/theodoimuonsach.service';
import SachService from '@/services/sach.service';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import { formatDate } from '@/utils/format';

export default {
  data() {
    return {
      muonsachs: [],
      sachs: [], // Lưu danh sách sách để lấy tên sách
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    paginatedMuonsachs() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.muonsachs.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.muonsachs.length / this.itemsPerPage);
    },
  },
  methods: {
    async retrieveMuonsachs() {
      const authStore = useAuthStore();
      try {
        this.muonsachs = await TheodoimuonsachService.getAll();
        this.sachs = await SachService.getAll(); // Lấy danh sách sách để hiển thị tên sách
      } catch (error) {
        if (error.response?.status === 401) {
          useToast().error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
          authStore.logout();
          this.$router.push('/login');
        } else {
          useToast().error('Không thể tải lịch sử mượn sách');
        }
      }
    },
    getSachName(masach) {
      const sach = this.sachs.find(s => s.MASACH === masach);
      return sach ? sach.TENSACH : null;
    },
    refreshList() {
      this.retrieveMuonsachs();
      this.currentPage = 1;
    },
    formatDate,
  },
  mounted() {
    this.retrieveMuonsachs();
  },
};
</script>

<style scoped>
.page { max-width: 1200px; margin: 0 auto; padding: 20px; }
.card { border-radius: 10px; }
.card-header { border-radius: 10px 10px 0 0; }
.table-hover tbody tr:hover { background-color: #f5f5f5; }
.table th, .table td { vertical-align: middle; text-align: center; }
.btn { border-radius: 5px; }
.shadow-sm { box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
</style>