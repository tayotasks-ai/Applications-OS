<template>
  <div class="min-h-screen pb-12">
    <!-- Navbar Header -->
    <header class="glass-panel border-b border-gray-800 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <svg class="h-6 w-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span class="text-xl font-bold text-white tracking-wider">Agency Management OS</span>
        </div>
        <div class="flex items-center space-x-4">
          <div class="text-right hidden sm:block">
            <div class="text-sm font-semibold text-white">{{ authStore.user?.name }}</div>
            <div class="text-xs text-brand-400 font-medium">Applications Director (Lead)</div>
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
      <!-- Title & Filters Bar -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 class="text-3xl font-extrabold text-white">Master Applications Pipeline</h1>
          <p class="text-gray-400 mt-1">Macro-view monitoring of all active university program submissions and workloads.</p>
        </div>

        <!-- Dynamic Workload Filter Dropdown -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-gray-900/60 border border-gray-800 p-3 rounded-2xl shrink-0">
          <label for="officer-filter" class="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
            Filter by Officer:
          </label>
          <select
            id="officer-filter"
            v-model="selectedOfficerId"
            class="glass-input px-3.5 py-2 rounded-xl text-sm border font-medium text-white min-w-[200px]"
          >
            <option value="">All Officers (Master Board)</option>
            <option
              v-for="officer in applicationOfficers"
              :key="officer._id"
              :value="officer._id"
            >
              {{ officer.name }} ({{ getOfficerActiveCount(officer._id) }} active)
            </option>
          </select>
        </div>
      </div>

      <!-- Quick Metrics Dashboard -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="glass-panel p-5 rounded-2xl border border-gray-800">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Pipeline Cases</p>
          <h3 class="text-2xl font-black text-white mt-1">{{ totalPipelineCount }}</h3>
        </div>
        <div class="glass-panel p-5 rounded-2xl border border-gray-800">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ready for Dispatch</p>
          <h3 class="text-2xl font-black text-blue-400 mt-1">{{ getColumnApplicants('READY_FOR_APP').length }}</h3>
        </div>
        <div class="glass-panel p-5 rounded-2xl border border-gray-800">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Under Review</p>
          <h3 class="text-2xl font-black text-purple-400 mt-1">{{ getColumnApplicants('APP_IN_PROGRESS').length }}</h3>
        </div>
        <div class="glass-panel p-5 rounded-2xl border border-gray-800">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Decisions Pending</p>
          <h3 class="text-2xl font-black text-orange-400 mt-1">{{ getColumnApplicants('DECISION_PENDING').length }}</h3>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-40 space-y-4">
        <span class="animate-spin h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full"></span>
        <span class="text-gray-400 text-sm">Synchronizing pipeline data...</span>
      </div>

      <!-- Kanban Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6" v-else>
        
        <!-- Column 1: READY_FOR_APP -->
        <div class="glass-panel p-5 rounded-2xl border border-gray-800 flex flex-col h-[700px] relative overflow-hidden">
          <div class="absolute -top-12 -left-12 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
          
          <div class="flex items-center justify-between border-b border-gray-800 pb-3 mb-4 shrink-0 relative z-10">
            <div class="flex items-center space-x-2.5">
              <span class="w-3.5 h-3.5 rounded-full bg-blue-500 shadow shadow-blue-500/30"></span>
              <h3 class="font-bold text-white text-base">Ready for App</h3>
            </div>
            <span class="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
              {{ getColumnApplicants('READY_FOR_APP').length }}
            </span>
          </div>

          <div class="grow overflow-y-auto space-y-4 pr-1 kanban-scroll relative z-10">
            <div
              v-for="app in getColumnApplicants('READY_FOR_APP')"
              :key="app._id"
              class="p-4 rounded-xl glass-card border border-gray-800/80 flex flex-col space-y-3"
            >
              <div @click="viewDetail(app._id)" class="grow space-y-2">
                <div class="font-bold text-white text-base hover:text-brand-300 transition">{{ app.firstName }} {{ app.lastName }}</div>
                <div class="text-xs text-brand-400 font-semibold uppercase tracking-wider">{{ app.intakeData?.courseOfInterest }}</div>
                <div class="text-xs text-gray-400">{{ app.intakeData?.schoolOfChoice }} ({{ app.intakeData?.intendedLocation }})</div>
              </div>
              
              <div class="pt-3 border-t border-gray-800 flex items-center justify-between shrink-0">
                <div class="flex items-center gap-1.5 bg-gray-900/60 px-2 py-1 rounded-lg border border-gray-800 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                  <span class="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                  <span>{{ app.assignedOfficer ? app.assignedOfficer.name.split(' ')[0] : 'Unassigned' }}</span>
                </div>
                <button
                  @click="promoteStatus(app._id, 'APP_IN_PROGRESS')"
                  class="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center space-x-1 shadow shadow-blue-500/10"
                >
                  <span>Start Submission</span>
                </button>
              </div>
            </div>
            <div v-if="getColumnApplicants('READY_FOR_APP').length === 0" class="text-center py-20 text-gray-600 text-sm">
              No applicants in this stage
            </div>
          </div>
        </div>

        <!-- Column 2: APP_IN_PROGRESS -->
        <div class="glass-panel p-5 rounded-2xl border border-gray-800 flex flex-col h-[700px] relative overflow-hidden">
          <div class="absolute -top-12 -left-12 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>

          <div class="flex items-center justify-between border-b border-gray-800 pb-3 mb-4 shrink-0 relative z-10">
            <div class="flex items-center space-x-2.5">
              <span class="w-3.5 h-3.5 rounded-full bg-purple-500 shadow shadow-purple-500/30"></span>
              <h3 class="font-bold text-white text-base">Admissions Review</h3>
            </div>
            <span class="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
              {{ getColumnApplicants('APP_IN_PROGRESS').length }}
            </span>
          </div>

          <div class="grow overflow-y-auto space-y-4 pr-1 kanban-scroll relative z-10">
            <div
              v-for="app in getColumnApplicants('APP_IN_PROGRESS')"
              :key="app._id"
              class="p-4 rounded-xl glass-card border border-gray-800/80 flex flex-col space-y-3"
            >
              <div @click="viewDetail(app._id)" class="grow space-y-2">
                <div class="font-bold text-white text-base hover:text-brand-300 transition">{{ app.firstName }} {{ app.lastName }}</div>
                <div class="text-xs text-brand-400 font-semibold uppercase tracking-wider">{{ app.intakeData?.courseOfInterest }}</div>
                <div class="text-xs text-gray-400">{{ app.intakeData?.schoolOfChoice }} ({{ app.intakeData?.intendedLocation }})</div>
              </div>
              
              <div class="pt-3 border-t border-gray-800 flex items-center justify-between shrink-0">
                <div class="flex items-center gap-1.5 bg-gray-900/60 px-2 py-1 rounded-lg border border-gray-800 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                  <span class="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                  <span>{{ app.assignedOfficer ? app.assignedOfficer.name.split(' ')[0] : 'Unassigned' }}</span>
                </div>
                <button
                  @click="promoteStatus(app._id, 'DECISION_PENDING')"
                  class="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center space-x-1 shadow shadow-purple-500/10"
                >
                  <span>Lock Dispatch</span>
                </button>
              </div>
            </div>
            <div v-if="getColumnApplicants('APP_IN_PROGRESS').length === 0" class="text-center py-20 text-gray-600 text-sm">
              No applicants in this stage
            </div>
          </div>
        </div>

        <!-- Column 3: DECISION_PENDING -->
        <div class="glass-panel p-5 rounded-2xl border border-gray-800 flex flex-col h-[700px] relative overflow-hidden">
          <div class="absolute -top-12 -left-12 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl"></div>

          <div class="flex items-center justify-between border-b border-gray-800 pb-3 mb-4 shrink-0 relative z-10">
            <div class="flex items-center space-x-2.5">
              <span class="w-3.5 h-3.5 rounded-full bg-orange-500 shadow shadow-orange-500/30"></span>
              <h3 class="font-bold text-white text-base">Admissions Decisions</h3>
            </div>
            <span class="px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/20">
              {{ getColumnApplicants('DECISION_PENDING').length }}
            </span>
          </div>

          <div class="grow overflow-y-auto space-y-4 pr-1 kanban-scroll relative z-10">
            <div
              v-for="app in getColumnApplicants('DECISION_PENDING')"
              :key="app._id"
              class="p-4 rounded-xl glass-card border border-gray-800/80 flex flex-col space-y-3"
            >
              <div @click="viewDetail(app._id)" class="grow space-y-2">
                <div class="font-bold text-white text-base hover:text-brand-300 transition">{{ app.firstName }} {{ app.lastName }}</div>
                <div class="text-xs text-brand-400 font-semibold uppercase tracking-wider">{{ app.intakeData?.courseOfInterest }}</div>
                <div class="text-xs text-gray-400">{{ app.intakeData?.schoolOfChoice }} ({{ app.intakeData?.intendedLocation }})</div>
              </div>
              
              <div class="pt-3 border-t border-gray-800 flex flex-col space-y-2.5 shrink-0">
                <div class="flex justify-between items-center w-full">
                  <div class="flex items-center gap-1.5 bg-gray-900/60 px-2 py-1 rounded-lg border border-gray-800 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                    <span class="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                    <span>{{ app.assignedOfficer ? app.assignedOfficer.name.split(' ')[0] : 'Unassigned' }}</span>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-2 w-full">
                  <button
                    @click="promoteStatus(app._id, 'CLOSED_WON')"
                    class="py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-bold transition text-center shadow shadow-green-500/10"
                  >
                    Accept
                  </button>
                  <button
                    @click="promoteStatus(app._id, 'CLOSED_LOST')"
                    class="py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition text-center shadow shadow-red-500/10"
                  >
                    Decline
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

