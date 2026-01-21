import BaseService from './BaseService';

/**
 * Notification Service - Handles notification operations
 */
class NotificationService extends BaseService {
  constructor() {
    super('/notifications');
  }

  /**
   * Get all notifications
   */
  async getNotifications() {
    try {
      return await this.get('');
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    try {
      return await this.put('/mark-all-read');
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Mark single notification as read
   */
  async markAsRead(notificationId) {
    try {
      return await this.put(`/${notificationId}/mark-read`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get unread count
   */
  getUnreadCount(notifications) {
    return notifications.filter(n => !n.isRead).length;
  }
}

export default new NotificationService();
