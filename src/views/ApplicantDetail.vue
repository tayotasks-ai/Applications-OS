<template>
  <div class="min-h-screen pb-12">
    <!-- Header -->
    <header class="glass-panel border-b border-gray-800 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <router-link to="/counselor/dashboard" class="flex items-center text-gray-400 hover:text-white transition mr-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </router-link>
          <span class="text-xl font-bold text-white tracking-wider">Agency Management OS</span>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-sm font-semibold text-white capitalize">{{ authStore.user?.name }} (Counselor)</span>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8" v-if="loading">
      <div class="flex flex-col items-center justify-center py-40 space-y-4">
        <span class="animate-spin h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full"></span>
        <span class="text-gray-400 text-sm">Loading applicant data...</span>
      </div>
    </main>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8" v-else-if="applicant">
      <!-- Title & State Bar -->
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
          <p class="text-gray-400 mt-1">Email: {{ applicant.email }} | Phone: {{ applicant.phone }}</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <!-- State Machine Progress Indicator -->
          <div class="flex flex-col justify-center mr-4" v-if="!allDocsVerified">
            <span class="text-xs text-yellow-400 font-semibold flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {{ verifiedDocsCount }}/7 Documents Verified
            </span>
            <span class="text-xs text-gray-500 mt-0.5">All 7 docs must be verified to promote lead</span>
          </div>
          <div class="flex flex-col justify-center mr-4" v-else>
            <span class="text-xs text-green-400 font-semibold flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              All 7 Documents Verified!
            </span>
          </div>

          <button
            @click="promoteToReady"
            :disabled="!allDocsVerified || applicant.status !== 'IN_COUNSELING' && applicant.status !== 'LEAD_NEW'"
            class="px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:border-gray-700 disabled:cursor-not-allowed text-white font-bold text-sm transition shadow-lg flex items-center justify-center"
          >
            Send to Applications
          </button>
        </div>
      </div>

      <!-- Action Alerts -->
      <div v-if="alertMessage" class="p-4 rounded-xl border" :class="alertClass">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm font-medium">{{ alertMessage }}</span>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left 1 Column: Edit Profile & Intake Data -->
        <div class="lg:col-span-1 space-y-6">
          <div class="glass-panel p-6 rounded-2xl border border-gray-800">
            <h3 class="text-lg font-bold text-white mb-4 border-b border-gray-800 pb-2">Intake & Details</h3>
            
            <form @submit.prevent="updateIntakeData" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">First Name</label>
                <input type="text" v-model="editForm.firstName" class="glass-input block w-full px-3.5 py-2 rounded-lg text-sm border" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Last Name</label>
                <input type="text" v-model="editForm.lastName" class="glass-input block w-full px-3.5 py-2 rounded-lg text-sm border" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</label>
                <input type="email" v-model="editForm.email" class="glass-input block w-full px-3.5 py-2 rounded-lg text-sm border" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone</label>
                <input type="text" v-model="editForm.phone" class="glass-input block w-full px-3.5 py-2 rounded-lg text-sm border" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Intended Destination</label>
                <input type="text" v-model="editForm.intakeData.intendedLocation" class="glass-input block w-full px-3.5 py-2 rounded-lg text-sm border" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Course of Interest</label>
                <input type="text" v-model="editForm.intakeData.courseOfInterest" class="glass-input block w-full px-3.5 py-2 rounded-lg text-sm border" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Preferred Institution</label>
                <input type="text" v-model="editForm.intakeData.schoolOfChoice" class="glass-input block w-full px-3.5 py-2 rounded-lg text-sm border" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tuition Budget</label>
                <input type="text" v-model="editForm.intakeData.budget" class="glass-input block w-full px-3.5 py-2 rounded-lg text-sm border" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Current Qualifications</label>
                <textarea rows="3" v-model="editForm.intakeData.currentQualifications" class="glass-input block w-full px-3.5 py-2 rounded-lg text-sm border resize-none"></textarea>
              </div>

              <div class="pt-4 border-t border-gray-800 flex items-center justify-end">
                <button
                  type="submit"
                  :disabled="updatingIntake"
                  class="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-brand-600 hover:bg-brand-500 transition duration-150 disabled:opacity-50"
                >
                  <span v-if="updatingIntake" class="inline-block animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Save Intake Changes
                </button>
              </div>
            </form>
          </div>

          <!-- Journey Timeline Component -->
          <div class="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
            <h3 class="text-lg font-bold text-white border-b border-gray-800 pb-2 flex items-center gap-2">
              <svg class="h-5 w-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
              </svg>
              Journey Timeline
            </h3>

            <!-- Standard Counseling/Pending Stage (Not promoted yet) -->
            <div v-if="applicant.status === 'LEAD_NEW' || applicant.status === 'IN_COUNSELING'" class="p-3.5 rounded-xl border border-yellow-500/20 bg-yellow-950/5">
              <p class="text-xs text-yellow-400 font-semibold uppercase tracking-wider">Preparing Checklists</p>
              <p class="text-[11px] text-gray-400 mt-1 leading-normal">This lead is currently in active counseling. Upload and verify all 7 mandatory documents to qualify for university application tracking.</p>
            </div>
            
            <div v-else-if="applicant.status === 'CLOSED_WON'" class="p-3.5 rounded-xl border border-green-500/20 bg-green-950/5">
              <p class="text-xs text-green-400 font-semibold uppercase tracking-wider">Approved & Enrolled! 🎉</p>
              <p class="text-[11px] text-gray-400 mt-1 leading-normal">This program application has been successfully completed, and program enrollment papers are officially sealed.</p>
            </div>

            <div v-else-if="applicant.status === 'CLOSED_LOST'" class="p-3.5 rounded-xl border border-red-500/20 bg-red-950/5">
              <p class="text-xs text-red-400 font-semibold uppercase tracking-wider">Application Closed</p>
              <p class="text-[11px] text-gray-400 mt-1 leading-normal">This application packet has been closed. Alternative programs or university intakes can be re-routed.</p>
            </div>

            <!-- Stepper steps -->
            <div class="relative pl-5 border-l border-gray-800 space-y-8 mt-2">
              <div v-for="(step, idx) in pipelineSteps" :key="step.title" class="relative">
                
                <!-- Circular Icon Marker -->
                <div class="absolute -left-[29px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center border text-[10px] font-bold transition-all duration-300"
                  :class="[
                    step.state === 'completed' ? 'bg-brand-600 border-brand-500 text-white shadow shadow-brand-500/10' : '',
                    step.state === 'active' ? 'bg-gray-900 border-brand-400 text-brand-400 shadow shadow-brand-500/5 animate-pulse' : '',
                    step.state === 'pending' ? 'bg-gray-950 border-gray-800 text-gray-600' : '',
                    step.state === 'outcome-won' ? 'bg-green-600 border-green-500 text-white shadow shadow-green-500/15' : '',
                    step.state === 'outcome-lost' ? 'bg-red-600 border-red-500 text-white shadow shadow-red-500/15' : ''
                  ]"
                >
                  <svg v-if="step.state === 'completed' || step.state === 'outcome-won'" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else-if="step.state === 'outcome-lost'" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span v-else>{{ idx + 1 }}</span>
                </div>

                <!-- Text metadata -->
                <div class="space-y-0.5" :class="[step.state === 'pending' ? 'opacity-40' : '']">
                  <h4 class="text-xs font-bold leading-none"
                    :class="[
                      step.state === 'completed' ? 'text-gray-300' : '',
                      step.state === 'active' ? 'text-brand-400 font-semibold' : '',
                      step.state === 'pending' ? 'text-gray-600' : '',
                      step.state === 'outcome-won' ? 'text-green-400 font-semibold' : '',
                      step.state === 'outcome-lost' ? 'text-red-400 font-semibold' : ''
                    ]"
                  >
                    {{ step.title }}
                  </h4>
                  <p class="text-[11px] text-gray-500 leading-normal">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right 2 Columns: 7 Mandatory Documents list & Upload Portal -->
        <div class="lg:col-span-2 space-y-6">
          <div class="glass-panel p-6 rounded-2xl border border-gray-800">
            <h3 class="text-lg font-bold text-white mb-1 border-b border-gray-800 pb-2">Mandatory Documents Verification Checklist</h3>
            <p class="text-xs text-gray-400 mb-6">Upload and verify all 7 documents to qualify this applicant for university application tracking.</p>

            <div class="space-y-4">
              <div
                v-for="docType in mandatoryDocTypes"
                :key="docType"
                class="p-4 rounded-xl glass-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border"
                :class="getDocumentCardClass(docType)"
              >
                <!-- Left: Doc name and state -->
                <div class="flex items-start space-x-3.5">
                  <div class="p-2.5 rounded-lg border bg-gray-900/50">
                    <!-- Icon based on status -->
                    <svg class="h-6 w-6 text-green-400" v-if="isDocVerified(docType)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <svg class="h-6 w-6 text-yellow-400" v-else-if="isDocUploaded(docType)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <svg class="h-6 w-6 text-gray-500" v-else fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div class="font-bold text-white text-base">{{ formatDocType(docType) }}</div>
                    <div class="text-xs text-gray-400 mt-0.5" v-if="isDocVerified(docType)">Verified & Complete</div>
                    <div class="text-xs text-yellow-400 mt-0.5" v-else-if="isDocUploaded(docType)">Uploaded (Pending Verification)</div>
                    <div class="text-xs text-gray-500 mt-0.5" v-else>Not Uploaded</div>
                  </div>
                </div>

                <!-- Right: File uploads & Actions -->
                <div class="flex items-center space-x-3 self-end sm:self-center">
                  <!-- File Download / View Link -->
                  <a
                    v-if="isDocUploaded(docType)"
                    :href="`http://localhost:5001${getDocFileUrl(docType)}`"
                    target="_blank"
                    class="px-3 py-1.5 rounded-lg border border-gray-700 hover:border-gray-500 bg-gray-800 text-xs text-gray-300 font-semibold hover:text-white transition"
                  >
                    View File
                  </a>

                  <!-- Verify Toggle (Counselor only) -->
                  <button
                    v-if="isDocUploaded(docType)"
                    @click="toggleVerify(docType)"
                    class="px-3 py-1.5 rounded-lg text-xs font-bold transition border"
                    :class="isDocVerified(docType)
                      ? 'bg-yellow-600/20 border-yellow-500/30 text-yellow-400 hover:bg-yellow-600/30'
                      : 'bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30'"
                  >
                    {{ isDocVerified(docType) ? 'Revoke Verification' : 'Verify Document' }}
                  </button>

                  <!-- Direct File Upload Button -->
                  <div class="relative">
                    <input
                      type="file"
                      :id="`file-upload-${docType}`"
                      class="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.docx,.doc"
                      @change="handleFileUpload($event, docType)"
                    />
                    <label
                      :for="`file-upload-${docType}`"
                      class="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white transition shadow cursor-pointer flex items-center space-x-1"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span>{{ isDocUploaded(docType) ? 'Re-upload' : 'Upload' }}</span>
                    </label>
                  </div>
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
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useApplicantsStore } from '../stores/applicants';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const applicantsStore = useApplicantsStore();

