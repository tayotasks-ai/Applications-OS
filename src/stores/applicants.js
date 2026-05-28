import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

const API_URL = 'http://localhost:5001/api';

export const useApplicantsStore = defineStore('applicants', {
  state: () => ({
    applicants: [],
    currentApplicant: null,
    documents: [],
    loading: false,
    error: null,
  }),

  actions: {
    getAuthHeaders() {
      const authStore = useAuthStore();
      return {
        'Authorization': `Bearer ${authStore.token}`,
      };
    },

    async fetchApplicants(filters = {}) {
      this.loading = true;
      this.error = null;
      try {
        const queryParams = new URLSearchParams();
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.assignedUser) queryParams.append('assignedUser', filters.assignedUser);

        const response = await fetch(`${API_URL}/applicants?${queryParams.toString()}`, {
          headers: this.getAuthHeaders(),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch applicants.');

        this.applicants = data;
      } catch (err) {
        console.error('Fetch applicants error:', err);
        this.error = err.message || 'Server error fetching applicants.';
      } finally {
        this.loading = false;
      }
    },

    async fetchApplicantById(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_URL}/applicants/${id}`, {
          headers: this.getAuthHeaders(),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch applicant details.');

        this.currentApplicant = data;
        return data;
      } catch (err) {
        console.error('Fetch applicant details error:', err);
        this.error = err.message || 'Server error fetching details.';
        return null;
      } finally {
        this.loading = false;
      }
    },

    async createApplicant(applicantData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_URL}/applicants`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...this.getAuthHeaders(),
          },
          body: JSON.stringify(applicantData),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to create applicant.');

        this.applicants.unshift(data);
        return data;
      } catch (err) {
        console.error('Create applicant error:', err);
        this.error = err.message || 'Server error creating applicant.';
        return null;
      } finally {
        this.loading = false;
      }
    },

    async updateApplicantIntake(id, updateData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_URL}/applicants/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...this.getAuthHeaders(),
          },
          body: JSON.stringify(updateData),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update applicant details.');

        this.currentApplicant = data;
        
        // Update list as well
        const idx = this.applicants.findIndex(a => a._id === id);
        if (idx !== -1) {
          this.applicants[idx] = data;
        }

        return data;
      } catch (err) {
        console.error('Update applicant error:', err);
        this.error = err.message || 'Server error updating applicant.';
        return null;
      } finally {
        this.loading = false;
      }
    },

    async updateApplicantStatus(id, newStatus) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_URL}/applicants/${id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...this.getAuthHeaders(),
          },
          body: JSON.stringify({ status: newStatus }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update status.');

        if (this.currentApplicant && this.currentApplicant._id === id) {
          this.currentApplicant.status = data.status;
        }

        // Update list
        const idx = this.applicants.findIndex(a => a._id === id);
        if (idx !== -1) {
          this.applicants[idx].status = data.status;
        }

        return data;
      } catch (err) {
        console.error('Update status error:', err);
        this.error = err.message || 'Server error updating status.';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchDocuments(applicantId) {
      this.error = null;
      try {
        const response = await fetch(`${API_URL}/applicants/${applicantId}/documents`, {
          headers: this.getAuthHeaders(),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch documents.');

        this.documents = data;
        return data;
      } catch (err) {
        console.error('Fetch documents error:', err);
        this.error = err.message || 'Server error fetching documents.';
        return [];
      }
    },

    async uploadDocument(applicantId, documentType, file) {
      this.loading = true;
      this.error = null;
      try {
        const formData = new FormData();
        formData.append('documentType', documentType);
        formData.append('file', file);

        const response = await fetch(`${API_URL}/applicants/${applicantId}/documents`, {
          method: 'POST',
          headers: this.getAuthHeaders(), // Do NOT set Content-Type, browser will handle boundary
          body: formData,
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to upload document.');

        // Update documents list
        const idx = this.documents.findIndex(d => d.documentType === documentType);
        if (idx !== -1) {
          this.documents[idx] = data;
        } else {
          this.documents.push(data);
        }

        return data;
      } catch (err) {
        console.error('Upload document error:', err);
        this.error = err.message || 'Server error uploading document.';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async verifyDocument(documentId, isVerified) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_URL}/documents/${documentId}/verify`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...this.getAuthHeaders(),
          },
          body: JSON.stringify({ isVerified }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to verify document.');

        // Update local document item
        const idx = this.documents.findIndex(d => d._id === documentId);
        if (idx !== -1) {
          this.documents[idx].isVerified = data.isVerified;
        }

        return data;
      } catch (err) {
        console.error('Verify document error:', err);
        this.error = err.message || 'Server error verifying document.';
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
