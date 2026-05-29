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

        <!-- Tab Switcher for Officer Lead -->
        <div class="flex bg-gray-900/60 p-1.5 rounded-xl border border-gray-800 self-start shrink-0">
          <button
            @click="activeView = 'kanban'"
            class="px-4 py-2 text-xs font-bold rounded-lg transition"
            :class="activeView === 'kanban' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'"
          >
            Admissions Pipeline
          </button>
          <button
            @click="activeView = 'workload'"
            class="px-4 py-2 text-xs font-bold rounded-lg transition"
            :class="activeView === 'workload' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'"
          >
            Officer Workloads & Stats
          </button>
        </div>

        <!-- Dynamic Workload Filter Dropdown -->
        <div v-if="activeView === 'kanban'" class="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-gray-900/60 border border-gray-800 p-3 rounded-2xl shrink-0">
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
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6" v-else-if="activeView === 'kanban'">
        
        <!-- Column 1: READY_FOR_APP -->
        <div class="glass-panel p-5 rounded-2xl border border-gray-800 flex flex-col h-[750px] relative overflow-hidden">
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
              <!-- return request warning block -->
              <div v-if="app.returnRequested" class="p-2.5 rounded-lg bg-orange-950/40 border border-orange-500/20 text-orange-400 text-xs flex flex-col space-y-1 shrink-0">
                <div class="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 animate-pulse"></span>
                  Return Requested
                </div>
                <div class="italic">"{{ app.returnRequestReason }}"</div>
                <button
                  @click="approveReturn(app._id)"
                  class="mt-1.5 py-1 px-2.5 rounded bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-extrabold uppercase transition text-center shadow shadow-orange-500/20"
                >
                  Approve & Return
                </button>
              </div>

              <div @click="viewDetail(app._id)" class="grow space-y-2">
                <div class="font-bold text-white text-base hover:text-brand-300 transition">{{ app.firstName }} {{ app.lastName }}</div>
                <div class="text-xs text-brand-400 font-semibold uppercase tracking-wider">{{ app.intakeData?.courseOfInterest }}</div>
                <div class="text-xs text-gray-400">{{ app.intakeData?.schoolOfChoice }} ({{ app.intakeData?.intendedLocation }})</div>
              </div>
              
              <!-- Dispatch/Officer Assignment Dropdown -->
              <div class="pt-2 flex flex-col space-y-1 shrink-0">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Assign Officer:</label>
                <select
                  :value="app.assignedOfficer?._id || ''"
                  @change="assignOfficer(app._id, $event.target.value)"
                  class="glass-input text-[11px] px-2 py-1 rounded-lg border font-medium text-white bg-gray-900/60 w-full"
                >
                  <option value="">Unassigned ⚠️</option>
                  <option
                    v-for="officer in applicationOfficers"
                    :key="officer._id"
                    :value="officer._id"
                  >
                    {{ officer.name }}
                  </option>
                </select>
              </div>

              <div class="pt-3 border-t border-gray-800 flex items-center justify-between shrink-0">
                <button
                  v-if="!app.returnRequested"
                  @click="approveReturn(app._id)"
                  class="px-2 py-1 rounded border border-gray-700 hover:border-red-500 hover:text-red-400 text-[10px] font-bold transition"
                >
                  Return to Counselor
                </button>
                <div v-else></div>
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
        <div class="glass-panel p-5 rounded-2xl border border-gray-800 flex flex-col h-[750px] relative overflow-hidden">
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
              <!-- return request warning block -->
              <div v-if="app.returnRequested" class="p-2.5 rounded-lg bg-orange-950/40 border border-orange-500/20 text-orange-400 text-xs flex flex-col space-y-1 shrink-0">
                <div class="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 animate-pulse"></span>
                  Return Requested
                </div>
                <div class="italic">"{{ app.returnRequestReason }}"</div>
                <button
                  @click="approveReturn(app._id)"
                  class="mt-1.5 py-1 px-2.5 rounded bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-extrabold uppercase transition text-center shadow shadow-orange-500/20"
                >
                  Approve & Return
                </button>
              </div>

              <div @click="viewDetail(app._id)" class="grow space-y-2">
                <div class="font-bold text-white text-base hover:text-brand-300 transition">{{ app.firstName }} {{ app.lastName }}</div>
                <div class="text-xs text-brand-400 font-semibold uppercase tracking-wider">{{ app.intakeData?.courseOfInterest }}</div>
                <div class="text-xs text-gray-400">{{ app.intakeData?.schoolOfChoice }} ({{ app.intakeData?.intendedLocation }})</div>
              </div>
              
              <!-- Dispatch/Officer Assignment Dropdown -->
              <div class="pt-2 flex flex-col space-y-1 shrink-0">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Assign Officer:</label>
                <select
                  :value="app.assignedOfficer?._id || ''"
                  @change="assignOfficer(app._id, $event.target.value)"
                  class="glass-input text-[11px] px-2 py-1 rounded-lg border font-medium text-white bg-gray-900/60 w-full"
                >
                  <option value="">Unassigned ⚠️</option>
                  <option
                    v-for="officer in applicationOfficers"
                    :key="officer._id"
                    :value="officer._id"
                  >
                    {{ officer.name }}
                  </option>
                </select>
              </div>

              <div class="pt-3 border-t border-gray-800 flex items-center justify-between shrink-0">
                <button
                  v-if="!app.returnRequested"
                  @click="approveReturn(app._id)"
                  class="px-2 py-1 rounded border border-gray-700 hover:border-red-500 hover:text-red-400 text-[10px] font-bold transition"
                >
                  Return to Counselor
                </button>
                <div v-else></div>
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
        <div class="glass-panel p-5 rounded-2xl border border-gray-800 flex flex-col h-[750px] relative overflow-hidden">
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
              <!-- return request warning block -->
              <div v-if="app.returnRequested" class="p-2.5 rounded-lg bg-orange-950/40 border border-orange-500/20 text-orange-400 text-xs flex flex-col space-y-1 shrink-0">
                <div class="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 animate-pulse"></span>
                  Return Requested
                </div>
                <div class="italic">"{{ app.returnRequestReason }}"</div>
                <button
                  @click="approveReturn(app._id)"
                  class="mt-1.5 py-1 px-2.5 rounded bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-extrabold uppercase transition text-center shadow shadow-orange-500/20"
                >
                  Approve & Return
                </button>
              </div>

              <div @click="viewDetail(app._id)" class="grow space-y-2">
                <div class="font-bold text-white text-base hover:text-brand-300 transition">{{ app.firstName }} {{ app.lastName }}</div>
                <div class="text-xs text-brand-400 font-semibold uppercase tracking-wider">{{ app.intakeData?.courseOfInterest }}</div>
                <div class="text-xs text-gray-400">{{ app.intakeData?.schoolOfChoice }} ({{ app.intakeData?.intendedLocation }})</div>
              </div>
              
              <!-- Dispatch/Officer Assignment Dropdown -->
              <div class="pt-2 flex flex-col space-y-1 shrink-0">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Assign Officer:</label>
                <select
                  :value="app.assignedOfficer?._id || ''"
                  @change="assignOfficer(app._id, $event.target.value)"
                  class="glass-input text-[11px] px-2 py-1 rounded-lg border font-medium text-white bg-gray-900/60 w-full"
                >
                  <option value="">Unassigned ⚠️</option>
                  <option
                    v-for="officer in applicationOfficers"
                    :key="officer._id"
                    :value="officer._id"
                  >
                    {{ officer.name }}
                  </option>
                </select>
              </div>

              <div class="pt-3 border-t border-gray-800 flex flex-col space-y-2.5 shrink-0">
                <div class="flex justify-between items-center w-full">
                  <button
                    v-if="!app.returnRequested"
                    @click="approveReturn(app._id)"
                    class="px-2 py-1 rounded border border-gray-700 hover:border-red-500 hover:text-red-400 text-[10px] font-bold transition"
                  >
                    Return
                  </button>
                  <div v-else></div>
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

      <!-- OFFICER WORKLOADS & STATS GRID -->
      <div v-else-if="activeView === 'workload'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="officer in applicationOfficers"
          :key="officer._id"
          class="glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-between space-y-6 relative overflow-hidden bg-slate-900/40"
        >
          <!-- Glow background decor -->
          <div class="absolute -top-12 -right-12 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl"></div>

          <div class="space-y-4">
            <!-- Officer Header info -->
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-bold text-white text-lg">{{ officer.name }}</h4>
                <p class="text-xs text-gray-400 mt-0.5">{{ officer.email }}</p>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 border border-green-500/20 text-green-300">
                Active
              </span>
            </div>

            <!-- Active Workload visual meter -->
            <div class="space-y-2 pt-2 border-t border-gray-900">
              <div class="flex justify-between text-xs font-semibold text-gray-400">
                <span>Active Load Capacity</span>
                <span>{{ getOfficerStats(officer._id).total }} / 10 cases</span>
              </div>
              <div class="w-full h-2 bg-gray-900 border border-gray-800 overflow-hidden relative rounded-full">
                <div
                  class="h-full bg-brand-500 transition-all duration-500 rounded-full"
                  :style="{ width: `${Math.min((getOfficerStats(officer._id).total / 10) * 100, 100)}%` }"
                  :class="getOfficerStats(officer._id).total >= 8 ? 'bg-red-500' : getOfficerStats(officer._id).total >= 5 ? 'bg-yellow-500' : 'bg-brand-500'"
                ></div>
              </div>
            </div>
          </div>

          <!-- Stats grid -->
          <div class="grid grid-cols-2 gap-3 pt-4 border-t border-gray-900">
            <div class="p-3 bg-gray-900/30 rounded-xl border border-gray-900">
              <div class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Admissions Review</div>
              <div class="text-lg font-bold text-purple-400 mt-1">{{ getOfficerStats(officer._id).progress }}</div>
            </div>
            <div class="p-3 bg-gray-900/30 rounded-xl border border-gray-900">
              <div class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Decisions Pending</div>
              <div class="text-lg font-bold text-orange-400 mt-1">{{ getOfficerStats(officer._id).pending }}</div>
            </div>
            <div class="p-3 bg-gray-900/30 rounded-xl border border-gray-900">
              <div class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Correction Returns</div>
              <div class="text-lg font-bold text-red-400 mt-1">{{ getOfficerStats(officer._id).returns }}</div>
            </div>
            <div class="p-3 bg-gray-900/30 rounded-xl border border-gray-900">
              <div class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Approved Success</div>
              <div class="text-lg font-bold text-green-400 mt-1">{{ getOfficerStats(officer._id).won }}</div>
            </div>
          </div>
        </div>

        <div v-if="applicationOfficers.length === 0" class="col-span-3 text-center py-20 text-gray-500 italic">
          No application officers registered under your organization.
        </div>
      </div>
    </main>
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

  <!-- CUSTOM RETURN TO COUNSELING CONFIRMATION MODAL -->
  <div
    v-if="showReturnConfirmModal"
    class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-sm"
  >
    <div class="w-full max-w-md glass-panel p-8 rounded-2xl shadow-2xl relative overflow-hidden space-y-6">
      <!-- Glow accent -->
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-orange-500 rounded-full blur-3xl opacity-15"></div>

      <div class="flex justify-between items-center border-b border-gray-800 pb-3">
        <h3 class="text-xl font-extrabold text-white">Confirm Counseling Return</h3>
        <button @click="showReturnConfirmModal = false" class="text-gray-400 hover:text-white transition text-lg">&times;</button>
      </div>

      <div class="space-y-3">
        <p class="text-sm text-gray-300 leading-relaxed">
          Are you sure you want to approve returning this applicant back to counseling?
        </p>
        <p class="text-xs text-orange-400 italic">
          This action will clear all current officer assignments and transfer operational responsibility back to the counseling team.
        </p>
      </div>

      <div class="pt-4 flex space-x-3">
        <button
          type="button"
          @click="showReturnConfirmModal = false"
          class="w-1/2 py-3 rounded-xl border border-gray-700 hover:border-gray-500 text-sm font-semibold text-gray-300 hover:text-white transition"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="handleConfirmReturn"
          class="w-1/2 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold transition shadow shadow-orange-500/20"
        >
          Confirm & Return
        </button>
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