const applicantId = route.params.id;

const loading = ref(true);
const updatingIntake = ref(false);
const alertMessage = ref('');
const alertClass = ref('');

const mandatoryDocTypes = ['Passport', 'CV', 'Certificate', 'EnglishProof', 'SOP', 'Reference', 'NameChange'];

const editForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  intakeData: {
    intendedLocation: '',
    courseOfInterest: '',
    schoolOfChoice: '',
    budget: '',
    currentQualifications: ''
  }
});

const applicant = computed(() => applicantsStore.currentApplicant);
const documents = computed(() => applicantsStore.documents);

const currentPipelineIndex = computed(() => {
  if (!applicant.value) return -1;
  switch (applicant.value.status) {
    case 'LEAD_NEW':
    case 'IN_COUNSELING':
      return -1; // Not in pipeline yet
    case 'READY_FOR_APP':
      return 0;
    case 'APP_IN_PROGRESS':
      return 1;
    case 'DECISION_PENDING':
    case 'CLOSED_WON':
    case 'CLOSED_LOST':
      return 2;
    default:
      return -1;
  }
});

const pipelineSteps = computed(() => {
  if (!applicant.value) return [];
  const status = applicant.value.status;
  
  return [
    {
      title: 'Ready for Submission',
      description: 'Documents verified. Eligible for dispatch to university admissions.',
      state: currentPipelineIndex.value > 0 ? 'completed' : (currentPipelineIndex.value === 0 ? 'active' : 'pending')
    },
    {
      title: 'Under University Review',
      description: 'Submitted to admissions. Officers are tracking university feedback.',
      state: currentPipelineIndex.value > 1 ? 'completed' : (currentPipelineIndex.value === 1 ? 'active' : 'pending')
    },
    {
      title: status === 'CLOSED_WON' ? 'Approved & Enrolled!' : (status === 'CLOSED_LOST' ? 'Application Closed' : 'Decision Pending'),
      description: status === 'CLOSED_WON' 
        ? 'Successfully admitted.' 
        : (status === 'CLOSED_LOST' ? 'Placement closed or declined.' : 'Admissions decision processing by program coordinators.'),
      state: status === 'CLOSED_WON' 
        ? 'outcome-won' 
        : (status === 'CLOSED_LOST' ? 'outcome-lost' : (currentPipelineIndex.value === 2 ? 'active' : 'pending'))
    }
  ];
});

