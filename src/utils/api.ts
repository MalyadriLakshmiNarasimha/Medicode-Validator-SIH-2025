const API_BASE_URL = 'http://localhost:8000/api';

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Patient API functions
export const patientApi = {
  getAll: () => apiClient.get('/patients/'),
  getById: (id: string) => apiClient.get(`/patients/${id}/`),
  create: (data: any) => apiClient.post('/patients/', data),
  update: (id: string, data: any) => apiClient.put(`/patients/${id}/`, data),
  delete: (id: string) => apiClient.delete(`/patients/${id}/`),
  addDiagnosis: (id: string, data: any) => apiClient.post(`/patients/${id}/add_diagnosis/`, data),
  addTreatment: (id: string, data: any) => apiClient.post(`/patients/${id}/add_treatment/`, data),
};

// Diagnosis API functions
export const diagnosisApi = {
  getAll: () => apiClient.get('/diagnoses/'),
  getById: (id: string) => apiClient.get(`/diagnoses/${id}/`),
  updateStatus: (id: string, status: string) => apiClient.post(`/diagnoses/${id}/update_status/`, { status }),
  create: (data: any) => apiClient.post('/diagnoses/', data),
  update: (id: string, data: any) => apiClient.put(`/diagnoses/${id}/`, data),
  delete: (id: string) => apiClient.delete(`/diagnoses/${id}/`),
};

// Treatment API functions
export const treatmentApi = {
  getAll: () => apiClient.get('/treatments/'),
  getById: (id: string) => apiClient.get(`/treatments/${id}/`),
  updateStatus: (id: string, status: string) => apiClient.post(`/treatments/${id}/update_status/`, { status }),
  create: (data: any) => apiClient.post('/treatments/', data),
  update: (id: string, data: any) => apiClient.put(`/treatments/${id}/`, data),
  delete: (id: string) => apiClient.delete(`/treatments/${id}/`),
};

// Report API functions
export const reportApi = {
  getAll: () => apiClient.get('/reports/'),
  generate: (data: any) => apiClient.post('/reports/generate/', data),
  getById: (id: string) => apiClient.get(`/reports/${id}/`),
  delete: (id: string) => apiClient.delete(`/reports/${id}/`),
};

// Validation History API functions
export const validationHistoryApi = {
  getAll: () => apiClient.get('/validation-history/'),
  getRejected: () => apiClient.get('/validation-history/?result=rejected'),
  getById: (id: string) => apiClient.get(`/validation-history/${id}/`),
  getSummary: () => apiClient.get('/validation-history/summary/'),
};
