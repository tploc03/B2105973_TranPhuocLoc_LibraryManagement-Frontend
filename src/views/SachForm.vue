<template>
  <div class="page">
    <div class="card">
      <div class="card-header bg-primary text-white">
        <h1 class="mb-0">Thêm sách mới</h1>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleAddSach">
          <div class="mb-3">
            <label for="tenSach" class="form-label">Tên sách</label>
            <input v-model="form.tenSach" type="text" class="form-control" id="tenSach" @blur="v$.form.tenSach.$touch" />
            <div v-if="v$.form.tenSach.$dirty && v$.form.tenSach.$error" class="text-danger">
              {{ v$.form.tenSach.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="tacGia" class="form-label">Tác giả</label>
            <input v-model="form.tacGia" type="text" class="form-control" id="tacGia" @blur="v$.form.tacGia.$touch" />
            <div v-if="v$.form.tacGia.$dirty && v$.form.tacGia.$error" class="text-danger">
              {{ v$.form.tacGia.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="nhaXuatBan" class="form-label">Nhà xuất bản</label>
            <input v-model="form.nhaXuatBan" type="text" class="form-control" id="nhaXuatBan" @blur="v$.form.nhaXuatBan.$touch" />
            <div v-if="v$.form.nhaXuatBan.$dirty && v$.form.nhaXuatBan.$error" class="text-danger">
              {{ v$.form.nhaXuatBan.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="namXuatBan" class="form-label">Năm xuất bản</label>
            <input v-model="form.namXuatBan" type="number" class="form-control" id="namXuatBan" @blur="v$.form.namXuatBan.$touch" />
            <div v-if="v$.form.namXuatBan.$dirty && v$.form.namXuatBan.$error" class="text-danger">
              {{ v$.form.namXuatBan.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="soQuyen" class="form-label">Số quyển</label>
            <input v-model="form.soQuyen" type="number" class="form-control" id="soQuyen" @blur="v$.form.soQuyen.$touch" />
            <div v-if="v$.form.soQuyen.$dirty && v$.form.soQuyen.$error" class="text-danger">
              {{ v$.form.soQuyen.$errors[0].$message }}
            </div>
          </div>
          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-primary">Thêm sách</button>
            <router-link to="/sachs" class="btn btn-secondary">Hủy</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required, minValue, maxValue } from '@vuelidate/validators';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      form: {
        tenSach: '',
        tacGia: '',
        nhaXuatBan: '',
        namXuatBan: '',
        soQuyen: 0,
      },
    };
  },
  validations() {
    return {
      form: {
        tenSach: { required },
        tacGia: { required },
        nhaXuatBan: { required },
        namXuatBan: { required, minValue: minValue(1900), maxValue: maxValue(new Date().getFullYear()) },
        soQuyen: { required, minValue: minValue(1) },
      },
    };
  },
  methods: {
    async handleAddSach() {
      const isValid = await this.v$.$validate();
      if (!isValid) {
        useToast().error('Vui lòng kiểm tra lại thông tin nhập');
        return;
      }

      const authStore = useAuthStore();
      try {
        const token = authStore.token; // Lấy token từ authStore
        await axios.post('http://localhost:3000/api/sachs', this.form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        useToast().success('Thêm sách thành công');
        this.$router.push('/sachs');
      } catch (error) {
        if (error.response?.status === 401) {
          useToast().error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
          authStore.logout();
          this.$router.push('/login');
        } else {
          useToast().error(error.response?.data?.message || 'Thêm sách thất bại');
        }
      }
    },
  },
};
</script>

<style scoped>
.page { max-width: 600px; margin: 0 auto; padding-top: 20px; }
.card { border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
.card-header { border-radius: 10px 10px 0 0; }
</style>