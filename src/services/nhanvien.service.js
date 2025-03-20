// library-frontend\src\services\nhanvien.service.js

import createApiClient from './api.service';

class NhanvienService {
  constructor(baseUrl = '/api/nhanviens') {
    this.api = createApiClient(baseUrl);
  }
  async getAll() {
    return (await this.api.get('/')).data;
  }
  async create(data) {
    return (await this.api.post('/', data)).data;
  }
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
}

export default new NhanvienService();