const loading = ref(true);
const selectedOfficerId = ref('');
const applicationOfficers = ref([]);

const activeView = ref('kanban');

const getOfficerStats = (officerId) => {
  const all = applicantsStore.applicants || [];
  const assigned = all.filter(a => a.assignedOfficer && a.assignedOfficer._id === officerId);
  return {
    total: assigned.length,
    ready: assigned.filter(a => a.status === 'READY_FOR_APP').length,
    progress: assigned.filter(a => a.status === 'APP_IN_PROGRESS').length,
    pending: assigned.filter(a => a.status === 'DECISION_PENDING').length,
    returns: assigned.filter(a => a.returnRequested).length,
    won: assigned.filter(a => a.status === 'CLOSED_WON').length,
    lost: assigned.filter(a => a.status === 'CLOSED_LOST').length
  };
};

const showReturnConfirmModal = ref(false);
const selectedReturnApplicantId = ref('');

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

// Fetch users to populate Team Lead workload filters and card dropdowns
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

// Dispatch officer assignment updates from card dropdowns
const assignOfficer = async (id, officerId) => {
  try {
    loading.value = true;
    await applicantsStore.updateApplicantIntake(id, { assignedOfficer: officerId || null });
    await loadData();
    triggerToast('Success: Case assigned to officer.', 'success');
  } catch (err) {
    triggerToast('Failed to assign officer: ' + err.message, 'error');
  } finally {
    loading.value = false;
  }
};

// Senior Officer approves lead return to counseling department
const approveReturn = (id) => {
  selectedReturnApplicantId.value = id;
  showReturnConfirmModal.value = true;
};

const handleConfirmReturn = async () => {
  const id = selectedReturnApplicantId.value;
  showReturnConfirmModal.value = false;
  try {
    loading.value = true;
    await applicantsStore.updateApplicantStatus(id, 'IN_COUNSELING');
    await loadData();
    triggerToast('Success: Applicant returned back to Counseling.', 'success');
  } catch (err) {
    triggerToast('Failed to return applicant: ' + err.message, 'error');
  } finally {
    loading.value = false;
    selectedReturnApplicantId.value = '';
  }
};

// Status transition state promotion handlers
const promoteStatus = async (id, nextStatus) => {
  try {
    loading.value = true;
    await applicantsStore.updateApplicantStatus(id, nextStatus);
    await applicantsStore.fetchApplicants(); // refresh
    triggerToast('Application status updated successfully!', 'success');
  } catch (err) {
    triggerToast('Failed to update applicant state: ' + err.message, 'error');
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
