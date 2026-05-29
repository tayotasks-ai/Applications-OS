import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

import Login from '../views/Login.vue';
import CounselorDashboard from '../views/CounselorDashboard.vue';
import CounselorIntake from '../views/CounselorIntake.vue';
import ApplicantDetail from '../views/ApplicantDetail.vue';
import OfficerPipeline from '../views/OfficerPipeline.vue';
import OfficerApplicantDetail from '../views/OfficerApplicantDetail.vue';
import Billing from '../views/Billing.vue';
import Landing from '../views/Landing.vue';
import OfficerLeadPipeline from '../views/OfficerLeadPipeline.vue';
import Register from '../views/Register.vue';
import RootDashboard from '../views/RootDashboard.vue';

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/billing',
    name: 'Billing',
    component: Billing,
    meta: { requiresAuth: true, roles: ['Admin', 'Counselor', 'ApplicationOfficer', 'OfficerLead'] }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guestOnly: true }
  },
  {
    path: '/root/dashboard',
    name: 'RootDashboard',
    component: RootDashboard,
    meta: { requiresAuth: true, roles: ['Root'] }
  },
  {
    path: '/counselor/dashboard',
    name: 'CounselorDashboard',
    component: CounselorDashboard,
    meta: { requiresAuth: true, roles: ['Counselor', 'CounselorLead', 'Admin'] }
  },
  {
    path: '/counselor/intake',
    name: 'CounselorIntake',
    component: CounselorIntake,
    meta: { requiresAuth: true, roles: ['Counselor', 'CounselorLead', 'Admin'] }
  },
  {
    path: '/counselor/applicant/:id',
    name: 'ApplicantDetail',
    component: ApplicantDetail,
    meta: { requiresAuth: true, roles: ['Counselor', 'CounselorLead', 'Admin'] }
  },
  {
    path: '/officer/pipeline',
    name: 'OfficerPipeline',
    component: OfficerPipeline,
    meta: { requiresAuth: true, roles: ['ApplicationOfficer', 'Admin'] }
  },
  {
    path: '/officer/applicant/:id',
    name: 'OfficerApplicantDetail',
    component: OfficerApplicantDetail,
    meta: { requiresAuth: true, roles: ['ApplicationOfficer', 'Admin'] }
  },
  {
    path: '/lead/pipeline',
    name: 'OfficerLeadPipeline',
    component: OfficerLeadPipeline,
    meta: { requiresAuth: true, roles: ['OfficerLead', 'Admin'] }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: (to) => {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) return '/login';
      
      if (authStore.isRoot) return '/root/dashboard';
      if (authStore.isCounselor) return '/counselor/dashboard';
      if (authStore.isOfficer) return '/officer/pipeline';
      if (authStore.isOfficerLead) return '/lead/pipeline';
      return '/login';
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // If user is already authenticated and visits public landing page, forward directly to dashboard
  if (to.path === '/' && authStore.isAuthenticated) {
    if (authStore.isRoot) {
      return next('/root/dashboard');
    } else if (authStore.isCounselor) {
      return next('/counselor/dashboard');
    } else if (authStore.isOfficer) {
      return next('/officer/pipeline');
    } else if (authStore.isOfficerLead) {
      return next('/lead/pipeline');
    }
  }

  // If page requires auth
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      return next('/login');
    }

    // Check role access
    if (to.meta.roles && !to.meta.roles.includes(authStore.userRole)) {
      // Redirect to correct dashboard based on actual role
      if (authStore.isRoot) {
        return next('/root/dashboard');
      } else if (authStore.isCounselor) {
        return next('/counselor/dashboard');
      } else if (authStore.isOfficer) {
        return next('/officer/pipeline');
      } else if (authStore.isOfficerLead) {
        return next('/lead/pipeline');
      } else {
        authStore.logout();
        return next('/login');
      }
    }
  }

  // If page is guest only (e.g. Login) and user is authenticated, redirect
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    if (authStore.isRoot) {
      return next('/root/dashboard');
    } else if (authStore.isCounselor) {
      return next('/counselor/dashboard');
    } else if (authStore.isOfficer) {
      return next('/officer/pipeline');
    } else if (authStore.isOfficerLead) {
      return next('/lead/pipeline');
    }
  }

  next();
});

export default router;
