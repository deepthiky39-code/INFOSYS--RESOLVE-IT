// API Service for connecting to Java Spring Boot backend

const API_BASE_URL = 'http://noble-adventure-production.up.railway.app/api';

// Helper function to get token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to create headers
const createHeaders = (includeAuth: boolean = true, isFormData: boolean = false): HeadersInit => {
  const headers: HeadersInit = {};
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Handle API response
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response;
};

// Authentication API
export const authAPI = {
  signup: async (data: { name: string; email: string; password: string; phoneNumber?: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: createHeaders(false),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: createHeaders(false),
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userRole', data.role);
    }
    return data;
  },

  adminLogin: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: createHeaders(false),
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userRole', data.role);
    }
    return data;
  },

  forgotPassword: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password?email=${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: createHeaders(false),
    });
    return handleResponse(response);
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
  },
};

// Complaints API (User)
export const complaintAPI = {
  submit: async (data: {
    title: string;
    category: string;
    transportType: string;
    description: string;
    route: string;
    incidentDate: string;
    photos?: File[];
  }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('transportType', data.transportType);
    formData.append('description', data.description);
    formData.append('route', data.route);
    formData.append('incidentDate', data.incidentDate);
    
    if (data.photos && data.photos.length > 0) {
      data.photos.forEach((photo) => {
        formData.append('photos', photo);
      });
    }

    const response = await fetch(`${API_BASE_URL}/complaints`, {
      method: 'POST',
      headers: createHeaders(true, true),
      body: formData,
    });
    return handleResponse(response);
  },

  getUserComplaints: async () => {
    const response = await fetch(`${API_BASE_URL}/complaints/user`, {
      method: 'GET',
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },

  getComplaintById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/complaints/${id}`, {
      method: 'GET',
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },

  getPhotoUrl: (fileName: string) => {
    return `${API_BASE_URL}/complaints/photos/${fileName}`;
  },
};

// Admin API
export const adminAPI = {
  getAllComplaints: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/complaints`, {
      method: 'GET',
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },

  getComplaintsByTransportType: async (type: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/complaints/transport/${type}`, {
      method: 'GET',
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },

  getComplaintDetails: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/admin/complaints/${id}`, {
      method: 'GET',
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },

  updateComplaintStatus: async (id: number, status: string) => {
    const response = await fetch(
      `${API_BASE_URL}/admin/complaints/${id}/status?status=${encodeURIComponent(status)}`,
      {
        method: 'PUT',
        headers: createHeaders(true),
      }
    );
    return handleResponse(response);
  },

  createAdmin: async (data: {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
    role: string;
    department: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/admin/create`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  getAllAdmins: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/list`, {
      method: 'GET',
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },

  updateAdminStatus: async (id: number, status: string) => {
    const response = await fetch(
      `${API_BASE_URL}/admin/${id}/status?status=${encodeURIComponent(status)}`,
      {
        method: 'PUT',
        headers: createHeaders(true),
      }
    );
    return handleResponse(response);
  },

  deleteAdmin: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/admin/${id}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },

  getAnalyticsOverview: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/analytics/overview`, {
      method: 'GET',
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },

  getAdminPerformance: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/analytics/performance`, {
      method: 'GET',
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },
};

// Utility function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Utility function to get user role
export const getUserRole = (): string | null => {
  return localStorage.getItem('userRole');
};

// Utility function to get user data
export const getUserData = () => {
  return {
    email: localStorage.getItem('userEmail'),
    name: localStorage.getItem('userName'),
    role: localStorage.getItem('userRole'),
  };
};
