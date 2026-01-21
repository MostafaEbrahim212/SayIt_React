import axios from 'axios';
import { API_CONFIG, AUTH_CONFIG } from '../config';

/**
 * HTTP Client - Axios instance with interceptors
 */
class HttpClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(AUTH_CONFIG.tokenKey);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear auth and redirect to login
          localStorage.removeItem(AUTH_CONFIG.tokenKey);
          localStorage.removeItem(AUTH_CONFIG.userKey);
          window.location.href = '/login';
        }

        if (error.response?.status === 403) {
          // Forbidden - user is blocked
          const message = error.response.data?.message || 'Access forbidden';
          throw new Error(message);
        }

        const message = error.response?.data?.message || error.message || 'An error occurred';
        throw new Error(message);
      }
    );
  }

  async get(url, config = {}) {
    return this.client.get(url, config);
  }

  async post(url, data, config = {}) {
    return this.client.post(url, data, config);
  }

  async put(url, data, config = {}) {
    return this.client.put(url, data, config);
  }

  async patch(url, data, config = {}) {
    return this.client.patch(url, data, config);
  }

  async delete(url, config = {}) {
    return this.client.delete(url, config);
  }
}

export default new HttpClient();
