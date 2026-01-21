import BaseService from './BaseService';
import { AUTH_CONFIG } from '../config';

/**
 * Auth Service - Handles authentication operations
 */
class AuthService extends BaseService {
  constructor() {
    super('/auth');
  }

  /**
   * Save token to localStorage
   */
  saveToken(token) {
    localStorage.setItem(AUTH_CONFIG.tokenKey, token);
  }

  /**
   * Get token from localStorage
   */
  getToken() {
    return localStorage.getItem(AUTH_CONFIG.tokenKey);
  }

  /**
   * Remove token from localStorage
   */
  removeToken() {
    localStorage.removeItem(AUTH_CONFIG.tokenKey);
    localStorage.removeItem(AUTH_CONFIG.userKey);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Register new user
   */
  async register(userData) {
    try {
      const response = await this.post('/register', userData);
      if (response.data?.token) {
        this.saveToken(response.data.token);
      }
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Login user
   */
  async login(credentials) {
    try {
      const response = await this.post('/login', credentials);
      if (response.data?.token) {
        this.saveToken(response.data.token);
      }
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      await this.post('/logout');
      this.removeToken();
      return { success: true };
    } catch (error) {
      // Clear token even if request fails
      this.removeToken();
      return this.handleError(error);
    }
  }

  /**
   * Get user profile
   */
  async getProfile() {
    try {
      return await this.get('/profile');
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates) {
    try {
      return await this.put('/profile', updates);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export default new AuthService();
