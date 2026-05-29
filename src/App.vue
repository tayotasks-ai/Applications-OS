<template>
  <div>
    <!-- Floating Premium SuperAdmin Impersonation Banner -->
    <div
      v-if="isImpersonating"
      class="bg-brand-950/90 border-b border-brand-500/30 px-4 py-2.5 text-center text-xs font-bold text-brand-200 backdrop-blur-md flex items-center justify-center space-x-3.5 relative z-50 sticky top-0 shadow shadow-brand-500/10 font-sans"
    >
      <span class="flex items-center gap-1.5 text-brand-400">
        <span class="w-2 h-2 rounded-full bg-brand-400 animate-ping"></span>
        SuperAdmin Session Active
      </span>
      <span>Impersonating <strong>{{ authStore.user?.name }}</strong> (Admin of {{ authStore.user?.tenant?.organizationName }})</span>
      <button
        @click="returnToRoot"
        class="px-3.5 py-1 rounded bg-brand-600 hover:bg-brand-500 text-white font-extrabold uppercase transition text-[10px]"
      >
        Return to Root Console
      </button>
    </div>

    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const isImpersonating = computed(() => {
  return !!localStorage.getItem('root_token');
});

const returnToRoot = () => {
  const rootToken = localStorage.getItem('root_token');
  const rootUser = localStorage.getItem('root_user');
  
  if (rootToken && rootUser) {
    // Restore Root credentials
    localStorage.setItem('token', rootToken);
    localStorage.setItem('user', rootUser);
    
    // Clear impersonation cache
    localStorage.removeItem('root_token');
    localStorage.removeItem('root_user');
    
    // Reactive sync
    authStore.token = rootToken;
    authStore.user = JSON.parse(rootUser);
    
    // Redirect back to Root Dashboard
    router.push('/root/dashboard');
  }
};
</script>
