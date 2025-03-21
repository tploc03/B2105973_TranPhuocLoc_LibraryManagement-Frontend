// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Định nghĩa các route
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/SachList.vue'), // Trang chủ mặc định là SachList
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue'),
  },
  {
    path: '/sachs',
    name: 'sach-list',
    component: () => import('../views/SachList.vue'),
  },
  {
    path: '/sachs/add',
    name: 'sach-add',
    component: () => import('../views/SachForm.vue'),
  },
  {
    path: '/sachs/edit/:id',
    name: 'sach-edit',
    component: () => import('../views/SachForm.vue'),
  },
  {
    path: '/docgias',
    name: 'docgia-list',
    component: () => import('../views/DocgiaList.vue'),
  },
  {
    path: '/docgias/add',
    name: 'docgia-add',
    component: () => import('../views/DocgiaForm.vue'),
  },
  {
    path: '/docgias/edit/:id',
    name: 'docgia-edit',
    component: () => import('../views/DocgiaForm.vue'),
  },
  {
    path: '/nhanviens',
    name: 'nhanvien-list',
    component: () => import('../views/NhanvienList.vue'),
  },
  {
    path: '/nhanviens/add',
    name: 'nhanvien-add',
    component: () => import('../views/NhanvienForm.vue'),
  },
  {
    path: '/nhanviens/edit/:id',
    name: 'nhanvien-edit',
    component: () => import('../views/NhanvienForm.vue'),
  },
  {
    path: '/nhaxuatbans',
    name: 'nhaxuatban-list',
    component: () => import('../views/NhaxuatbanList.vue'),
  },
  {
    path: '/nhaxuatbans/add',
    name: 'nhaxuatban-add',
    component: () => import('../views/NhaxuatbanForm.vue'),
  },
  {
    path: '/nhaxuatbans/edit/:id',
    name: 'nhaxuatban-edit',
    component: () => import('../views/NhaxuatbanForm.vue'),
  },
  {
    path: '/muonsachs',
    name: 'muonsach-list',
    component: () => import('../views/MuonsachList.vue'),
  },
  {
    path: '/muonsachs/add',
    name: 'muonsach-add',
    component: () => import('../views/MuonsachForm.vue'),
  },
  {
    path: '/muonsachs/edit/:id',
    name: 'muonsach-edit',
    component: () => import('../views/MuonsachForm.vue'),
  },
  { 
    path: '/:pathMatch(.*)*', 
    name: 'not-found', 
    component: () => import('../views/NotFound.vue') 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const publicPages = ['/login', '/register']; // Các trang công khai
  const isPublicPage = publicPages.includes(to.path);

  if (!authStore.isAuthenticated && !isPublicPage) {
    // Nếu chưa đăng nhập và không phải trang công khai, chuyển về login
    next('/login');
  } else if (authStore.isAuthenticated && isPublicPage) {
    // Nếu đã đăng nhập và cố vào login/register, chuyển về trang chủ
    next('/');
  } else {
    next(); // Tiếp tục bình thường
  }
});

export default router;