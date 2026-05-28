<template>
  <div class="min-height-viewport flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8 glass-panel p-8 rounded-2xl shadow-2xl relative overflow-hidden">
      <!-- Glow decoration -->
      <div class="absolute -top-10 -right-10 w-40 h-40 bg-brand-500 rounded-full blur-3xl opacity-20 animate-glow"></div>
      <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-600 rounded-full blur-3xl opacity-10 animate-glow"></div>

      <div class="relative text-center">
        <div class="inline-flex items-center justify-center p-3 bg-brand-600/20 rounded-xl border border-brand-500/20 mb-3">
          <svg class="h-8 w-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        <h2 class="text-3xl font-extrabold tracking-tight text-white">Agency Management OS</h2>
        <p class="mt-2 text-sm text-gray-400">Unified Portal for Educational Travel Agencies</p>
      </div>

      <form class="mt-8 space-y-6 relative" @submit.prevent="handleLogin">
        <div v-if="error" class="p-4 rounded-lg bg-red-900/30 border border-red-500/40 text-red-200 text-sm">
          {{ error }}
        </div>

        <div class="rounded-md space-y-4">
          <div>
            <label for="email-address" class="block text-sm font-medium text-gray-300 mb-1">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="email"
              class="glass-input block w-full px-4 py-3 rounded-lg text-sm sm:text-base border"
              placeholder="you@agency.com"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              v-model="password"
              class="glass-input block w-full px-4 py-3 rounded-lg text-sm sm:text-base border"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-brand-600 hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition duration-150 disabled:opacity-50"
          >
            <span v-if="loading" class="inline-block animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            Sign in
          </button>
        </div>
      </form>

      <!-- Testing Seeds Panel -->
      <div class="mt-8 pt-6 border-t border-gray-800 text-left">
        <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Demo Logins (Click to autofill)</h4>
        <div class="space-y-2 text-xs">
          <button
            @click="quickFill('counselor@agency.com')"
            class="w-full flex items-center justify-between p-2.5 rounded-lg bg-gray-800/40 hover:bg-brand-600/10 border border-gray-700/50 hover:border-brand-500/30 transition text-gray-300"
          >
            <span>Sarah (Counselor)</span>
            <span class="text-brand-400 font-mono">counselor@agency.com</span>
          </button>
          <button
            @click="quickFill('officer@agency.com')"
            class="w-full flex items-center justify-between p-2.5 rounded-lg bg-gray-800/40 hover:bg-brand-600/10 border border-gray-700/50 hover:border-brand-500/30 transition text-gray-300"
          >
            <span>Alex (App Officer)</span>
            <span class="text-brand-400 font-mono">officer@agency.com</span>
          </button>
          <button
            @click="quickFill('admin@agency.com')"
            class="w-full flex items-center justify-between p-2.5 rounded-lg bg-gray-800/40 hover:bg-brand-600/10 border border-gray-700/50 hover:border-brand-500/30 transition text-gray-300"
          >
            <span>John (Admin)</span>
            <span class="text-brand-400 font-mono">admin@agency.com</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  
  const success = await authStore.login(email.value, password.value);
  if (success) {
    if (authStore.isCounselor) {
      router.push('/counselor/dashboard');
    } else if (authStore.isOfficer) {
      router.push('/officer/pipeline');
    } else {
      router.push('/counselor/dashboard'); // default fallback
    }
  } else {
    error.value = authStore.error || 'Failed to authenticate.';
    loading.value = false;
  }
};

const quickFill = (demoEmail) => {
  email.value = demoEmail;
  password.value = 'password123';
};
</script>
