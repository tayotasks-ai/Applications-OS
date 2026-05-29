<template>
  <div class="min-h-screen pb-12 bg-[#080c14] text-slate-100 font-sans">
    <!-- Navbar Header -->
    <header class="glass-panel border-b border-gray-800 sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <svg class="h-6 w-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span class="text-xl font-bold text-white tracking-wider">Agency OS SuperAdmin Console</span>
        </div>
        <div class="flex items-center space-x-4">
          <div class="text-right hidden sm:block">
            <div class="text-sm font-semibold text-white">{{ authStore.user?.name }}</div>
            <div class="text-xs text-brand-400 capitalize">System Root Manager</div>
          </div>
          <button
            @click="handleLogout"
            class="px-3.5 py-1.5 rounded-lg border border-gray-700 hover:border-red-500 hover:text-red-400 transition text-sm text-gray-400 font-medium font-sans"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
      <!-- Title -->
      <div>
        <h1 class="text-3xl font-extrabold text-white">Global Organizations Registry</h1>
        <p class="text-gray-400 mt-1">SuperAdmin overview monitoring of all tenant organizations and admin impersonations.</p>
      </div>

      <!-- Quick Metrics Dashboard -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="glass-panel p-5 rounded-2xl border border-gray-800">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Customer Tenants</p>
          <h3 class="text-2xl font-black text-white mt-1">{{ organizations.length }}</h3>
        </div>
        <div class="glass-panel p-5 rounded-2xl border border-gray-800">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Growth Plans</p>
          <h3 class="text-2xl font-black text-brand-400 mt-1">{{ getPlanCount('Growth') }}</h3>
        </div>
        <div class="glass-panel p-5 rounded-2xl border border-gray-800">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Enterprise Plans</p>
          <h3 class="text-2xl font-black text-purple-400 mt-1">{{ getPlanCount('Enterprise') }}</h3>
        </div>
        <div class="glass-panel p-5 rounded-2xl border border-gray-800">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Active Seats</p>
          <h3 class="text-2xl font-black text-green-400 mt-1">{{ getTotalSeats() }}</h3>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-40 space-y-4">
        <span class="animate-spin h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full"></span>
        <span class="text-gray-400 text-sm">Accessing root data vault...</span>
      </div>

      <!-- Tenant Directory Cards Grid -->
      <div class="grid grid-cols-1 gap-6" v-else>
        <div
          v-for="org in organizations"
          :key="org._id"
          class="glass-panel p-6 rounded-2xl border border-gray-800 relative overflow-hidden bg-slate-900/20 space-y-6"
        >
          <!-- Accent glow -->
          <div class="absolute -top-12 -right-12 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl"></div>

          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-gray-800/60 pb-5">
            <div>
              <div class="flex items-center space-x-3">
                <h3 class="font-extrabold text-white text-xl">{{ org.organizationName }}</h3>
                <span
                  class="px-2.5 py-0.5 rounded-full text-xs font-bold border"
                  :class="getPlanBadgeClass(org.planTier)"
                >
                  {{ org.planTier }}
                </span>
                <span
                  class="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 border border-green-500/20 text-green-300 capitalize"
                >
                  {{ org.subscriptionStatus }}
                </span>
              </div>
              <p class="text-xs text-gray-400 mt-1">Tenant ID: <span class="font-mono text-[10px]">{{ org._id }}</span></p>
            </div>

            <!-- Stats breakdown columns -->
            <div class="grid grid-cols-3 gap-6 text-sm shrink-0">
              <div>
                <div class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Seats Assigned</div>
                <div class="text-white font-bold mt-1">{{ org.currentSeatCount }} / {{ org.planTier === 'Free' ? 1 : org.planTier === 'Growth' ? 50 : 'Unlimited' }}</div>
              </div>
              <div>
                <div class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Active Leads</div>
                <div class="text-white font-bold mt-1">{{ org.currentApplicantCount }}</div>
              </div>
              <div>
                <div class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Storage Capacity</div>
                <div class="text-white font-bold mt-1">{{ org.storageUsedGB.toFixed(3) }} GB</div>
              </div>
            </div>
          </div>

          <!-- Administrators & Impersonation action list -->
          <div class="space-y-3">
            <h4 class="text-xs font-black text-gray-400 uppercase tracking-widest">Organization Administrators</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="admin in org.admins"
                :key="admin._id"
                class="glass-card p-4 rounded-xl border border-gray-800 flex items-center justify-between gap-4 bg-slate-900/35"
              >
                <div class="truncate">
                  <div class="font-bold text-white text-sm truncate">{{ admin.name }}</div>
                  <div class="text-xs text-gray-400 mt-0.5 truncate">{{ admin.email }}</div>
                </div>
                <button
                  @click="impersonateAdmin(admin)"
                  class="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-lg transition shrink-0 flex items-center gap-1.5 shadow shadow-brand-500/10 font-sans"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Impersonate</span>
                </button>
              </div>

              <div v-if="org.admins.length === 0" class="col-span-2 text-center py-4 text-gray-500 italic text-xs">
                No active Admin account was provisioned for this organization.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Floating Toast Notification System -->
    <transition name="toast-fade">
      <div
        v-if="toast.show"
        class="fixed top-6 right-6 z-50 flex items-center space-x-3 px-5 py-4 rounded-xl backdrop-blur-md border shadow-2xl transition-all duration-300 max-w-md"
        :class="toast.type === 'success' ? 'bg-slate-900/90 border-emerald-500/30 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'bg-slate-900/90 border-red-500/30 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.15)]'"
      >
        <span class="shrink-0">
          <svg v-if="toast.type === 'success'" class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </span>
        <span class="text-sm font-semibold pr-4 leading-snug">{{ toast.message }}</span>
        <button
          @click="toast.show = false"
          class="text-gray-400 hover:text-white transition text-base font-bold select-none shrink-0"
        >
          &times;
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const organizations = ref([]);

