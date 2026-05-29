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
          <h1 class="text-3xl font-extrabold text-white">
            {{ authStore.isAdmin ? 'Agency Admin Console' : authStore.isCounselorLead ? 'Senior Counselor Dashboard' : 'Counselor Dashboard' }}
          </h1>
          <p class="text-gray-400 mt-1">
            {{ authStore.isAdmin ? 'Workspace control center and team management portal.' : 'Manage and track your assigned educational travel leads.' }}
          </p>
        </div>
        
        <!-- Tab Switcher for Admin -->
        <div v-if="authStore.isAdmin" class="flex bg-gray-900/60 p-1.5 rounded-xl border border-gray-800 self-start">
          <button
            @click="activeTab = 'applicants'"
            class="px-4 py-2 text-xs font-bold rounded-lg transition"
            :class="activeTab === 'applicants' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'"
          >
            Applicants Directory
          </button>
          <button
            @click="activeTab = 'team'"
            class="px-4 py-2 text-xs font-bold rounded-lg transition"
            :class="activeTab === 'team' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'"
          >
            Manage Team Staff
          </button>
        </div>

        <router-link
          v-if="activeTab === 'applicants'"
          to="/counselor/intake"
          class="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition shadow-lg hover:shadow-brand-500/20 self-start"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Intake New Lead
        </router-link>

        <button
          v-else-if="activeTab === 'team'"
          @click="showInviteModal = true"
          class="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition shadow-lg hover:shadow-brand-500/20 self-start font-sans"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Invite Staff Member
        </button>
      </div>

      <!-- APPLICANTS TAB -->
      <div v-if="activeTab === 'applicants'" class="space-y-8">
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
            <h3 class="text-lg font-bold text-white">Applicants Directory</h3>
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
                  <th scope="col" class="px-6 py-4" v-if="authStore.isAdmin || authStore.isCounselorLead">Counselor</th>
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
                  <td class="px-6 py-4 whitespace-nowrap" v-if="authStore.isAdmin || authStore.isCounselorLead">
                    <div class="text-white font-medium">{{ applicant.assignedCounselor ? applicant.assignedCounselor.name : 'Unassigned' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center"
                      :class="getStatusBadgeClass(applicant.status)"
                    >
                      <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="getStatusDotClass(applicant.status)"></span>
                      {{ formatStatus(applicant.status) }}
                    </span>
                    <!-- return requested indicator -->
                    <div v-if="applicant.returnRequested" class="mt-1">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-950/40 border border-orange-500/20 text-orange-400 animate-pulse">
                        Return Requested
                      </span>
                    </div>
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
      </div>

      <!-- TEAM TAB (ADMIN ONLY) -->
      <div v-else-if="activeTab === 'team' && authStore.isAdmin" class="space-y-8">
        <!-- Seat limit tracker card -->
        <div class="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-white">Active Seat Limits</h3>
              <p class="text-xs text-gray-400 mt-0.5">Seat boundaries are gated dynamically by your billing subscription tier.</p>
            </div>
            <span class="px-3.5 py-1 rounded-full text-xs font-bold bg-brand-600/10 border border-brand-500/20 text-brand-300 uppercase tracking-widest">
              {{ authStore.user?.tenant?.planTier }} Plan
            </span>
          </div>

          <!-- seat meter visual HSL cyan colors -->
          <div class="space-y-2">
            <div class="flex justify-between text-xs font-semibold text-gray-400">
              <span>{{ activeSeatCount }} Seats Used</span>
              <span>Limit: {{ getSeatLimit() }}</span>
            </div>
            <div class="w-full h-3 rounded-full bg-gray-900 border border-gray-800 overflow-hidden relative">
              <div
                class="h-full bg-brand-500 transition-all duration-500 shadow shadow-brand-500/50"
                :style="{ width: `${Math.min((activeSeatCount / getSeatLimit()) * 100, 100)}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Team directory table -->
        <div class="glass-panel rounded-2xl overflow-hidden border border-gray-800 shadow-xl">
          <div class="p-6 border-b border-gray-800 flex justify-between items-center">
            <h3 class="text-lg font-bold text-white">Organization Directory</h3>
            <span class="text-xs text-gray-400">{{ staffUsers.length }} active team members</span>
          </div>

          <div v-if="loadingStaff" class="flex flex-col items-center justify-center py-20 space-y-4">
            <span class="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full"></span>
            <span class="text-gray-400 text-sm">Synchronizing directory...</span>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-800 text-left">
              <thead class="bg-gray-900/40 text-gray-400 text-xs uppercase font-semibold tracking-wider">
                <tr>
                  <th scope="col" class="px-6 py-4">Full Name</th>
                  <th scope="col" class="px-6 py-4">Email Address</th>
                  <th scope="col" class="px-6 py-4">Role Configuration</th>
                  <th scope="col" class="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-800 text-sm">
                <tr v-for="user in staffUsers" :key="user._id" class="hover:bg-gray-800/10">
                  <td class="px-6 py-4 whitespace-nowrap font-semibold text-white">
                    {{ user.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-400">
                    {{ user.email }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-3 py-1 text-xs font-bold rounded-full border"
                      :class="getRoleBadgeClass(user.role)"
                    >
                      {{ formatRole(user.role) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 border border-green-500/20 text-green-300">
                      Active
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- GORGEOUS GLASSMORPHIC INVITE MODAL -->
    <div
      v-if="showInviteModal"
      class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-sm"
    >
      <div class="w-full max-w-md glass-panel p-8 rounded-2xl shadow-2xl relative overflow-hidden space-y-6">
        <!-- Glow accents -->
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-brand-500 rounded-full blur-3xl opacity-20"></div>

        <div class="flex justify-between items-center border-b border-gray-800 pb-3">
          <h3 class="text-xl font-extrabold text-white">Invite Team Staff</h3>
          <button @click="closeInviteModal" class="text-gray-400 hover:text-white transition text-lg">&times;</button>
        </div>

        <form @submit.prevent="inviteStaff" class="space-y-4">
          <div v-if="inviteError" class="p-3 rounded-lg bg-red-900/30 border border-red-500/30 text-red-200 text-xs">
            {{ inviteError }}
          </div>

          <div>
            <label for="staff-name" class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              id="staff-name"
              type="text"
              required
              v-model="inviteForm.name"
              class="glass-input block w-full px-4 py-2.5 rounded-xl text-sm border"
              placeholder="e.g. Sarah Connor"
            />
          </div>

          <div>
            <label for="staff-email" class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              id="staff-email"
              type="email"
              required
              v-model="inviteForm.email"
              class="glass-input block w-full px-4 py-2.5 rounded-xl text-sm border"
              placeholder="name@agency.com"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="staff-password" class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Temporary Password
              </label>
              <input
                id="staff-password"
                type="text"
                required
                v-model="inviteForm.password"
                class="glass-input block w-full px-4 py-2.5 rounded-xl text-sm border font-mono"
              />
            </div>
            <div class="flex items-end">
              <button
                type="button"
                @click="generatePassword"
                class="w-full py-2.5 px-3 rounded-xl border border-gray-700 hover:border-gray-500 text-xs font-semibold text-gray-300 hover:text-white transition h-[40px] flex items-center justify-center"
              >
                Auto Generate
              </button>
            </div>
          </div>

          <div>
            <label for="staff-role" class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Role Assignment
            </label>
            <select
              id="staff-role"
              required
              v-model="inviteForm.role"
              class="glass-input block w-full px-4 py-2.5 rounded-xl text-sm border font-medium text-white"
            >
              <option value="Counselor">Counselor (Junior)</option>
              <option value="CounselorLead">Counselor Lead (Senior)</option>
              <option value="ApplicationOfficer">Application Officer (Junior)</option>
              <option value="OfficerLead">Officer Lead (Senior)</option>
              <option value="Admin">Admin (Co-Owner)</option>
            </select>
          </div>

          <div class="pt-4 flex space-x-3">
            <button
              type="button"
              @click="closeInviteModal"
              class="w-1/2 py-3 rounded-xl border border-gray-700 hover:border-gray-500 text-sm font-semibold text-gray-300 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submittingInvite"
              class="w-1/2 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold transition shadow shadow-brand-500/20 disabled:opacity-50"
            >
              <span v-if="submittingInvite" class="inline-block animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
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

const activeTab = ref('applicants');
const selectedStatus = ref('');

// Admin Team State
const staffUsers = ref([]);
const loadingStaff = ref(false);
const activeSeatCount = ref(0);

const showInviteModal = ref(false);
const submittingInvite = ref(false);
const inviteError = ref('');
const inviteForm = ref({
  name: '',
  email: '',
  password: '',
  role: 'Counselor'
});

const API_URL = 'https://applications-backend-zpxu.onrender.com/api';

const loadData = async () => {
  applicantsStore.fetchApplicants();
  if (authStore.isAdmin) {
    fetchTeamDirectory();
    // Set seat count initially from logged tenant data if available
    activeSeatCount.value = authStore.user?.tenant?.currentSeatCount || 1;
  }
};

onMounted(() => {
  loadData();
  generatePassword(); // Initial seed
});

const fetchTeamDirectory = async () => {
  loadingStaff.value = true;
  try {
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    if (response.ok) {
      staffUsers.value = await response.json();
      activeSeatCount.value = staffUsers.value.length;
    }
  } catch (err) {
    console.error('Error fetching directory:', err);
  } finally {
    loadingStaff.value = false;
  }
};

const getSeatLimit = () => {
  const tier = authStore.user?.tenant?.planTier || 'Free';
  if (tier === 'Free') return 1;
  if (tier === 'Growth') return 15;
  return Infinity;
};

const getCount = (status) => {
  return applicantsStore.applicants.filter(a => a.status === status).length;
};

const applyFilter = () => {
  applicantsStore.fetchApplicants({ status: selectedStatus.value });
};

const generatePassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$';
  let pass = '';
  for (let i = 0; i < 10; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  inviteForm.value.password = pass;
};

const closeInviteModal = () => {
  showInviteModal.value = false;
  inviteForm.value.name = '';
  inviteForm.value.email = '';
  generatePassword();
  inviteError.value = '';
};

const inviteStaff = async () => {
  submittingInvite.value = true;
  inviteError.value = '';

  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(inviteForm.value)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Invitation dispatch failed.');
    }

    // Success - add user locally
    fetchTeamDirectory();
    closeInviteModal();
    alert(`Success: Onboarding welcome invitation dispatched via Resend to ${data.user.email}!`);
  } catch (err) {
    inviteError.value = err.message || 'Server error invitation dispatch.';
  } finally {
    submittingInvite.value = false;
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const formatStatus = (status) => {
  if (!status) return '';
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
};

const formatRole = (role) => {
  if (!role) return '';
  return role.replace(/([A-Z])/g, ' $1').trim();
};

const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'Admin':
      return 'bg-red-500/10 border-red-500/25 text-red-300';
    case 'CounselorLead':
      return 'bg-orange-500/10 border-orange-500/25 text-orange-300';
    case 'Counselor':
      return 'bg-yellow-500/10 border-yellow-500/25 text-yellow-300';
    case 'OfficerLead':
      return 'bg-green-500/10 border-green-500/25 text-green-300';
    case 'ApplicationOfficer':
      return 'bg-blue-500/10 border-blue-500/25 text-blue-300';
    default:
      return 'bg-gray-500/10 border-gray-500/25 text-gray-300';
  }
};

const getStatusDotClass = (status) => {
  switch (status) {
    case 'LEAD_NEW': return 'bg-brand-400';
    case 'IN_COUNSELING': return 'bg-yellow-400';
    case 'READY_FOR_APP': return 'bg-blue-400';
    case 'APP_IN_PROGRESS': return 'bg-purple-400';
    case 'DECISION_PENDING': return 'bg-orange-400';
    case 'CLOSED_WON': return 'bg-green-400';
    case 'CLOSED_LOST': return 'bg-red-400';
    default: return 'bg-gray-400';
  }
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
