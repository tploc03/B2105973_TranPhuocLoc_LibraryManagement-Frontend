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
          <div class="mb-3">
            <label for="hoLot" class="form-label">Họ lót</label>
            <input v-model="form.hoLot" type="text" class="form-control" id="hoLot" @blur="v$.form.hoLot.$touch" />
            <div v-if="v$.form.hoLot.$dirty && v$.form.hoLot.$error" class="text-danger">
              {{ v$.form.hoLot.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="ten" class="form-label">Tên</label>
            <input v-model="form.ten" type="text" class="form-control" id="ten" @blur="v$.form.ten.$touch" />
            <div v-if="v$.form.ten.$dirty && v$.form.ten.$error" class="text-danger">
              {{ v$.form.ten.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="ngaySinh" class="form-label">Ngày sinh</label>
            <input v-model="form.ngaySinh" type="date" class="form-control" id="ngaySinh" @blur="v$.form.ngaySinh.$touch" />
            <div v-if="v$.form.ngaySinh.$dirty && v$.form.ngaySinh.$error" class="text-danger">
              {{ v$.form.ngaySinh.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="phai" class="form-label">Phái</label>
            <select v-model="form.phai" class="form-control" id="phai" @blur="v$.form.phai.$touch">
              <option value="" disabled>Chọn phái</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
            <div v-if="v$.form.phai.$dirty && v$.form.phai.$error" class="text-danger">
              {{ v$.form.phai.$errors[0].$message }}
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
            <label for="dienThoai" class="form-label">Số điện thoại</label>
            <input v-model="form.dienThoai" type="text" class="form-control" id="dienThoai" @blur="v$.form.dienThoai.$touch" />
            <div v-if="v$.form.dienThoai.$dirty && v$.form.dienThoai.$error" class="text-danger">
              {{ v$.form.dienThoai.$errors[0].$message || 'Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số (ví dụ: 0912345678)' }}
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
import { required, email, minLength, helpers } from '@vuelidate/validators';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';

const phoneVN = helpers.regex(/^0[0-9]{9}$/);

export default {
  setup() { return { v$: useVuelidate() }; },
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
        hoLot: '',
        ten: '',
        ngaySinh: '',
        phai: '',
        diaChi: '',
        dienThoai: '',
      },
    };
  },
  validations() {
    return {
      form: {
        username: { required },
        email: { required, email },
        password: { required, minLength: minLength(6) },
        hoLot: { required },
        ten: { required },
        ngaySinh: { required },
        phai: { required },
        diaChi: { required },
        dienThoai: { required, phoneVN },
      },
    };
  },
  methods: {
    async handleRegister() {
      const isValid = await this.v$.$validate();
      if (!isValid) {
        useToast().error('Vui lòng kiểm tra lại thông tin nhập');
        return;
      }

      const authStore = useAuthStore();
      try {
        await authStore.register(
          this.form.username,
          this.form.password,
          this.form.email,
          this.form.hoLot,
          this.form.ten,
          this.form.ngaySinh,
          this.form.phai,
          this.form.diaChi,
          this.form.dienThoai
        );
        useToast().success('Đăng ký thành công');
        this.$router.push('/user/home'); // Chuyển hướng đến trang chủ
      } catch (error) {
        console.error('Lỗi đăng ký:', error);
        let errorMessage = 'Đăng ký thất bại';
        if (error.response && error.response.data) {
          if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data.errors) {
            errorMessage = error.response.data.errors.map(err => err.msg).join(', ');
          }
        }
        useToast().error(errorMessage);
      }
    },
  },
};
</script>

<style scoped>
.page { max-width: 600px; margin: 0 auto; padding-top: 50px; }
.card { border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
.card-header { border-radius: 10px 10px 0 0; }
</style>