// Front-end check for whether all 7 mandatory documents are uploaded AND verified
const verifiedDocsCount = computed(() => {
  return documents.value.filter(doc => doc.isVerified).length;
});

const allDocsVerified = computed(() => {
  const verifiedTypes = documents.value
    .filter(doc => doc.isVerified)
    .map(doc => doc.documentType);
  return mandatoryDocTypes.every(type => verifiedTypes.includes(type));
});

const loadApplicant = async () => {
  loading.value = true;
  const res = await applicantsStore.fetchApplicantById(applicantId);
  if (res) {
    // Populate form
    editForm.firstName = res.firstName;
    editForm.lastName = res.lastName;
    editForm.email = res.email;
    editForm.phone = res.phone;
    editForm.intakeData.intendedLocation = res.intakeData?.intendedLocation || '';
    editForm.intakeData.courseOfInterest = res.intakeData?.courseOfInterest || '';
    editForm.intakeData.schoolOfChoice = res.intakeData?.schoolOfChoice || '';
    editForm.intakeData.budget = res.intakeData?.budget || '';
    editForm.intakeData.currentQualifications = res.intakeData?.currentQualifications || '';

    // Fetch uploaded documents
    await applicantsStore.fetchDocuments(applicantId);
  } else {
    showAlert('Failed to load applicant details.', 'bg-red-900/30 border-red-500/40 text-red-200');
  }
  loading.value = false;
};

