<!-- src/views/Register.vue -->
<template>
  <div class="page">
    <div class="card">
      <div class="card-header bg-primary text-white">
        <h1 class="mb-0">Đăng ký</h1>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleRegister">
          <div class="mb-3">
            <label for="username" class="form-label">Tên đăng nhập</label>
            <input v-model="form.username" type="text" class="form-control" id="username" @blur="v$.form.username.$touch" />
            <div v-if="v$.form.username.$dirty && v$.form.username.$error" class="text-danger">
              {{ v$.form.username.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-control" id="email" @blur="v$.form.email.$touch" />
            <div v-if="v$.form.email.$dirty && v$.form.email.$error" class="text-danger">
              {{ v$.form.email.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Mật khẩu</label>
            <input v-model="form.password" type="password" class="form-control" id="password" @blur="v$.form.password.$touch" />
            <div v-if="v$.form.password.$dirty && v$.form.password.$error" class="text-danger">
              {{ v$.form.password.$errors[0].$message }}
            </div>
          </div>
          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-primary">Đăng ký</button>
            <router-link to="/login" class="btn btn-link">Đăng nhập</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
      },
    };
  },
  validations() {
    return {
      form: {
        username: { required },
        email: { required, email },
        password: { required, minLength: minLength(6) },
      },
    };
  },
  methods: {
    async handleRegister() {
      const isValid = await this.v$.$validate();
      if (!isValid) return;

      const authStore = useAuthStore();
      try {
        await authStore.register(this.form.username, this.form.password, this.form.email);
        useToast().success('Đăng ký thành công');
        this.$router.push('/');
      } catch (error) {
        // Lỗi đã được xử lý trong store
      }
    },
  },
};
</script>

<style scoped>
.page {
  max-width: 400px;
  margin: 0 auto;
  padding-top: 50px;
}
.card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.card-header {
  border-radius: 10px 10px 0 0;
}
</style>