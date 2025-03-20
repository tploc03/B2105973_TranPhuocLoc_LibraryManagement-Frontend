<!-- src/App.vue -->
<template>
  <div id="app">
    <Navbar v-if="authStore.isAuthenticated" />
    <div class="main-content" :class="{ 'with-navbar': authStore.isAuthenticated }">
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import { useAuthStore } from '@/stores/auth';

export default {
  components: {
    Navbar,
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
};
</script>

<style>
#app {
  font-family: 'Arial', sans-serif;
}
.main-content {
  padding: 20px;
}
.with-navbar {
  padding-top: 80px; /* Khoảng cách để tránh Navbar che nội dung */
}
</style>