onMounted(() => {
  loadApplicant();
});

const updateIntakeData = async () => {
  updatingIntake.value = true;
  const success = await applicantsStore.updateApplicantIntake(applicantId, editForm);
  if (success) {
    showAlert('Intake profile details saved successfully!', 'bg-green-900/30 border-green-500/40 text-green-200');
  } else {
    showAlert('Failed to save intake data changes.', 'bg-red-900/30 border-red-500/40 text-red-200');
  }
  updatingIntake.value = false;
};

const handleFileUpload = async (event, docType) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    showAlert(`Uploading ${formatDocType(docType)}...`, 'bg-brand-900/30 border-brand-500/40 text-brand-200');
    await applicantsStore.uploadDocument(applicantId, docType, file);
    showAlert(`${formatDocType(docType)} uploaded successfully!`, 'bg-green-900/30 border-green-500/40 text-green-200');
  } catch (err) {
    showAlert(`Upload failed: ${err.message}`, 'bg-red-900/30 border-red-500/40 text-red-200');
  }
};

const toggleVerify = async (docType) => {
  const doc = documents.value.find(d => d.documentType === docType);
  if (!doc) return;

  const targetState = !doc.isVerified;
  try {
    await applicantsStore.verifyDocument(doc._id, targetState);
    showAlert(
      `Document ${formatDocType(docType)} verification is now ${targetState ? 'APPROVED' : 'REVOKED'}.`,
      'bg-green-900/30 border-green-500/40 text-green-200'
    );
  } catch (err) {
    showAlert(`Verification failed: ${err.message}`, 'bg-red-900/30 border-red-500/40 text-red-200');
  }
};

const promoteToReady = async () => {
  try {
    showAlert('Transitioning lead to university application tracking...', 'bg-brand-900/30 border-brand-500/40 text-brand-200');
    await applicantsStore.updateApplicantStatus(applicantId, 'READY_FOR_APP');
    showAlert('Applicant successfully promoted to READY FOR APP pipeline state!', 'bg-green-900/30 border-green-500/40 text-green-200');
  } catch (err) {
    showAlert(`Transition failed: ${err.message}`, 'bg-red-900/30 border-red-500/40 text-red-200');
  }
};

// Helpers
const isDocUploaded = (docType) => {
  return documents.value.some(d => d.documentType === docType);
};

const isDocVerified = (docType) => {
  const doc = documents.value.find(d => d.documentType === docType);
  return doc ? doc.isVerified : false;
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

const showAlert = (message, cssClass) => {
  alertMessage.value = message;
  alertClass.value = cssClass;
  // Clear alert after 5s
  setTimeout(() => {
    if (alertMessage.value === message) {
      alertMessage.value = '';
    }
  }, 5000);
};

const formatStatus = (status) => {
  if (!status) return '';
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
};

const getStatusBadgeClass = (status) => {
  if (status === 'READY_FOR_APP' || status === 'APP_IN_PROGRESS') {
    return 'bg-green-500/10 border-green-500/20 text-green-300';
  }
  return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300';
};

const getDocumentCardClass = (docType) => {
  if (isDocVerified(docType)) {
    return 'border-green-500/20 bg-green-950/5';
  } else if (isDocUploaded(docType)) {
    return 'border-yellow-500/20 bg-yellow-950/5';
  }
  return 'border-gray-800';
};
</script>
