<template>
  <div class="min-h-screen pb-12">
    <!-- Header -->
    <header class="glass-panel border-b border-gray-800 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <router-link to="/officer/pipeline" class="flex items-center text-gray-400 hover:text-white transition mr-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </router-link>
          <span class="text-xl font-bold text-white tracking-wider">Agency Management OS</span>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-sm font-semibold text-white capitalize">{{ authStore.user?.name }} (Officer)</span>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8" v-if="loading">
      <div class="flex flex-col items-center justify-center py-40 space-y-4">
        <span class="animate-spin h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full"></span>
        <span class="text-gray-400 text-sm">Loading applicant profile...</span>
      </div>
    </main>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8" v-else-if="applicant">
      <!-- Welcome Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 glass-panel p-6 rounded-2xl border border-gray-800">
        <div>
          <div class="flex items-center space-x-3">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white">{{ applicant.firstName }} {{ applicant.lastName }}</h1>
            <span
              class="px-2.5 py-1 text-xs font-semibold rounded-full border"
              :class="getStatusBadgeClass(applicant.status)"
            >
              {{ formatStatus(applicant.status) }}
            </span>
          </div>
          <p class="text-gray-400 mt-1">Assigned Counselor: {{ applicant.assignedCounselor?.name || 'Unassigned' }}</p>
        </div>

        <!-- Quick Status Control Panel -->
        <div class="flex items-center space-x-2 bg-gray-900/40 border border-gray-800 p-2.5 rounded-xl">
          <label class="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Status:</label>
          <select
            v-model="selectedStatus"
            @change="updateStatus"
            class="glass-input text-xs sm:text-sm px-3 py-1.5 rounded-lg border font-semibold"
          >
            <option value="READY_FOR_APP">Ready for App</option>
            <option value="APP_IN_PROGRESS">App in Progress</option>
            <option value="DECISION_PENDING">Decision Pending</option>
            <option value="CLOSED_WON">Closed Won (Accepted)</option>
            <option value="CLOSED_LOST">Closed Lost (Rejected)</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left: Read-Only Intake Panel -->
        <div class="lg:col-span-1 space-y-6">
          <div class="glass-panel p-6 rounded-2xl border border-gray-800 space-y-5">
            <h3 class="text-lg font-bold text-white border-b border-gray-800 pb-2">Academic & Intake Profile</h3>

            <div class="space-y-4 text-sm">
              <div>
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicant Contact</div>
                <div class="text-white font-medium mt-1">{{ applicant.firstName }} {{ applicant.lastName }}</div>
                <div class="text-gray-400 text-xs mt-0.5">{{ applicant.email }} | {{ applicant.phone }}</div>
              </div>
              
              <div class="border-t border-gray-800/60 pt-3">
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Intended Destination</div>
                <div class="text-white mt-1 font-medium">{{ applicant.intakeData?.intendedLocation || 'N/A' }}</div>
              </div>

              <div class="border-t border-gray-800/60 pt-3">
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Course of Interest</div>
                <div class="text-white mt-1 font-medium">{{ applicant.intakeData?.courseOfInterest || 'N/A' }}</div>
              </div>

              <div class="border-t border-gray-800/60 pt-3">
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Preferred School</div>
                <div class="text-white mt-1 font-medium">{{ applicant.intakeData?.schoolOfChoice || 'N/A' }}</div>
              </div>

              <div class="border-t border-gray-800/60 pt-3">
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tuition Budget</div>
                <div class="text-white mt-1 font-medium">{{ applicant.intakeData?.budget || 'N/A' }}</div>
              </div>

              <div class="border-t border-gray-800/60 pt-3">
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Qualifications</div>
                <div class="text-white mt-1 font-medium leading-relaxed bg-gray-900/30 p-3 rounded-lg border border-gray-800/50 mt-1.5">
                  {{ applicant.intakeData?.currentQualifications || 'N/A' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Secure Document Vault Viewer -->
        <div class="lg:col-span-2 space-y-6">
          <div class="glass-panel p-6 rounded-2xl border border-gray-800">
            <h3 class="text-lg font-bold text-white mb-2 border-b border-gray-800 pb-2">Verified Documents Vault</h3>
            <p class="text-xs text-gray-400 mb-6">Review the applicant's credentials verified by Counselor {{ applicant.assignedCounselor?.name }}.</p>

            <div class="space-y-4">
              <div
                v-for="docType in mandatoryDocTypes"
                :key="docType"
                class="p-4 rounded-xl glass-card border flex items-center justify-between gap-4"
                :class="getDocumentCardClass(docType)"
              >
                <div class="flex items-center space-x-3">
                  <div class="p-2.5 rounded-lg border bg-gray-900/50 text-green-400">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <div class="font-bold text-white text-sm">{{ formatDocType(docType) }}</div>
                    <div class="text-xs text-green-400 mt-0.5">Verified & Secured</div>
                  </div>
                </div>

                <div>
                  <a
                    v-if="isDocUploaded(docType)"
                    :href="`http://localhost:5001${getDocFileUrl(docType)}`"
                    target="_blank"
                    class="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white transition shadow flex items-center space-x-1.5"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>View / Download</span>
                  </a>
                  <span v-else class="text-xs text-gray-500 font-semibold italic">Not available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useApplicantsStore } from '../stores/applicants';

const route = useRoute();
const authStore = useAuthStore();
const applicantsStore = useApplicantsStore();

const applicantId = route.params.id;

const loading = ref(true);
const selectedStatus = ref('');

const mandatoryDocTypes = ['Passport', 'CV', 'Certificate', 'EnglishProof', 'SOP', 'Reference', 'NameChange'];

const applicant = computed(() => applicantsStore.currentApplicant);
const documents = computed(() => applicantsStore.documents);

const loadApplicant = async () => {
  loading.value = true;
  const res = await applicantsStore.fetchApplicantById(applicantId);
  if (res) {
    selectedStatus.value = res.status;
    await applicantsStore.fetchDocuments(applicantId);
  }
  loading.value = false;
};

onMounted(() => {
  loadApplicant();
});

const updateStatus = async () => {
  try {
    await applicantsStore.updateApplicantStatus(applicantId, selectedStatus.value);
    alert('Pipeline status updated successfully!');
  } catch (err) {
    alert('Failed to update status: ' + err.message);
    // revert select value
    if (applicant.value) {
      selectedStatus.value = applicant.value.status;
    }
  }
};

const isDocUploaded = (docType) => {
  return documents.value.some(d => d.documentType === docType);
};

const getDocFileUrl = (docType) => {
  const doc = documents.value.find(d => d.documentType === docType);
  return doc ? doc.fileUrl : '';
};

const formatDocType = (type) => {
  switch (type) {
    case 'EnglishProof': return 'English Language Proof';
    case 'NameChange': return 'Name Change Certificate';
    case 'SOP': return 'Statement of Purpose (SOP)';
    default: return type;
  }
};

const formatStatus = (status) => {
  if (!status) return '';
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'READY_FOR_APP':
      return 'bg-blue-500/10 border-blue-500/20 text-blue-300';
    case 'APP_IN_PROGRESS':
      return 'bg-purple-500/10 border-purple-500/20 text-purple-300';
    case 'DECISION_PENDING':
      return 'bg-orange-500/10 border-orange-500/20 text-orange-300';
    case 'CLOSED_WON':
      return 'bg-green-500/10 border-green-500/20 text-green-300';
    case 'CLOSED_LOST':
      return 'bg-red-500/10 border-red-500/20 text-red-300';
    default:
      return 'bg-gray-500/10 border-gray-500/20 text-gray-300';
  }
};

const getDocumentCardClass = (docType) => {
  return isDocUploaded(docType) ? 'border-green-500/20 bg-green-950/5' : 'border-gray-800';
};
</script>
