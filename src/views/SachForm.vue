<template>
  <div class="page">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h1 class="mb-0">{{ isEdit ? 'Sửa Sách' : 'Thêm Sách' }}</h1>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="MASACH" class="form-label">Mã sách</label>
            <input v-model="sach.MASACH" type="text" class="form-control" id="MASACH" :disabled="isEdit" placeholder="Nhập mã sách (VD: S001)" @blur="v$.sach.MASACH.$touch" />
            <div v-if="v$.sach.MASACH.$dirty && v$.sach.MASACH.$error" class="text-danger">
              {{ v$.sach.MASACH.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="TENSACH" class="form-label">Tên sách</label>
            <input v-model="sach.TENSACH" type="text" class="form-control" id="TENSACH" placeholder="Nhập tên sách" @blur="v$.sach.TENSACH.$touch" />
            <div v-if="v$.sach.TENSACH.$dirty && v$.sach.TENSACH.$error" class="text-danger">
              {{ v$.sach.TENSACH.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="DONGIA" class="form-label">Đơn giá</label>
            <input v-model="sach.DONGIA" type="number" class="form-control" id="DONGIA" placeholder="Nhập đơn giá (VD: 50000)" @blur="v$.sach.DONGIA.$touch" />
            <div v-if="v$.sach.DONGIA.$dirty && v$.sach.DONGIA.$error" class="text-danger">
              {{ v$.sach.DONGIA.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="SOQUYEN" class="form-label">Số quyển</label>
            <input v-model="sach.SOQUYEN" type="number" class="form-control" id="SOQUYEN" placeholder="Nhập số quyển" @blur="v$.sach.SOQUYEN.$touch" />
            <div v-if="v$.sach.SOQUYEN.$dirty && v$.sach.SOQUYEN.$error" class="text-danger">
              {{ v$.sach.SOQUYEN.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="NAMXUATBAN" class="form-label">Năm xuất bản</label>
            <input v-model="sach.NAMXUATBAN" type="number" class="form-control" id="NAMXUATBAN" placeholder="Nhập năm xuất bản (VD: 2023)" @blur="v$.sach.NAMXUATBAN.$touch" />
            <div v-if="v$.sach.NAMXUATBAN.$dirty && v$.sach.NAMXUATBAN.$error" class="text-danger">
              {{ v$.sach.NAMXUATBAN.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="MANXB" class="form-label">Mã nhà xuất bản</label>
            <input v-model="sach.MANXB" type="text" class="form-control" id="MANXB" placeholder="Nhập mã nhà xuất bản (VD: NXB001)" @blur="v$.sach.MANXB.$touch" />
            <div v-if="v$.sach.MANXB.$dirty && v$.sach.MANXB.$error" class="text-danger">
              {{ v$.sach.MANXB.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="NGUONGOC_TACGIA" class="form-label">Tác giả</label>
            <input v-model="sach.NGUONGOC_TACGIA" type="text" class="form-control" id="NGUONGOC_TACGIA" placeholder="Nhập tên tác giả" @blur="v$.sach.NGUONGOC_TACGIA.$touch" />
            <div v-if="v$.sach.NGUONGOC_TACGIA.$dirty && v$.sach.NGUONGOC_TACGIA.$error" class="text-danger">
              {{ v$.sach.NGUONGOC_TACGIA.$errors[0].$message }}
            </div>
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button type="submit" class="btn btn-primary btn-lg">Lưu</button>
            <router-link to="/" class="btn btn-outline-secondary btn-lg">Hủy</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required, numeric, minValue, maxValue, integer, helpers } from '@vuelidate/validators';
import SachService from '@/services/sach.service';
import { useToast } from 'vue-toastification';

const alphaNum = helpers.regex(/^[a-zA-Z0-9]+$/);

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      sach: {
        MASACH: '',
        TENSACH: '',
        DONGIA: '',
        SOQUYEN: '',
        NAMXUATBAN: '',
        MANXB: '',
        NGUONGOC_TACGIA: '',
      },
      isEdit: false,
    };
  },
  validations() {
    return {
      sach: {
        MASACH: { required, alphaNum },
        TENSACH: { required },
        DONGIA: { required, numeric, minValue: minValue(0) },
        SOQUYEN: { required, integer, minValue: minValue(0) },
        NAMXUATBAN: { required, integer, minValue: minValue(1900), maxValue: maxValue(2025) },
        MANXB: { required, alphaNum },
        NGUONGOC_TACGIA: { required },
      },
    };
  },
  methods: {
    async handleSubmit() {
      const isValid = await this.v$.$validate();
      if (!isValid) return;

      try {
        if (this.isEdit) {
          await SachService.update(this.sach.MASACH, this.sach);
          useToast().success('Cập nhật sách thành công');
        } else {
          await SachService.create(this.sach);
          useToast().success('Thêm sách thành công');
        }
        this.$router.push('/');
      } catch (error) {
        console.error(error);
        useToast().error('Lưu sách thất bại');
      }
    },
    async loadSach() {
      if (this.$route.params.id) {
        this.isEdit = true;
        try {
          const data = await SachService.get(this.$route.params.id);
          this.sach = { ...data };
        } catch (error) {
          console.error(error);
          useToast().error('Không thể tải thông tin sách');
        }
      }
    },
  },
  mounted() {
    this.loadSach();
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