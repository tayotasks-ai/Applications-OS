<template>
  <div class="min-h-screen pb-12">
    <!-- Navbar Header -->
    <header class="glass-panel border-b border-gray-800 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <svg class="h-6 w-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span class="text-xl font-bold text-white tracking-wider">Agency Management OS</span>
        </div>
        <div class="flex items-center space-x-4">
          <div class="text-right hidden sm:block">
            <div class="text-sm font-semibold text-white">{{ authStore.user?.name }}</div>
            <div class="text-xs text-brand-400 capitalize">{{ authStore.userRole }}</div>
          </div>
          <router-link
            to="/billing"
            class="px-3.5 py-1.5 rounded-lg border border-gray-700 hover:border-brand-500 hover:text-brand-400 transition text-sm text-gray-400 font-medium"
          >
            Billing
          </router-link>
          <button
            @click="handleLogout"
            class="px-3.5 py-1.5 rounded-lg border border-gray-700 hover:border-red-500 hover:text-red-400 transition text-sm text-gray-400 font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
      <!-- Title -->
      <div>
        <h1 class="text-3xl font-extrabold text-white">University Application Pipeline</h1>
        <p class="text-gray-400 mt-1">Track and transition applicants through active university submission stages.</p>
      </div>

      <!-- Loading State -->
      <div v-if="applicantsStore.loading && applicants.length === 0" class="flex flex-col items-center justify-center py-40 space-y-4">
        <span class="animate-spin h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full"></span>
        <span class="text-gray-400 text-sm">Loading applications pipeline...</span>
      </div>

      <!-- Kanban Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6" v-else>
        <!-- Column 1: READY_FOR_APP -->
        <div class="glass-panel p-5 rounded-2xl border border-gray-800 flex flex-col h-[700px]">
          <div class="flex items-center justify-between border-b border-gray-800 pb-3 mb-4 shrink-0">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 rounded-full bg-blue-500"></span>
              <h3 class="font-bold text-white text-base">Ready for App</h3>
            </div>
            <span class="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold">
              {{ getColumnApplicants('READY_FOR_APP').length }}
            </span>
          </div>

          <div class="grow overflow-y-auto space-y-4 pr-1 kanban-scroll">
            <div
              v-for="app in getColumnApplicants('READY_FOR_APP')"
              :key="app._id"
              class="p-4 rounded-xl glass-card border border-gray-800/80 flex flex-col space-y-3"
            >
              <!-- Return requested pending indicator -->
              <div v-if="app.returnRequested" class="p-2 rounded bg-orange-950/20 border border-orange-500/25 text-orange-400 text-[10px] font-bold tracking-wider uppercase animate-pulse shrink-0">
                🕒 Return Pending Approval
              </div>

              <div @click="viewDetail(app._id)" class="grow space-y-2 cursor-pointer">
                <div class="font-bold text-white text-base hover:text-brand-300 transition">{{ app.firstName }} {{ app.lastName }}</div>
                <div class="text-xs text-brand-400 font-semibold">{{ app.intakeData?.courseOfInterest }}</div>
                <div class="text-xs text-gray-400">{{ app.intakeData?.schoolOfChoice }} ({{ app.intakeData?.intendedLocation }})</div>
              </div>
              <div class="pt-3 border-t border-gray-800 flex items-center justify-between shrink-0">
                <button
                  v-if="!app.returnRequested"
                  @click="openReturnModal(app._id)"
                  class="px-2 py-1 rounded border border-gray-700 hover:border-orange-500 hover:text-orange-400 text-[10px] font-bold transition font-sans"
                >
                  Request Return
                </button>
                <div v-else></div>
                <button
                  @click="promoteStatus(app._id, 'APP_IN_PROGRESS')"
                  class="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center space-x-1"
                >
                  <span>Start App</span>
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            <div v-if="getColumnApplicants('READY_FOR_APP').length === 0" class="text-center py-20 text-gray-600 text-sm">
              No applicants in this stage
            </div>
          </div>
        </div>

        <!-- Column 2: APP_IN_PROGRESS -->
        <div class="glass-panel p-5 rounded-2xl border border-gray-800 flex flex-col h-[700px]">
          <div class="flex items-center justify-between border-b border-gray-800 pb-3 mb-4 shrink-0">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 rounded-full bg-purple-500"></span>
              <h3 class="font-bold text-white text-base">Application in Progress</h3>
            </div>
            <span class="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold">
              {{ getColumnApplicants('APP_IN_PROGRESS').length }}
            </span>
          </div>

          <div class="grow overflow-y-auto space-y-4 pr-1 kanban-scroll">
            <div
              v-for="app in getColumnApplicants('APP_IN_PROGRESS')"
              :key="app._id"
              class="p-4 rounded-xl glass-card border border-gray-800/80 flex flex-col space-y-3"
            >
              <!-- Return requested pending indicator -->
              <div v-if="app.returnRequested" class="p-2 rounded bg-orange-950/20 border border-orange-500/25 text-orange-400 text-[10px] font-bold tracking-wider uppercase animate-pulse shrink-0">
                🕒 Return Pending Approval
              </div>

              <div @click="viewDetail(app._id)" class="grow space-y-2 cursor-pointer">
                <div class="font-bold text-white text-base hover:text-brand-300 transition">{{ app.firstName }} {{ app.lastName }}</div>
                <div class="text-xs text-brand-400 font-semibold">{{ app.intakeData?.courseOfInterest }}</div>
                <div class="text-xs text-gray-400">{{ app.intakeData?.schoolOfChoice }} ({{ app.intakeData?.intendedLocation }})</div>
              </div>
              <div class="pt-3 border-t border-gray-800 flex items-center justify-between shrink-0">
                <button
                  v-if="!app.returnRequested"
                  @click="openReturnModal(app._id)"
                  class="px-2 py-1 rounded border border-gray-700 hover:border-orange-500 hover:text-orange-400 text-[10px] font-bold transition font-sans"
                >
                  Request Return
                </button>
                <div v-else></div>
                <button
                  @click="promoteStatus(app._id, 'DECISION_PENDING')"
                  class="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center space-x-1"
                >
                  <span>Submit App</span>
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            <div v-if="getColumnApplicants('APP_IN_PROGRESS').length === 0" class="text-center py-20 text-gray-600 text-sm">
              No applicants in this stage
            </div>
          </div>
        </div>

        <!-- Column 3: DECISION_PENDING -->
        <div class="glass-panel p-5 rounded-2xl border border-gray-800 flex flex-col h-[700px]">
          <div class="flex items-center justify-between border-b border-gray-800 pb-3 mb-4 shrink-0">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 rounded-full bg-orange-500"></span>
              <h3 class="font-bold text-white text-base">Decision Pending</h3>
            </div>
            <span class="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold">
              {{ getColumnApplicants('DECISION_PENDING').length }}
            </span>
          </div>

          <div class="grow overflow-y-auto space-y-4 pr-1 kanban-scroll">
            <div
              v-for="app in getColumnApplicants('DECISION_PENDING')"
              :key="app._id"
              class="p-4 rounded-xl glass-card border border-gray-800/80 flex flex-col space-y-3"
            >
              <!-- Return requested pending indicator -->
              <div v-if="app.returnRequested" class="p-2 rounded bg-orange-950/20 border border-orange-500/25 text-orange-400 text-[10px] font-bold tracking-wider uppercase animate-pulse shrink-0">
                🕒 Return Pending Approval
              </div>

              <div @click="viewDetail(app._id)" class="grow space-y-2 cursor-pointer">
                <div class="font-bold text-white text-base hover:text-brand-300 transition">{{ app.firstName }} {{ app.lastName }}</div>
                <div class="text-xs text-brand-400 font-semibold">{{ app.intakeData?.courseOfInterest }}</div>
                <div class="text-xs text-gray-400">{{ app.intakeData?.schoolOfChoice }} ({{ app.intakeData?.intendedLocation }})</div>
              </div>
              <div class="pt-3 border-t border-gray-800 flex flex-col space-y-2 shrink-0">
                <div class="flex justify-between w-full">
                  <button
                    v-if="!app.returnRequested"
                    @click="openReturnModal(app._id)"
                    class="px-2 py-1 rounded border border-gray-700 hover:border-orange-500 hover:text-orange-400 text-[10px] font-bold transition font-sans"
                  >
                    Request Return
                  </button>
                  <div v-else></div>
                </div>
                <div class="grid grid-cols-2 gap-2 mt-1 w-full">
                  <button
                    @click="promoteStatus(app._id, 'CLOSED_WON')"
                    class="py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-bold transition text-center"
                  >
                    Accept
                  </button>
                  <button
                    @click="promoteStatus(app._id, 'CLOSED_LOST')"
                    class="py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition text-center"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
            <div v-if="getColumnApplicants('DECISION_PENDING').length === 0" class="text-center py-20 text-gray-600 text-sm">
              No applicants in this stage
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- CLASSMorphic REQUEST RETURN MODAL -->
    <div
      v-if="showReturnModal"
      class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-sm"
    >
      <div class="w-full max-w-md glass-panel p-8 rounded-2xl shadow-2xl relative overflow-hidden space-y-6">
        <!-- Glow accent -->
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-orange-500 rounded-full blur-3xl opacity-15"></div>

        <div class="flex justify-between items-center border-b border-gray-800 pb-3">
          <h3 class="text-xl font-extrabold text-white">Request Counseling Return</h3>
          <button @click="closeReturnModal" class="text-gray-400 hover:text-white transition text-lg">&times;</button>
        </div>

        <form @submit.prevent="submitReturnRequest" class="space-y-4">
          <div>
            <label for="return-reason" class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Reason for correction return
            </label>
            <textarea
              id="return-reason"
              rows="4"
              required
              v-model="returnReason"
              class="glass-input block w-full px-4 py-2.5 rounded-xl text-sm border resize-none"
              placeholder="e.g. CV requires signatures; destination preference changed."
            ></textarea>
          </div>

          <div class="pt-4 flex space-x-3">
            <button
              type="button"
              @click="closeReturnModal"
              class="w-1/2 py-3 rounded-xl border border-gray-700 hover:border-gray-500 text-sm font-semibold text-gray-300 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submittingReturn"
              class="w-1/2 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold transition shadow shadow-orange-500/20 disabled:opacity-50"
            >
              <span v-if="submittingReturn" class="inline-block animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useApplicantsStore } from '../stores/applicants';

