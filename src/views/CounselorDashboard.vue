<template>
  <div class="min-h-screen pb-12">
    <!-- Navbar Header -->
    <header class="glass-panel border-b border-gray-800 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <svg class="h-6 w-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
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
      <!-- Welcome Section & Action -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-white">Counselor Dashboard</h1>
          <p class="text-gray-400 mt-1">Manage and track your assigned educational travel leads.</p>
        </div>
        <router-link
          to="/counselor/intake"
          class="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition shadow-lg hover:shadow-brand-500/20"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Intake New Lead
        </router-link>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="glass-card p-5 rounded-xl">
          <div class="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Leads</div>
          <div class="text-3xl font-bold text-white mt-2">{{ applicantsStore.applicants.length }}</div>
        </div>
        <div class="glass-card p-5 rounded-xl">
          <div class="text-gray-400 text-xs font-semibold uppercase tracking-wider">In Counseling</div>
          <div class="text-3xl font-bold text-yellow-400 mt-2">{{ getCount('IN_COUNSELING') }}</div>
        </div>
        <div class="glass-card p-5 rounded-xl">
          <div class="text-gray-400 text-xs font-semibold uppercase tracking-wider">Ready for Apps</div>
          <div class="text-3xl font-bold text-blue-400 mt-2">{{ getCount('READY_FOR_APP') }}</div>
        </div>
        <div class="glass-card p-5 rounded-xl">
          <div class="text-gray-400 text-xs font-semibold uppercase tracking-wider">Closed Won</div>
          <div class="text-3xl font-bold text-green-400 mt-2">{{ getCount('CLOSED_WON') }}</div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="glass-panel rounded-2xl overflow-hidden shadow-xl border border-gray-800">
        <div class="p-6 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 class="text-lg font-bold text-white">Assigned Applicants List</h3>
          <!-- Filters -->
          <div class="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
            <select
              v-model="selectedStatus"
              @change="applyFilter"
              class="glass-input text-xs sm:text-sm px-3 py-1.5 rounded-lg border"
            >
              <option value="">All Statuses</option>
              <option value="LEAD_NEW">New Lead</option>
              <option value="IN_COUNSELING">In Counseling</option>
              <option value="READY_FOR_APP">Ready for Applications</option>
              <option value="APP_IN_PROGRESS">Application in Progress</option>
              <option value="DECISION_PENDING">Decision Pending</option>
              <option value="CLOSED_WON">Closed Won</option>
              <option value="CLOSED_LOST">Closed Lost</option>
            </select>
          </div>
        </div>

        <div v-if="applicantsStore.loading" class="flex flex-col items-center justify-center py-20 space-y-4">
          <span class="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full"></span>
          <span class="text-gray-400 text-sm">Loading applicants...</span>
        </div>

        <div v-else-if="applicantsStore.applicants.length === 0" class="text-center py-20 text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span class="text-gray-400">No applicants found matching this criteria.</span>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-800 text-left">
            <thead class="bg-gray-900/40 text-gray-400 text-xs uppercase font-semibold tracking-wider">
              <tr>
                <th scope="col" class="px-6 py-4">Name</th>
                <th scope="col" class="px-6 py-4">Intended Course / School</th>
                <th scope="col" class="px-6 py-4">Destination & Budget</th>
                <th scope="col" class="px-6 py-4">Status</th>
                <th scope="col" class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800 text-sm">
              <tr
                v-for="applicant in applicantsStore.applicants"
                :key="applicant._id"
                class="hover:bg-gray-800/20 transition-all"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-semibold text-white">{{ applicant.firstName }} {{ applicant.lastName }}</div>
                  <div class="text-xs text-gray-400 mt-0.5">{{ applicant.email }}</div>
                  <div class="text-xs text-gray-400">{{ applicant.phone }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-white font-medium">{{ applicant.intakeData?.courseOfInterest || 'N/A' }}</div>
                  <div class="text-xs text-gray-400 mt-0.5">{{ applicant.intakeData?.schoolOfChoice || 'N/A' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-white">{{ applicant.intakeData?.intendedLocation || 'N/A' }}</div>
                  <div class="text-xs text-gray-400 mt-0.5">Budget: {{ applicant.intakeData?.budget || 'N/A' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center"
                    :class="getStatusBadgeClass(applicant.status)"
                  >
                    {{ formatStatus(applicant.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <router-link
                    :to="`/counselor/applicant/${applicant._id}`"
                    class="text-brand-400 hover:text-brand-300 font-semibold transition"
                  >
                    View Details & Docs &rarr;
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useApplicantsStore } from '../stores/applicants';

const router = useRouter();
const authStore = useAuthStore();
const applicantsStore = useApplicantsStore();

const selectedStatus = ref('');

const loadData = () => {
  applicantsStore.fetchApplicants();
};

onMounted(() => {
  loadData();
});

const getCount = (status) => {
  return applicantsStore.applicants.filter(a => a.status === status).length;
};

const applyFilter = () => {
  applicantsStore.fetchApplicants({ status: selectedStatus.value });
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const formatStatus = (status) => {
  if (!status) return '';
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'LEAD_NEW':
      return 'bg-brand-500/10 border border-brand-500/20 text-brand-300';
    case 'IN_COUNSELING':
      return 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-300';
    case 'READY_FOR_APP':
      return 'bg-blue-500/10 border border-blue-500/20 text-blue-300';
    case 'APP_IN_PROGRESS':
      return 'bg-purple-500/10 border border-purple-500/20 text-purple-300';
    case 'DECISION_PENDING':
      return 'bg-orange-500/10 border border-orange-500/20 text-orange-300';
    case 'CLOSED_WON':
      return 'bg-green-500/10 border border-green-500/20 text-green-300';
    case 'CLOSED_LOST':
      return 'bg-red-500/10 border border-red-500/20 text-red-300';
    default:
      return 'bg-gray-500/10 border border-gray-500/20 text-gray-300';
  }
};
</script>
