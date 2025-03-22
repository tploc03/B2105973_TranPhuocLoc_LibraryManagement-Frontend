<!-- src/App.vue -->
<template>
  <div id="app">
    <AppHeader v-if="authStore.isAuthenticated" />
    <div class="main-content" :class="{ 'with-navbar': authStore.isAuthenticated }">
      <router-view />
    </div>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue';
import { useAuthStore } from '@/stores/auth';

export default {
  components: { AppHeader },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  mounted() {
    this.authStore.loadUserFromToken();
  },
};
</script>

<style>
#app { font-family: 'Arial', sans-serif; }
.main-content { padding: 20px; }
.with-navbar { padding-top: 80px; }
</style>
