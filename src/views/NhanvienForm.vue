<template>
  <div class="page">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h1 class="mb-0">{{ isEdit ? 'Sửa Nhân viên' : 'Thêm Nhân viên' }}</h1>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="MSNV" class="form-label">Mã nhân viên</label>
            <input v-model="nhanvien.MSNV" type="text" class="form-control" id="MSNV" :disabled="isEdit" placeholder="Nhập mã nhân viên (VD: NV001)" @blur="v$.nhanvien.MSNV.$touch" />
            <div v-if="v$.nhanvien.MSNV.$dirty && v$.nhanvien.MSNV.$error" class="text-danger">
              {{ v$.nhanvien.MSNV.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="HOTENNV" class="form-label">Họ tên</label>
            <input v-model="nhanvien.HOTENNV" type="text" class="form-control" id="HOTENNV" placeholder="Nhập họ tên" @blur="v$.nhanvien.HOTENNV.$touch" />
            <div v-if="v$.nhanvien.HOTENNV.$dirty && v$.nhanvien.HOTENNV.$error" class="text-danger">
              {{ v$.nhanvien.HOTENNV.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="PASSWORD" class="form-label">Mật khẩu</label>
            <input v-model="nhanvien.PASSWORD" type="password" class="form-control" id="PASSWORD" placeholder="Nhập mật khẩu" @blur="v$.nhanvien.PASSWORD.$touch" />
            <div v-if="v$.nhanvien.PASSWORD.$dirty && v$.nhanvien.PASSWORD.$error" class="text-danger">
              {{ v$.nhanvien.PASSWORD.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="CHUCVU" class="form-label">Chức vụ</label>
            <input v-model="nhanvien.CHUCVU" type="text" class="form-control" id="CHUCVU" placeholder="Nhập chức vụ" @blur="v$.nhanvien.CHUCVU.$touch" />
            <div v-if="v$.nhanvien.CHUCVU.$dirty && v$.nhanvien.CHUCVU.$error" class="text-danger">
              {{ v$.nhanvien.CHUCVU.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="DIACHI" class="form-label">Địa chỉ</label>
            <input v-model="nhanvien.DIACHI" type="text" class="form-control" id="DIACHI" placeholder="Nhập địa chỉ" @blur="v$.nhanvien.DIACHI.$touch" />
            <div v-if="v$.nhanvien.DIACHI.$dirty && v$.nhanvien.DIACHI.$error" class="text-danger">
              {{ v$.nhanvien.DIACHI.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="SODIENTHOAI" class="form-label">Số điện thoại</label>
            <input v-model="nhanvien.SODIENTHOAI" type="text" class="form-control" id="SODIENTHOAI" placeholder="Nhập số điện thoại (VD: 0912345678)" @blur="v$.nhanvien.SODIENTHOAI.$touch" />
            <div v-if="v$.nhanvien.SODIENTHOAI.$dirty && v$.nhanvien.SODIENTHOAI.$error" class="text-danger">
              {{ v$.nhanvien.SODIENTHOAI.$errors[0].$message }}
            </div>
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button type="submit" class="btn btn-primary btn-lg">Lưu</button>
            <router-link to="/nhanviens" class="btn btn-outline-secondary btn-lg">Hủy</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import NhanvienService from '@/services/nhanvien.service';
import { useToast } from 'vue-toastification';

const alphaNum = helpers.regex(/^[a-zA-Z0-9]+$/);
const phoneVN = helpers.regex(/^(0[3|5|7|8|9])+([0-9]{8})$/);

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      nhanvien: {
        MSNV: '',
        HOTENNV: '',
        PASSWORD: '',
        CHUCVU: '',
        DIACHI: '',
        SODIENTHOAI: '',
      },
      isEdit: false,
    };
  },
  validations() {
    return {
      nhanvien: {
        MSNV: { required, alphaNum },
        HOTENNV: { required },
        PASSWORD: { required },
        CHUCVU: { required },
        DIACHI: { required },
        SODIENTHOAI: { required, phoneVN },
      },
    };
  },
  methods: {
    async handleSubmit() {
      const isValid = await this.v$.$validate();
      if (!isValid) return;

      try {
        if (this.isEdit) {
          await NhanvienService.update(this.nhanvien.MSNV, this.nhanvien);
          useToast().success('Cập nhật nhân viên thành công');
        } else {
          await NhanvienService.create(this.nhanvien);
          useToast().success('Thêm nhân viên thành công');
        }
        this.$router.push('/nhanviens');
      } catch (error) {
        console.error(error);
        useToast().error('Lưu nhân viên thất bại');
      }
    },
    async loadNhanvien() {
      if (this.$route.params.id) {
        this.isEdit = true;
        try {
          const data = await NhanvienService.get(this.$route.params.id);
          this.nhanvien = { ...data, PASSWORD: '' };
        } catch (error) {
          console.error(error);
          useToast().error('Không thể tải thông tin nhân viên');
        }
      }
    },
  },
  mounted() {
    this.loadNhanvien();
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