const toast = ref({
  show: false,
  message: '',
  type: 'success'
});
let toastTimeout = null;

const triggerToast = (message, type = 'success') => {
  if (toastTimeout) clearTimeout(toastTimeout);
  toast.value.message = message;
  toast.value.type = type;
  toast.value.show = true;
  toastTimeout = setTimeout(() => {
    toast.value.show = false;
  }, 4000);
};

const API_URL = 'https://applications-backend-zpxu.onrender.com/api';

const loadOrganizations = async () => {
  loading.value = true;
  try {
    const response = await fetch(`${API_URL}/root/organizations`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });

    if (response.ok) {
      organizations.value = await response.json();
    } else {
      triggerToast('Failed to load organizations.', 'error');
    }
  } catch (err) {
    console.error('Error fetching orgs:', err);
    triggerToast('Network error loading organizations.', 'error');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // Guard route for Root only
  if (authStore.user?.role !== 'Root') {
    router.push('/login');
    return;
  }
  loadOrganizations();
});

const getPlanCount = (planTier) => {
  return organizations.value.filter(org => org.planTier === planTier).length;
};

const getTotalSeats = () => {
  return organizations.value.reduce((acc, org) => acc + org.currentSeatCount, 0);
};

const getPlanBadgeClass = (planTier) => {
  switch (planTier) {
    case 'Free': return 'bg-gray-500/10 border-gray-500/20 text-gray-300';
    case 'Growth': return 'bg-brand-500/10 border-brand-500/20 text-brand-300';
    case 'Enterprise': return 'bg-purple-500/10 border-purple-500/20 text-purple-300';
    default: return 'bg-gray-500/10 border-gray-500/20 text-gray-300';
  }
};

const impersonateAdmin = async (adminUser) => {
  try {
    const response = await fetch(`${API_URL}/root/impersonate/${adminUser._id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Impersonation request failed.');
    }

    // Cache original root credentials inside distinct storage keys
    localStorage.setItem('root_token', authStore.token);
    localStorage.setItem('root_user', JSON.stringify(authStore.user));

    // Overwrite auth store details with target Admin credentials
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    authStore.token = data.token;
    authStore.user = data.user;

    triggerToast(`Session swapped: Impersonating ${adminUser.name} successfully!`, 'success');

    // Route to Admin counselor console dashboard
    setTimeout(() => {
      router.push('/counselor/dashboard');
    }, 1200);
  } catch (err) {
    triggerToast(err.message, 'error');
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-fade-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
</style>
