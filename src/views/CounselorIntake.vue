<template>
  <div class="min-h-screen pb-12">
    <!-- Navbar Header -->
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
          <span class="text-sm font-semibold text-white">{{ authStore.user?.name }}</span>
        </div>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 mt-8">
      <!-- Title -->
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-white">Lead Intake Form</h1>
        <p class="text-gray-400 mt-1">Register a new applicant and record their travel & study preferences.</p>
      </div>

      <!-- Form Panel -->
      <div class="glass-panel p-8 rounded-2xl shadow-xl border border-gray-800 relative">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div v-if="error" class="p-4 rounded-lg bg-red-900/30 border border-red-500/40 text-red-200 text-sm">
            {{ error }}
          </div>

          <!-- Section 1: Contact Information -->
          <div class="space-y-4">
            <h3 class="text-base font-bold text-brand-400 border-b border-gray-800 pb-2">1. Contact Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-300 mb-1">First Name *</label>
                <input
                  id="firstName"
                  type="text"
                  required
                  v-model="form.firstName"
                  class="glass-input block w-full px-4 py-2.5 rounded-lg text-sm border"
                  placeholder="John"
                />
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-300 mb-1">Last Name *</label>
                <input
                  id="lastName"
                  type="text"
                  required
                  v-model="form.lastName"
                  class="glass-input block w-full px-4 py-2.5 rounded-lg text-sm border"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-300 mb-1">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  required
                  v-model="form.email"
                  class="glass-input block w-full px-4 py-2.5 rounded-lg text-sm border"
                  placeholder="john.doe@example.com"
                />
              </div>
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-300 mb-1">Phone Number *</label>
                <input
                  id="phone"
                  type="text"
                  required
                  v-model="form.phone"
                  class="glass-input block w-full px-4 py-2.5 rounded-lg text-sm border"
                  placeholder="+1 555-0100"
                />
              </div>
            </div>
          </div>

          <!-- Section 2: Travel & Academic Intentions -->
          <div class="space-y-4 pt-4">
            <h3 class="text-base font-bold text-brand-400 border-b border-gray-800 pb-2">2. Intentions & Qualifications</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="intendedLocation" class="block text-sm font-medium text-gray-300 mb-1">Intended Destination *</label>
                <input
                  id="intendedLocation"
                  type="text"
                  required
                  v-model="form.intakeData.intendedLocation"
                  class="glass-input block w-full px-4 py-2.5 rounded-lg text-sm border"
                  placeholder="e.g., United Kingdom, Canada"
                />
              </div>
              <div>
                <label for="courseOfInterest" class="block text-sm font-medium text-gray-300 mb-1">Course of Interest *</label>
                <input
                  id="courseOfInterest"
                  type="text"
                  required
                  v-model="form.intakeData.courseOfInterest"
                  class="glass-input block w-full px-4 py-2.5 rounded-lg text-sm border"
                  placeholder="e.g., MSc Data Science, MBA"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="schoolOfChoice" class="block text-sm font-medium text-gray-300 mb-1">Preferred Institution</label>
                <input
                  id="schoolOfChoice"
                  type="text"
                  v-model="form.intakeData.schoolOfChoice"
                  class="glass-input block w-full px-4 py-2.5 rounded-lg text-sm border"
                  placeholder="e.g., University of Oxford"
                />
              </div>
              <div>
                <label for="budget" class="block text-sm font-medium text-gray-300 mb-1">Tuition Budget (per year)</label>
                <input
                  id="budget"
                  type="text"
                  v-model="form.intakeData.budget"
                  class="glass-input block w-full px-4 py-2.5 rounded-lg text-sm border"
                  placeholder="e.g., $30,000 USD / Year"
                />
              </div>
            </div>
            <div>
              <label for="currentQualifications" class="block text-sm font-medium text-gray-300 mb-1">Current Qualifications *</label>
              <textarea
                id="currentQualifications"
                rows="3"
                required
                v-model="form.intakeData.currentQualifications"
                class="glass-input block w-full px-4 py-2.5 rounded-lg text-sm border resize-none"
                placeholder="e.g., Bachelor of Computer Science (CGPA: 3.8/4.0)"
              ></textarea>
            </div>
          </div>

          <!-- Buttons -->
          <div class="pt-6 border-t border-gray-800 flex items-center justify-end space-x-3">
            <router-link
              to="/counselor/dashboard"
              class="px-5 py-2.5 rounded-lg border border-gray-700 hover:border-gray-500 hover:text-white transition text-sm font-medium text-gray-400"
            >
              Cancel
            </router-link>
            <button
              type="submit"
              :disabled="loading"
              class="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition shadow-lg"
            >
              <span v-if="loading" class="inline-block animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              Create Applicant
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useApplicantsStore } from '../stores/applicants';

const router = useRouter();
const authStore = useAuthStore();
const applicantsStore = useApplicantsStore();

const loading = ref(false);
const error = ref('');

const form = reactive({
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

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';

  const res = await applicantsStore.createApplicant(form);
  if (res) {
    router.push('/counselor/dashboard');
  } else {
    error.value = applicantsStore.error || 'Failed to create applicant lead.';
    loading.value = false;
  }
};
</script>
