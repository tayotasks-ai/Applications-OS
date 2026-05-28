<template>
  <div class="min-h-screen text-gray-300 relative overflow-hidden bg-[#080c14]">
    <!-- Decorative Glow Blobs -->
    <div class="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-500/10 blur-[120px] pointer-events-none animate-glow"></div>
    <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-600/5 blur-[120px] pointer-events-none animate-glow"></div>

    <!-- Header Navigation -->
    <nav class="glass-panel border-b border-gray-800 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <svg class="h-8 w-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <span class="text-xl sm:text-2xl font-black text-white tracking-widest bg-clip-text bg-gradient-to-r from-white to-gray-400">
            AGENCY OS
          </span>
        </div>
        
        <div class="flex items-center space-x-6">
          <router-link to="/login" class="text-sm font-semibold text-gray-300 hover:text-white transition">
            Sign In
          </router-link>
          <router-link
            to="/login"
            class="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg hover:shadow-brand-500/25 transition duration-150"
          >
            Start Free Trial
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center space-y-8 relative z-10">
      <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-300 text-xs font-semibold uppercase tracking-wider animate-glow">
        <span>✨ Now supporting automated seat billing</span>
      </div>

      <h1 class="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl mx-auto">
        Unified SaaS Platform for <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-300">Educational Travel Agencies</span>
      </h1>
      
      <p class="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
        Centralize your student lead intake, coordinate document verification checklists, and track active university applications inside a secure B2B SaaS OS.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <router-link
          to="/login"
          class="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-base shadow-xl hover:shadow-brand-500/25 transition duration-150 text-center"
        >
          Claim 14-Day Free Trial
        </router-link>
        <a
          href="#features"
          class="w-full sm:w-auto px-8 py-4 rounded-xl border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-bold text-base transition text-center"
        >
          Explore Features
        </a>
      </div>

      <!-- Mockup Floating Dashboard Panel -->
      <div class="pt-16 max-w-5xl mx-auto">
        <div class="glass-panel p-4 sm:p-6 rounded-2xl shadow-2xl border border-gray-800 relative overflow-hidden bg-gradient-to-b from-gray-900/60 to-gray-950/90">
          <div class="flex items-center justify-between border-b border-gray-800 pb-3 mb-6">
            <div class="flex items-center space-x-2">
              <span class="w-3.5 h-3.5 rounded-full bg-red-500/80"></span>
              <span class="w-3.5 h-3.5 rounded-full bg-yellow-500/80"></span>
              <span class="w-3.5 h-3.5 rounded-full bg-green-500/80"></span>
            </div>
            <div class="px-4 py-1 rounded-lg bg-gray-900/80 border border-gray-800 text-[10px] sm:text-xs text-gray-500 font-mono select-none">
              https://app.agency-os.com/counselor/dashboard
            </div>
            <div class="w-12"></div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div class="glass-card p-4 rounded-xl space-y-2">
              <div class="text-[10px] font-bold text-brand-400 uppercase tracking-widest">Counselor CRM</div>
              <div class="text-sm font-semibold text-white">Student Lead Registration</div>
              <p class="text-xs text-gray-500">Record academic qualifications, budget metrics, and destination preferences instantly.</p>
            </div>
            <div class="glass-card p-4 rounded-xl space-y-2">
              <div class="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">Document Checklist</div>
              <div class="text-sm font-semibold text-white">7 Mandatory Uploads</div>
              <p class="text-xs text-gray-500">Auto-validating CV, Passport, English test records with counselor sign-offs.</p>
            </div>
            <div class="glass-card p-4 rounded-xl space-y-2">
              <div class="text-[10px] font-bold text-green-400 uppercase tracking-widest">Officer Pipeline</div>
              <div class="text-sm font-semibold text-white">Kanban Active Tracking</div>
              <p class="text-xs text-gray-500">Track and transition submissions dynamically through university decision boards.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-16 relative z-10 border-t border-gray-900">
      <div class="text-center space-y-4">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white">Core SaaS Solutions</h2>
        <p class="text-gray-400 max-w-xl mx-auto">Built from the ground up for elite educational consultancies and travel agencies.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- CRM Intake -->
        <div class="glass-panel p-8 rounded-2xl border border-gray-800 space-y-4 hover:border-brand-500/35 transition duration-300">
          <div class="w-12 h-12 rounded-xl bg-brand-600/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mb-6">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white">Sleek Intake CRM</h3>
          <p class="text-sm text-gray-400 leading-relaxed">
            Quickly capture candidate profiles. Counselors can input locations, school preferences, qualifications, and tuition budgets easily.
          </p>
        </div>

        <!-- Secure Document Vault -->
        <div class="glass-panel p-8 rounded-2xl border border-gray-800 space-y-4 hover:border-brand-500/35 transition duration-300">
          <div class="w-12 h-12 rounded-xl bg-brand-600/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mb-6">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white">7 Mandatory Documents Vault</h3>
          <p class="text-sm text-gray-400 leading-relaxed">
            Checklist uploads for CV, Passport, English Proof, and SOP. Lock operational status updates automatically until all 7 documents are verified by counselors.
          </p>
        </div>

        <!-- Kanban Boards -->
        <div class="glass-panel p-8 rounded-2xl border border-gray-800 space-y-4 hover:border-brand-500/35 transition duration-300">
          <div class="w-12 h-12 rounded-xl bg-brand-600/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mb-6">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white">Application Pipeline</h3>
          <p class="text-sm text-gray-400 leading-relaxed">
            Application Officers track university applications inside a clean Kanban pipeline board. Transition candidate states from ready to in progress or decided.
          </p>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-16 relative z-10 border-t border-gray-900 bg-gradient-to-b from-transparent to-brand-950/5">
      <div class="text-center space-y-4">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white font-sans">Transparent Tiers Pricing</h2>
        <p class="text-gray-400 max-w-xl mx-auto">Get started with a free trial and scale seats as your consultancy grows.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <!-- Free Card -->
        <div class="glass-panel p-8 rounded-2xl border border-gray-800 flex flex-col justify-between h-[420px]">
          <div class="space-y-4">
            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-widest">Free</h4>
            <div class="text-4xl font-black text-white">₦0 <span class="text-xs text-gray-500 font-normal">/ forever</span></div>
            <p class="text-xs text-gray-400 leading-relaxed">Perfect for solo counselors starting out educational lead intake.</p>
            <ul class="text-xs text-gray-300 space-y-3 pt-4 border-t border-gray-800/60">
              <li class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-brand-400 mr-2.5"></span> 1 Counselor Seat Limit</li>
              <li class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-brand-400 mr-2.5"></span> 25 Active Applicants Limit</li>
              <li class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-brand-400 mr-2.5"></span> 2GB Storage Limit</li>
            </ul>
          </div>
          <router-link
            to="/login"
            class="w-full py-3 text-xs font-bold rounded-xl bg-gray-850 hover:bg-gray-800 text-center text-white border border-gray-700 transition"
          >
            Get Started
          </router-link>
        </div>

        <!-- Growth Card -->
        <div class="glass-panel p-8 rounded-2xl border border-brand-500/30 bg-brand-950/5 ring-1 ring-brand-500/20 flex flex-col justify-between h-[420px] relative">
          <div class="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-brand-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow">Best Value</div>
          <div class="space-y-4">
            <h4 class="text-xs font-bold text-brand-400 uppercase tracking-widest">Growth</h4>
            <div class="text-4xl font-black text-white">₦25,000 <span class="text-xs text-gray-500 font-normal">/ month</span></div>
            <p class="text-xs text-gray-400 leading-relaxed">For expanding travel consultancy agencies with multiple active counselors.</p>
            <ul class="text-xs text-gray-300 space-y-3 pt-4 border-t border-gray-800/60">
              <li class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-brand-400 mr-2.5"></span> 15 Counselor Seats Limit</li>
              <li class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-brand-400 mr-2.5"></span> Unlimited Active Applicants</li>
              <li class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-brand-400 mr-2.5"></span> 50GB Storage Limit</li>
            </ul>
          </div>
          <router-link
            to="/login"
            class="w-full py-3 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-500 text-center text-white shadow hover:shadow-brand-500/20 transition"
          >
            Claim Free Trial
          </router-link>
        </div>

        <!-- Enterprise Card -->
        <div class="glass-panel p-8 rounded-2xl border border-gray-800 flex flex-col justify-between h-[420px]">
          <div class="space-y-4">
            <h4 class="text-xs font-bold text-gray-500 uppercase tracking-widest">Enterprise</h4>
            <div class="text-4xl font-black text-white">₦75,000 <span class="text-xs text-gray-500 font-normal">/ month</span></div>
            <p class="text-xs text-gray-400 leading-relaxed">For massive global organizations with zero limitations on metrics.</p>
            <ul class="text-xs text-gray-300 space-y-3 pt-4 border-t border-gray-800/60">
              <li class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-brand-400 mr-2.5"></span> Unlimited Counselor Seats</li>
              <li class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-brand-400 mr-2.5"></span> Unlimited Active Applicants</li>
              <li class="flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-brand-400 mr-2.5"></span> Unlimited Storage Limit</li>
            </ul>
          </div>
          <router-link
            to="/login"
            class="w-full py-3 text-xs font-bold rounded-xl bg-gray-850 hover:bg-gray-800 text-center text-white border border-gray-700 transition"
          >
            Contact Sales
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-gray-900 py-12 relative z-10 bg-[#06080e]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-gray-500">
        <div class="flex items-center space-x-2">
          <svg class="h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <span class="font-bold text-gray-400 select-none">AGENCY OS</span>
        </div>
        <div>
          &copy; 2026 Agency Management OS Inc. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Landing view bootstrap
</script>
