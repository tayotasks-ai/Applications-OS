<template>
  <div class="min-h-screen pb-12">
    <!-- Navbar Header -->
    <header class="glass-panel border-b border-gray-800 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <button @click="goBack" class="flex items-center text-gray-400 hover:text-white transition mr-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <span class="text-xl font-bold text-white tracking-wider">Agency Management OS</span>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-sm font-semibold text-white capitalize">{{ authStore.user?.name }}</span>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
      <!-- Title -->
      <div>
        <h1 class="text-3xl font-extrabold text-white">Billing & Subscriptions</h1>
        <p class="text-gray-400 mt-1">Manage your multi-tenant subscription tiers and check-out counselor seat limits.</p>
      </div>

      <!-- Current Subscription Status Panel -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left: Status Details (2 Columns on large) -->
        <div class="lg:col-span-2 glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-between relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-3xl opacity-10"></div>
          
          <div class="space-y-6">
            <h3 class="text-lg font-bold text-white border-b border-gray-800 pb-3">Active Subscription</h3>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Plan</div>
                <div class="text-2xl font-bold text-white mt-1">{{ orgPlan || 'Free Plan' }}</div>
              </div>
              
              <div>
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</div>
                <div class="mt-1">
                  <span
                    class="px-2.5 py-1 text-xs font-bold rounded-full border inline-flex items-center"
                    :class="getStatusClass(orgStatus)"
                  >
                    {{ orgStatus || 'trialing' }}
                  </span>
                </div>
              </div>

              <div>
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Renewal Date</div>
                <div class="text-sm text-gray-300 font-semibold mt-1.5">{{ formatDate(orgPeriodEnd) }}</div>
              </div>

              <div>
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Counselor Seats</div>
                <div class="text-sm text-gray-300 font-semibold mt-1.5">{{ activeSeats }} / {{ maxSeats }} active</div>
              </div>
            </div>

            <!-- Visual Seat Capacity Meter -->
            <div class="space-y-2">
              <div class="flex justify-between text-xs text-gray-400">
                <span>Seat Usage Capacity</span>
                <span class="font-bold">{{ seatPercentage }}% utilized</span>
              </div>
              <div class="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  class="h-full bg-brand-500 rounded-full transition-all duration-500"
                  :style="{ width: `${seatPercentage}%` }"
                  :class="seatPercentage >= 90 ? 'bg-red-500' : seatPercentage >= 70 ? 'bg-yellow-500' : 'bg-brand-500'"
                ></div>
              </div>
            </div>
          </div>
          
          <!-- Warning for Inactive status -->
          <div v-if="orgStatus === 'past_due' || orgStatus === 'canceled'" class="p-4 rounded-xl bg-red-950/20 border border-red-500/20 text-red-200 text-xs mt-6 flex items-start">
            <svg class="w-4 h-4 mr-2.5 shrink-0 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <span class="font-bold">Subscription Action Required:</span> Your operational mutation privileges are temporarily locked. Please complete checkout below to reactivate dashboards.
            </div>
          </div>
        </div>

        <!-- Right: Redirection Checkout Drawer (1 Column) -->
        <div class="lg:col-span-1 glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-between bg-gradient-to-b from-gray-900/30 to-brand-950/5">
          <div class="space-y-4">
            <h3 class="text-base font-bold text-white uppercase tracking-wider">Fast Upgrades</h3>
            <p class="text-xs text-gray-400 leading-relaxed">Instantly add seats and unlock advanced global CRM tools. Redirection session routes securely to payment checkout.</p>
            
            <div class="space-y-2.5">
              <div class="flex items-center text-xs text-gray-300">
                <svg class="w-4 h-4 mr-2 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Stripe (International Markets)
              </div>
              <div class="flex items-center text-xs text-gray-300">
                <svg class="w-4 h-4 mr-2 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Paystack / Flutterwave (African Markets)
              </div>
            </div>
          </div>

          <button
            @click="triggerCheckout"
            :disabled="checkoutLoading"
            class="w-full py-3 mt-6 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-sm font-bold shadow-lg transition duration-200 flex items-center justify-center space-x-2"
          >
            <span v-if="checkoutLoading" class="inline-block animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            <span>Subscribe / Renew Now</span>
          </button>
        </div>
      </div>

      <!-- Plan Pricing Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        
        <!-- Free Card -->
        <div class="glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-between h-[380px]" :class="{ 'border-brand-500/40 bg-brand-950/5': orgPlan === 'Free' }">
          <div class="space-y-4">
            <h4 class="text-sm font-bold text-gray-400 uppercase tracking-widest">Free Trial</h4>
            <div class="text-3xl font-extrabold text-white">₦0 <span class="text-xs text-gray-500">/ forever</span></div>
            <p class="text-xs text-gray-400 leading-relaxed">Perfect for solo counselors starting out educational lead intake.</p>
            <ul class="text-xs text-gray-300 space-y-2 pt-2">
              <li class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-brand-400 mr-2"></span> 2 Counselor Seats</li>
              <li class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-brand-400 mr-2"></span> Passport & CV Verification</li>
              <li class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-brand-400 mr-2"></span> Single Pipeline Columns</li>
            </ul>
          </div>
          <button disabled class="w-full py-2.5 text-xs font-bold rounded-lg border border-gray-700 bg-gray-900 text-gray-500 cursor-not-allowed">
            {{ orgPlan === 'Free' ? 'Active Plan' : 'Unavailable' }}
          </button>
        </div>

        <!-- Growth Card -->
        <div class="glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-between h-[380px] relative" :class="{ 'border-brand-500/40 bg-brand-950/5 ring-1 ring-brand-500/30': orgPlan === 'Growth' }">
          <div class="absolute -top-3 right-6 px-3 py-1 rounded-full bg-brand-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow">Best Value</div>
          <div class="space-y-4">
            <h4 class="text-sm font-bold text-brand-400 uppercase tracking-widest">Growth Plan</h4>
            <div class="text-3xl font-extrabold text-white">₦25,000 <span class="text-xs text-gray-500">/ month</span></div>
            <p class="text-xs text-gray-400 leading-relaxed">Designed for small to mid-sized travel agencies expanding enrollment pipelines.</p>
            <ul class="text-xs text-gray-300 space-y-2 pt-2">
              <li class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-brand-400 mr-2"></span> 5 Counselor Seats</li>
              <li class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-brand-400 mr-2"></span> All 7 Mandatory Documents</li>
              <li class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-brand-400 mr-2"></span> Kanban Application Boards</li>
            </ul>
          </div>
          <button
            @click="triggerCheckout"
            :disabled="orgPlan === 'Growth'"
            class="w-full py-2.5 text-xs font-bold rounded-lg transition"
            :class="orgPlan === 'Growth' ? 'border border-brand-500/30 text-brand-400 bg-brand-900/10 cursor-default' : 'bg-brand-600 hover:bg-brand-500 text-white shadow'"
          >
            {{ orgPlan === 'Growth' ? 'Active Plan' : 'Select Plan' }}
          </button>
        </div>

        <!-- Enterprise Card -->
        <div class="glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-between h-[380px]" :class="{ 'border-brand-500/40 bg-brand-950/5': orgPlan === 'Enterprise' }">
          <div class="space-y-4">
            <h4 class="text-sm font-bold text-gray-400 uppercase tracking-widest">Enterprise</h4>
            <div class="text-3xl font-extrabold text-white">₦75,000 <span class="text-xs text-gray-500">/ month</span></div>
            <p class="text-xs text-gray-400 leading-relaxed">For massive international networks requiring zero seat ceilings.</p>
            <ul class="text-xs text-gray-300 space-y-2 pt-2">
              <li class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-brand-400 mr-2"></span> Unlimited Counselor Seats</li>
              <li class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-brand-400 mr-2"></span> Custom Document Verification</li>
              <li class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-brand-400 mr-2"></span> Advanced Audit Event Logs</li>
            </ul>
          </div>
          <button
            @click="triggerCheckout"
            :disabled="orgPlan === 'Enterprise'"
            class="w-full py-2.5 text-xs font-bold rounded-lg transition"
            :class="orgPlan === 'Enterprise' ? 'border border-brand-500/30 text-brand-400 bg-brand-900/10 cursor-default' : 'bg-brand-600 hover:bg-brand-500 text-white shadow'"
          >
            {{ orgPlan === 'Enterprise' ? 'Active Plan' : 'Select Plan' }}
          </button>
        </div>

      </div>
    </main>

    <!-- CHECKOUT SIMULATOR CONFIRMATION MODAL -->
    <div
      v-if="showCheckoutConfirmModal"
      class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-sm"
    >
      <div class="w-full max-w-md glass-panel p-8 rounded-2xl shadow-2xl relative overflow-hidden space-y-6">
        <!-- Glow accent -->
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-brand-500 rounded-full blur-3xl opacity-20"></div>

        <div class="flex justify-between items-center border-b border-gray-800 pb-3">
          <h3 class="text-xl font-extrabold text-white">Simulate Gateway Checkout</h3>
          <button @click="showCheckoutConfirmModal = false" class="text-gray-400 hover:text-white transition text-lg">&times;</button>
        </div>

        <div class="space-y-3">
          <p class="text-sm text-gray-300 leading-relaxed">
            [Sandbox Mode] Click below to simulate an active gateway payment redirection and response.
          </p>
          <p class="text-xs text-gray-400 italic">
            This will update your subscription to the active Growth tier, enabling multi-tenant team seats.
          </p>
        </div>

        <div class="pt-4 flex space-x-3">
          <button
            type="button"
            @click="showCheckoutConfirmModal = false"
            class="w-1/2 py-3 rounded-xl border border-gray-700 hover:border-gray-500 text-sm font-semibold text-gray-300 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="handleConfirmCheckout"
            class="w-1/2 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold transition shadow shadow-brand-500/20"
          >
            Simulate Success
          </button>
        </div>
      </div>
    </div>

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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = ref(useAuthStore());

