import BaseService from './BaseService';

/**
 * User Profile Service - Handles user profile operations
 */
class UserProfileService extends BaseService {
  constructor() {
    super('');
  }

  /**
   * Get current user profile
   */
  async getMyProfile() {
    try {
      return await this.get('/profile');
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update current user profile
   */
  async updateMyProfile(profileData) {
    try {
      return await this.post('/profile', profileData);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId) {
    try {
      return await this.get(`/profile/user/${userId}`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Search users
   */
  async searchUsers(query) {
    try {
      return await this.get(`/profile/search?query=${encodeURIComponent(query)}`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Add relation (follow/block)
   */
  async addRelation(toUserId, type) {
    try {
      return await this.post('/relation', { toUserId, type });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Remove relation
   */
  async removeRelation(relationId) {
    try {
      return await this.delete(`/relation/${relationId}`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get user relations
   */
  async getUserRelations(userId, toUserId = null) {
    try {
      const url = toUserId 
        ? `/relations/${userId}?to=${toUserId}`
        : `/relations/${userId}`;
      return await this.get(url);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get single relation
   */
  async getRelation(params) {
    try {
      const queryString = new URLSearchParams(params).toString();
      return await this.get(`/relation?${queryString}`);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export default new UserProfileService();
