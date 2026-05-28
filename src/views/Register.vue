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
        <h2 class="text-3xl font-extrabold tracking-tight text-white">Create Your Agency</h2>
        <p class="mt-2 text-sm text-gray-400">Launch your Educational Travel CRM in seconds</p>
      </div>

      <form class="mt-8 space-y-6 relative" @submit.prevent="handleRegister">
        <div v-if="error" class="p-4 rounded-lg bg-red-900/30 border border-red-500/40 text-red-200 text-sm">
          {{ error }}
        </div>

        <div class="rounded-md space-y-4">
          <div>
            <label for="organization-name" class="block text-sm font-medium text-gray-300 mb-1">Agency / Organization Name</label>
            <input
              id="organization-name"
              name="organizationName"
              type="text"
              required
              v-model="organizationName"
              class="glass-input block w-full px-4 py-3 rounded-lg text-sm sm:text-base border"
              placeholder="e.g. Apex Travel Consult"
            />
          </div>
          <div>
            <label for="admin-name" class="block text-sm font-medium text-gray-300 mb-1">Administrator Full Name</label>
            <input
              id="admin-name"
              name="name"
              type="text"
              required
              v-model="name"
              class="glass-input block w-full px-4 py-3 rounded-lg text-sm sm:text-base border"
              placeholder="e.g. Sarah Connor"
            />
          </div>
          <div>
            <label for="email-address" class="block text-sm font-medium text-gray-300 mb-1">Admin Email Address</label>
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
            Register & Start Free Trial
          </button>
        </div>
      </form>

      <!-- Invitation link for existing users -->
      <div class="mt-6 pt-4 border-t border-gray-800 text-center">
        <p class="text-xs text-gray-400">
          Already have an agency registered?
          <router-link to="/login" class="text-brand-400 hover:text-brand-300 font-semibold transition ml-1">
            Sign in here
          </router-link>
        </p>
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

const organizationName = ref('');
const name = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleRegister = async () => {
  if (!organizationName.value || !name.value || !email.value || !password.value) {
    error.value = 'All fields are required.';
    return;
  }

  loading.value = true;
  error.value = '';

  const success = await authStore.registerAgency(
    organizationName.value,
    name.value,
    email.value,
    password.value
  );

  if (success) {
    router.push('/counselor/dashboard'); // default fallback for admin
  } else {
    error.value = authStore.error || 'Failed to register your agency.';
    loading.value = false;
  }
};
</script>
