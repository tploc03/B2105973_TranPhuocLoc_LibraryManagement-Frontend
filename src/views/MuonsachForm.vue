<template>
  <div class="page">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h1 class="mb-0">{{ isEdit ? 'Sửa Mượn sách' : 'Thêm Mượn sách' }}</h1>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="MADOCGIA" class="form-label">Mã độc giả</label>
            <input v-model="muonsach.MADOCGIA" type="text" class="form-control" id="MADOCGIA" placeholder="Nhập mã độc giả (VD: DG001)" @blur="v$.muonsach.MADOCGIA.$touch" />
            <div v-if="v$.muonsach.MADOCGIA.$dirty && v$.muonsach.MADOCGIA.$error" class="text-danger">
              {{ v$.muonsach.MADOCGIA.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="MASACH" class="form-label">Mã sách</label>
            <input v-model="muonsach.MASACH" type="text" class="form-control" id="MASACH" placeholder="Nhập mã sách (VD: S001)" @blur="v$.muonsach.MASACH.$touch" />
            <div v-if="v$.muonsach.MASACH.$dirty && v$.muonsach.MASACH.$error" class="text-danger">
              {{ v$.muonsach.MASACH.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="NGAYMUON" class="form-label">Ngày mượn</label>
            <input v-model="muonsach.NGAYMUON" type="date" class="form-control" id="NGAYMUON" placeholder="Chọn ngày mượn" @blur="v$.muonsach.NGAYMUON.$touch" />
            <div v-if="v$.muonsach.NGAYMUON.$dirty && v$.muonsach.NGAYMUON.$error" class="text-danger">
              {{ v$.muonsach.NGAYMUON.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="NGAYTRA" class="form-label">Ngày trả</label>
            <input v-model="muonsach.NGAYTRA" type="date" class="form-control" id="NGAYTRA" placeholder="Chọn ngày trả" @blur="v$.muonsach.NGAYTRA.$touch" />
            <div v-if="v$.muonsach.NGAYTRA.$dirty && v$.muonsach.NGAYTRA.$error" class="text-danger">
              {{ v$.muonsach.NGAYTRA.$errors[0].$message }}
            </div>
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button type="submit" class="btn btn-primary btn-lg">Lưu</button>
            <router-link to="/muonsachs" class="btn btn-outline-secondary btn-lg">Hủy</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import MuonsachService from '@/services/muonsach.service';
import SachService from '@/services/sach.service';
import { useToast } from 'vue-toastification';
import dayjs from 'dayjs';

const alphaNum = helpers.regex(/^[a-zA-Z0-9]+$/);
const validDateRange = (value, vm) => !value || !vm.NGAYMUON || new Date(value) >= new Date(vm.NGAYMUON);

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      muonsach: {
        MADOCGIA: '',
        MASACH: '',
        NGAYMUON: '',
        NGAYTRA: '',
      },
      isEdit: false,
    };
  },
  validations() {
    return {
      muonsach: {
        MADOCGIA: { required, alphaNum },
        MASACH: { required, alphaNum },
        NGAYMUON: { required },
        NGAYTRA: { validDateRange },
      },
    };
  },
  methods: {
    async handleSubmit() {
      const isValid = await this.v$.$validate();
      if (!isValid) return;

      try {
        if (this.isEdit) {
          await MuonsachService.update(this.$route.params.id, this.muonsach);
          useToast().success('Cập nhật mượn sách thành công');
        } else {
          const sach = await SachService.get(this.muonsach.MASACH);
          if (sach.SOQUYEN <= 0) {
            useToast().error('Sách đã hết, không thể mượn');
            return;
          }
          await MuonsachService.create(this.muonsach);
          await SachService.update(this.muonsach.MASACH, { ...sach, SOQUYEN: sach.SOQUYEN - 1 });
          useToast().success('Thêm mượn sách thành công');
        }
        this.$router.push('/muonsachs');
      } catch (error) {
        console.error(error);
        useToast().error('Lưu mượn sách thất bại');
      }
    },
    async loadMuonsach() {
      if (this.$route.params.id) {
        this.isEdit = true;
        try {
          const data = await MuonsachService.get(this.$route.params.id);
          this.muonsach = {
            ...data,
            NGAYMUON: dayjs(data.NGAYMUON).format('YYYY-MM-DD'),
            NGAYTRA: data.NGAYTRA ? dayjs(data.NGAYTRA).format('YYYY-MM-DD') : '',
          };
        } catch (error) {
          console.error(error);
          useToast().error('Không thể tải thông tin mượn sách');
        }
      }
    },
  },
  mounted() {
    this.loadMuonsach();
  },
};
</script>

<style scoped>
.page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.card {
  border-radius: 10px;
}
.card-header {
  border-radius: 10px 10px 0 0;
}
.form-control {
  border-radius: 5px;
}
.btn-lg {
  padding: 10px 20px;
}
.shadow-sm {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>