const loading = ref(true);
const selectedOfficerId = ref('');
const applicationOfficers = ref([]);

const API_URL = 'http://localhost:5001/api';

// Fetch users to populate Team Lead workload filters
const fetchOfficers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    if (response.ok) {
      const users = await response.json();
      applicationOfficers.value = users.filter(u => u.role === 'ApplicationOfficer' && u.isActive);
    }
  } catch (err) {
    console.error('Error fetching officers for filter:', err);
  }
};

const loadData = async () => {
  loading.value = true;
  await applicantsStore.fetchApplicants(); // Enforces OfficerLead scoping on backend
  await fetchOfficers();
  loading.value = false;
};

onMounted(() => {
  loadData();
});

// Reactively filter all loaded applicants depending on select box selection
const filteredApplicants = computed(() => {
  const allApplicants = applicantsStore.applicants || [];
  if (!selectedOfficerId.value) return allApplicants;
  return allApplicants.filter(
    app => app.assignedOfficer && app.assignedOfficer._id === selectedOfficerId.value
  );
});

// Workload metrics computations
const totalPipelineCount = computed(() => filteredApplicants.value.length);

const getColumnApplicants = (status) => {
  return filteredApplicants.value.filter(app => app.status === status);
};

// Workload metrics helpers for dropdown label counts
const getOfficerActiveCount = (officerId) => {
  const allApplicants = applicantsStore.applicants || [];
  return allApplicants.filter(
    app => app.assignedOfficer && app.assignedOfficer._id === officerId
  ).length;
};

// Status transition state promotion handlers
const promoteStatus = async (id, nextStatus) => {
  try {
    loading.value = true;
    await applicantsStore.updateApplicantStatus(id, nextStatus);
    await applicantsStore.fetchApplicants(); // refresh
  } catch (err) {
    alert('Failed to update applicant state: ' + err.message);
  } finally {
    loading.value = false;
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
