import axios from 'axios';
import { Session } from '@supabase/supabase-js';

// API base URL - use environment variable if available, fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/';

// Create an axios instance with default configuration
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor to attach the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('django_access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('django_refresh_token');
        
        if (!refreshToken) {
          // No refresh token available, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Try to refresh the token
        const response = await axios.post(`${API_URL}auth/token/refresh/`, {
          refresh: refreshToken,
        });
        
        const data = response.data as { access?: string };
        if (data.access) {
          const { access } = data;
          localStorage.setItem('django_access_token', access);
          
          // Update authorization header and retry the original request
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Token refresh failed, redirect to login
        localStorage.removeItem('django_access_token');
        localStorage.removeItem('django_refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  // Register a new user
  register: async (userData: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
    company_name?: string;
  }) => {
    try {
      const response = await api.post('auth/register/', userData);
      type RegisterResponse = { tokens?: { access: string; refresh: string } };
      const data = response.data as RegisterResponse;
      
      if (data.tokens) {
        localStorage.setItem('django_access_token', data.tokens.access);
        localStorage.setItem('django_refresh_token', data.tokens.refresh);
      }
      
      return data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },
  
  // Login a user
  login: async (credentials: { username: string; password: string }) => {
    try {
      const response = await api.post('auth/login/', credentials);
      type LoginResponse = { tokens?: { access: string; refresh: string } };
      const data = response.data as LoginResponse;
      
      if (data.tokens) {
        localStorage.setItem('django_access_token', data.tokens.access);
        localStorage.setItem('django_refresh_token', data.tokens.refresh);
      }
      
      return data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },
  
  // Logout a user
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('django_refresh_token');
      if (refreshToken) {
        await api.post('auth/logout/', { refresh: refreshToken });
      }
      
      localStorage.removeItem('django_access_token');
      localStorage.removeItem('django_refresh_token');
      
      return { success: true };
    } catch (error) {
      // Always remove tokens even if API call fails
      localStorage.removeItem('django_access_token');
      localStorage.removeItem('django_refresh_token');
      throw error.response?.data || { message: 'Logout failed' };
    }
  },
  
  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('auth/profile/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },
  
  // Update user profile
  updateProfile: async (profileData: any) => {
    try {
      const response = await api.put('auth/profile/', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },
  
  // Change password
  changePassword: async (passwordData: { current_password: string; new_password: string; confirm_password: string }) => {
    try {
      const response = await api.post('auth/password/change/', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to change password' };
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('django_access_token');
  },

  // Convert Supabase session to Django tokens
  syncAuthWithDjango: async (session: Session | null) => {
    // If Supabase session exists but no Django token, authenticate with Django
    if (session && !localStorage.getItem('django_access_token')) {
      try {
        // Exchange Supabase token for Django token
        const response = await api.post('auth/supabase-auth/', {
          supabase_token: session.access_token,
          user_id: session.user.id,
          email: session.user.email,
        });

        type SupabaseAuthResponse = { tokens?: { access: string; refresh: string } };
        const data = response.data as SupabaseAuthResponse;
        
        if (data.tokens) {
          localStorage.setItem('django_access_token', data.tokens.access);
          localStorage.setItem('django_refresh_token', data.tokens.refresh);
        }
        
        return data;
      } catch (error) {
        console.error('Failed to sync Supabase auth with Django:', error);
        throw error.response?.data || { message: 'Authentication sync failed' };
      }
    }
    return null;
  }
};

// API Clients for other services
export const devicesService = {
  getAllDevices: async () => {
    try {
      const response = await api.get('devices/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch devices' };
    }
  },
  
  getDeviceById: async (id: string) => {
    try {
      const response = await api.get(`devices/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch device details' };
    }
  }
};

export const marketplaceService = {
  getAllApps: async () => {
    try {
      const response = await api.get('marketplace/apps/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch apps' };
    }
  },
  
  getAppById: async (id: string) => {
    try {
      const response = await api.get(`marketplace/apps/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch app details' };
    }
  },
  
  getCategories: async () => {
    try {
      const response = await api.get('marketplace/categories/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch categories' };
    }
  }
};

export const ordersService = {
  getAllOrders: async () => {
    try {
      const response = await api.get('orders/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch orders' };
    }
  },
  
  getOrderById: async (id: string) => {
    try {
      const response = await api.get(`orders/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch order details' };
    }
  },
  
  createOrder: async (orderData: any) => {
    try {
      const response = await api.post('orders/', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create order' };
    }
  }
};

export const inventoryService = {
  getAllProducts: async () => {
    try {
      const response = await api.get('inventory/products/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch products' };
    }
  },
  
  getProductById: async (id: string) => {
    try {
      const response = await api.get(`inventory/products/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch product details' };
    }
  },
  
  getCategories: async () => {
    try {
      const response = await api.get('inventory/categories/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch categories' };
    }
  }
};

export const analyticsService = {
  getDashboardData: async () => {
    try {
      const response = await api.get('analytics/dashboard/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dashboard data' };
    }
  },
  
  getSalesMetrics: async (period: string) => {
    try {
      const response = await api.get(`analytics/sales-metrics/${period}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch sales metrics' };
    }
  }
};