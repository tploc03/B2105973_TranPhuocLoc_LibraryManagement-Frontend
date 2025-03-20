<template>
  <div class="page">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h1 class="mb-0">{{ isEdit ? 'Sửa Nhà xuất bản' : 'Thêm Nhà xuất bản' }}</h1>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="MANXB" class="form-label">Mã nhà xuất bản</label>
            <input v-model="nhaxuatban.MANXB" type="text" class="form-control" id="MANXB" :disabled="isEdit" placeholder="Nhập mã nhà xuất bản (VD: NXB001)" @blur="v$.nhaxuatban.MANXB.$touch" />
            <div v-if="v$.nhaxuatban.MANXB.$dirty && v$.nhaxuatban.MANXB.$error" class="text-danger">
              {{ v$.nhaxuatban.MANXB.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="TENNXB" class="form-label">Tên nhà xuất bản</label>
            <input v-model="nhaxuatban.TENNXB" type="text" class="form-control" id="TENNXB" placeholder="Nhập tên nhà xuất bản" @blur="v$.nhaxuatban.TENNXB.$touch" />
            <div v-if="v$.nhaxuatban.TENNXB.$dirty && v$.nhaxuatban.TENNXB.$error" class="text-danger">
              {{ v$.nhaxuatban.TENNXB.$errors[0].$message }}
            </div>
          </div>
          <div class="mb-3">
            <label for="DIACHI" class="form-label">Địa chỉ</label>
            <input v-model="nhaxuatban.DIACHI" type="text" class="form-control" id="DIACHI" placeholder="Nhập địa chỉ" @blur="v$.nhaxuatban.DIACHI.$touch" />
            <div v-if="v$.nhaxuatban.DIACHI.$dirty && v$.nhaxuatban.DIACHI.$error" class="text-danger">
              {{ v$.nhaxuatban.DIACHI.$errors[0].$message }}
            </div>
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button type="submit" class="btn btn-primary btn-lg">Lưu</button>
            <router-link to="/nhaxuatbans" class="btn btn-outline-secondary btn-lg">Hủy</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import NhaxuatbanService from '@/services/nhaxuatban.service';
import { useToast } from 'vue-toastification';

const alphaNum = helpers.regex(/^[a-zA-Z0-9]+$/);

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      nhaxuatban: {
        MANXB: '',
        TENNXB: '',
        DIACHI: '',
      },
      isEdit: false,
    };
  },
  validations() {
    return {
      nhaxuatban: {
        MANXB: { required, alphaNum },
        TENNXB: { required },
        DIACHI: { required },
      },
    };
  },
  methods: {
    async handleSubmit() {
      const isValid = await this.v$.$validate();
      if (!isValid) return;

      try {
        if (this.isEdit) {
          await NhaxuatbanService.update(this.nhaxuatban.MANXB, this.nhaxuatban);
          useToast().success('Cập nhật nhà xuất bản thành công');
        } else {
          await NhaxuatbanService.create(this.nhaxuatban);
          useToast().success('Thêm nhà xuất bản thành công');
        }
        this.$router.push('/nhaxuatbans');
      } catch (error) {
        console.error(error);
        useToast().error('Lưu nhà xuất bản thất bại');
      }
    },
    async loadNhaxuatban() {
      if (this.$route.params.id) {
        this.isEdit = true;
        try {
          const data = await NhaxuatbanService.get(this.$route.params.id);
          this.nhaxuatban = { ...data };
        } catch (error) {
          console.error(error);
          useToast().error('Không thể tải thông tin nhà xuất bản');
        }
      }
    },
  },
  mounted() {
    this.loadNhaxuatban();
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