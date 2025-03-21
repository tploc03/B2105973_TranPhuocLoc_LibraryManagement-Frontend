<template>
  <div class="page">
    <div class="card">
      <div class="card-header bg-primary text-white">
        <h1 class="mb-0">Thêm nhà xuất bản mới</h1>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleAddNhaxuatban">
          <div class="mb-3">
            <label for="tenNXB" class="form-label">Tên nhà xuất bản</label>
            <input v-model="form.tenNXB" type="text" class="form-control" id="tenNXB" @blur="v$.form.tenNXB.$touch" />
            <div v-if="v$.form.tenNXB.$dirty && v$.form.tenNXB.$error" class="text-danger">
              {{ v$.form.tenNXB.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="diaChi" class="form-label">Địa chỉ</label>
            <input v-model="form.diaChi" type="text" class="form-control" id="diaChi" @blur="v$.form.diaChi.$touch" />
            <div v-if="v$.form.diaChi.$dirty && v$.form.diaChi.$error" class="text-danger">
              {{ v$.form.diaChi.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-control" id="email" @blur="v$.form.email.$touch" />
            <div v-if="v$.form.email.$dirty && v$.form.email.$error" class="text-danger">
              {{ v$.form.email.$errors[0].$message }}
            </div>
          </div>
          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-primary">Thêm nhà xuất bản</button>
            <router-link to="/nhaxuatbans" class="btn btn-secondary">Hủy</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
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
        tenNXB: '',
        diaChi: '',
        email: '',
      },
    };
  },
  validations() {
    return {
      form: {
        tenNXB: { required },
        diaChi: { required },
        email: { required, email },
      },
    };
  },
  methods: {
    async handleAddNhaxuatban() {
      const isValid = await this.v$.$validate();
      if (!isValid) {
        useToast().error('Vui lòng kiểm tra lại thông tin nhập');
        return;
      }

      const authStore = useAuthStore();
      try {
        const token = authStore.token;
        await axios.post('http://localhost:3000/api/nhaxuatbans', this.form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        useToast().success('Thêm nhà xuất bản thành công');
        this.$router.push('/nhaxuatbans');
      } catch (error) {
        if (error.response?.status === 401) {
          useToast().error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
          authStore.logout();
          this.$router.push('/login');
        } else {
          useToast().error(error.response?.data?.message || 'Thêm nhà xuất bản thất bại');
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