const router = useRouter();
const authStore = useAuthStore();
const applicantsStore = useApplicantsStore();

const applicants = computed(() => applicantsStore.applicants);

// Return Request Modal State
const showReturnModal = ref(false);
const submittingReturn = ref(false);
const returnReason = ref('');
const targetApplicantId = ref('');

const loadData = () => {
  applicantsStore.fetchApplicants();
};

onMounted(() => {
  loadData();
});

const getColumnApplicants = (status) => {
  return applicants.value.filter(app => app.status === status);
};

const openReturnModal = (id) => {
  targetApplicantId.value = id;
  showReturnModal.value = true;
};

const closeReturnModal = () => {
  showReturnModal.value = false;
  returnReason.value = '';
  targetApplicantId.value = '';
};

const submitReturnRequest = async () => {
  submittingReturn.value = true;
  try {
    await applicantsStore.requestReturn(targetApplicantId.value, returnReason.value);
    closeReturnModal();
    loadData(); // refresh list
    alert('Success: Return request sent to senior officer.');
  } catch (err) {
    alert('Failed to request return: ' + err.message);
  } finally {
    submittingReturn.value = false;
  }
};

const promoteStatus = async (id, nextStatus) => {
  try {
    await applicantsStore.updateApplicantStatus(id, nextStatus);
    loadData(); // reload
  } catch (err) {
    alert('Failed to update status: ' + err.message);
  }
};

const viewDetail = (id) => {
  router.push(`/officer/applicant/${id}`);
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
