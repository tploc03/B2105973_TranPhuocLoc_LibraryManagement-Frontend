<template>
  <div class="page">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h1 class="mb-0">{{ isEdit ? 'Sửa Độc giả' : 'Thêm Độc giả' }}</h1>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="MADOCGIA" class="form-label">Mã độc giả</label>
            <input v-model="docgia.MADOCGIA" type="text" class="form-control" id="MADOCGIA" :disabled="isEdit" placeholder="Nhập mã độc giả (VD: DG001)" @blur="v$.docgia.MADOCGIA.$touch" />
            <div v-if="v$.docgia.MADOCGIA.$dirty && v$.docgia.MADOCGIA.$error" class="text-danger">
              {{ v$.docgia.MADOCGIA.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="HOLOT" class="form-label">Họ lót</label>
            <input v-model="docgia.HOLOT" type="text" class="form-control" id="HOLOT" placeholder="Nhập họ lót" @blur="v$.docgia.HOLOT.$touch" />
            <div v-if="v$.docgia.HOLOT.$dirty && v$.docgia.HOLOT.$error" class="text-danger">
              {{ v$.docgia.HOLOT.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="TEN" class="form-label">Tên</label>
            <input v-model="docgia.TEN" type="text" class="form-control" id="TEN" placeholder="Nhập tên" @blur="v$.docgia.TEN.$touch" />
            <div v-if="v$.docgia.TEN.$dirty && v$.docgia.TEN.$error" class="text-danger">
              {{ v$.docgia.TEN.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="NGAYSINH" class="form-label">Ngày sinh</label>
            <input v-model="docgia.NGAYSINH" type="date" class="form-control" id="NGAYSINH" placeholder="Chọn ngày sinh" @blur="v$.docgia.NGAYSINH.$touch" />
            <div v-if="v$.docgia.NGAYSINH.$dirty && v$.docgia.NGAYSINH.$error" class="text-danger">
              {{ v$.docgia.NGAYSINH.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="PHAI" class="form-label">Phái</label>
            <select v-model="docgia.PHAI" class="form-control" id="PHAI" @blur="v$.docgia.PHAI.$touch">
              <option value="" disabled>Chọn phái</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
            <div v-if="v$.docgia.PHAI.$dirty && v$.docgia.PHAI.$error" class="text-danger">
              {{ v$.docgia.PHAI.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="DIACHI" class="form-label">Địa chỉ</label>
            <input v-model="docgia.DIACHI" type="text" class="form-control" id="DIACHI" placeholder="Nhập địa chỉ" @blur="v$.docgia.DIACHI.$touch" />
            <div v-if="v$.docgia.DIACHI.$dirty && v$.docgia.DIACHI.$error" class="text-danger">
              {{ v$.docgia.DIACHI.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="DIENTHOAI" class="form-label">Số điện thoại</label>
            <input v-model="docgia.DIENTHOAI" type="text" class="form-control" id="DIENTHOAI" placeholder="Nhập số điện thoại (VD: 0912345678)" @blur="v$.docgia.DIENTHOAI.$touch" />
            <div v-if="v$.docgia.DIENTHOAI.$dirty && v$.docgia.DIENTHOAI.$error" class="text-danger">
              {{ v$.docgia.DIENTHOAI.$errors[0].$message }}
            </div>
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button type="submit" class="btn btn-primary btn-lg">Lưu</button>
            <router-link to="/docgias" class="btn btn-outline-secondary btn-lg">Hủy</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import DocgiaService from '@/services/docgia.service';
import { useToast } from 'vue-toastification';
import dayjs from 'dayjs';

const alphaNum = helpers.regex(/^[a-zA-Z0-9]+$/);
const phoneVN = helpers.regex(/^(0[3|5|7|8|9])+([0-9]{8})$/);

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      docgia: {
        MADOCGIA: '',
        HOLOT: '',
        TEN: '',
        NGAYSINH: '',
        PHAI: '',
        DIACHI: '',
        DIENTHOAI: '',
      },
      isEdit: false,
    };
  },
  validations() {
    return {
      docgia: {
        MADOCGIA: { required, alphaNum },
        HOLOT: { required },
        TEN: { required },
        NGAYSINH: { required },
        PHAI: { required },
        DIACHI: { required },
        DIENTHOAI: { required, phoneVN },
      },
    };
  },
  methods: {
    async handleSubmit() {
      const isValid = await this.v$.$validate();
      if (!isValid) return;

      try {
        if (this.isEdit) {
          await DocgiaService.update(this.docgia.MADOCGIA, this.docgia);
          useToast().success('Cập nhật độc giả thành công');
        } else {
          await DocgiaService.create(this.docgia);
          useToast().success('Thêm độc giả thành công');
        }
        this.$router.push('/docgias');
      } catch (error) {
        console.error(error);
        useToast().error('Lưu độc giả thất bại');
      }
    },
    async loadDocgia() {
      if (this.$route.params.id) {
        this.isEdit = true;
        try {
          const data = await DocgiaService.get(this.$route.params.id);
          this.docgia = {
            ...data,
            NGAYSINH: dayjs(data.NGAYSINH).format('YYYY-MM-DD'),
          };
        } catch (error) {
          console.error(error);
          useToast().error('Không thể tải thông tin độc giả');
        }
      }
    },
  },
  mounted() {
    this.loadDocgia();
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