const checkoutLoading = ref(false);
const showCheckoutConfirmModal = ref(false);

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

const orgPlan = computed(() => authStore.value.user?.tenant?.planTier || 'Free');
const orgStatus = computed(() => authStore.value.user?.tenant?.subscriptionStatus || 'trialing');
const orgPeriodEnd = computed(() => authStore.value.user?.tenant?.currentPeriodEnd || new Date());

// Real Tenant Usage Tracker Stats
const activeSeats = computed(() => authStore.value.user?.tenant?.currentSeatCount || 3);
const activeApplicants = computed(() => authStore.value.user?.tenant?.currentApplicantCount || 5);
const activeStorage = computed(() => authStore.value.user?.tenant?.storageUsedGB || 0);

const maxSeats = computed(() => {
  if (orgPlan.value === 'Free') return 1;
  if (orgPlan.value === 'Growth') return 15;
  return Infinity;
});

const seatPercentage = computed(() => {
  if (maxSeats.value === Infinity) return 0;
  return Math.round((activeSeats.value / maxSeats.value) * 100);
});

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const goBack = () => {
  if (authStore.value.isCounselor) {
    router.push('/counselor/dashboard');
  } else {
    router.push('/officer/pipeline');
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-500/10 border-green-500/20 text-green-300';
    case 'trialing':
      return 'bg-blue-500/10 border-blue-500/20 text-blue-300';
    case 'past_due':
      return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300';
    case 'canceled':
      return 'bg-red-500/10 border-red-500/20 text-red-300';
    default:
      return 'bg-gray-500/10 border-gray-500/20 text-gray-300';
  }
};

const triggerCheckout = () => {
  checkoutLoading.value = true;
  setTimeout(() => {
    checkoutLoading.value = false;
    showCheckoutConfirmModal.value = true;
  }, 600);
};

const handleConfirmCheckout = () => {
  showCheckoutConfirmModal.value = false;
  
  // Trigger Custom Toast
  triggerToast("Simulated Checkout Success! Redirecting back to dashboard.", "success");
  
  // Update local storage tenant details for reactive UI refresh
  const userObj = JSON.parse(localStorage.getItem('user'));
  if (userObj && userObj.tenant) {
    userObj.tenant.subscriptionStatus = 'active';
    userObj.tenant.planTier = 'Growth';
    userObj.tenant.currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    localStorage.setItem('user', JSON.stringify(userObj));
    
    // Reload state
    authStore.value.user = userObj;
  }
  
  setTimeout(() => {
    goBack();
  }, 1500);
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
