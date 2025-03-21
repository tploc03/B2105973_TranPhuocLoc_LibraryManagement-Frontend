import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Các trang hiện có
import UserHome from '@/views/UserHome.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import SachList from '@/views/SachList.vue';
import DocgiaList from '@/views/DocgiaList.vue';
import NhanvienList from '@/views/NhanvienList.vue';
import NhaxuatbanList from '@/views/NhaxuatbanList.vue';
import MuonsachList from '@/views/MuonsachList.vue';
import UserSachList from '@/views/UserSachList.vue';
import UserNhaxuatbanList from '@/views/UserNhaxuatbanList.vue';
import UserMuonsachList from '@/views/UserMuonsachList.vue';

// Các trang thêm mới
import SachAdd from '@/views/SachForm.vue';
import NhanvienAdd from '@/views/NhanvienForm.vue';
import NhaxuatbanAdd from '@/views/NhaxuatbanForm.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  {
    path: '/user/home',
    name: 'user-home',
    component: UserHome,
    meta: { requiresAuth: true, role: 'user' },
  },
  // Route cho sách
  { path: '/sachs', name: 'sach-list', component: SachList, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/sachs/add', name: 'sach-add', component: SachAdd, meta: { requiresAuth: true, role: 'admin' } }, // Thêm sách
  { path: '/docgias', name: 'docgia-list', component: DocgiaList, meta: { requiresAuth: true, role: 'admin' } },
  // Route cho nhân viên
  { path: '/nhanviens', name: 'nhanvien-list', component: NhanvienList, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/nhanviens/add', name: 'nhanvien-add', component: NhanvienAdd, meta: { requiresAuth: true, role: 'admin' } }, // Thêm nhân viên
  // Route cho nhà xuất bản
  { path: '/nhaxuatbans', name: 'nhaxuatban-list', component: NhaxuatbanList, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/nhaxuatbans/add', name: 'nhaxuatban-add', component: NhaxuatbanAdd, meta: { requiresAuth: true, role: 'admin' } }, // Thêm nhà xuất bản
  { path: '/muonsachs', name: 'muonsach-list', component: MuonsachList, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/user/sachs', name: 'user-sach-list', component: UserSachList, meta: { requiresAuth: true, role: 'user' } },
  { path: '/user/nhaxuatbans', name: 'user-nhaxuatban-list', component: UserNhaxuatbanList, meta: { requiresAuth: true, role: 'user' } },
  { path: '/user/muonsachs', name: 'user-muonsach-list', component: UserMuonsachList, meta: { requiresAuth: true, role: 'user' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiredRole = to.matched.some(record => record.meta.role);

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (requiredRole && authStore.user?.role !== to.meta.role) {
    if (authStore.user?.role === 'admin') {
      next('/sachs');
    } else {
      next('/user/home');
    }
  } else {
    next();
  }
});

export default router;