import BaseService from './BaseService';

/**
 * Message Service - Handles all message-related API calls
 */
class MessageService extends BaseService {
  constructor() {
    super('/messages');
  }

  /**
   * Send a new message
   */
  async sendMessage(receiverId, content, options = {}) {
    try {
      const { isAnonymous = false, replyTo, shareToProfile = false } = options;
      
      return await this.post('', {
        receiverId,
        content,
        isAnonymous,
        replyTo,
        shareToProfile
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get user conversations
   */
  async getConversations() {
    try {
      return await this.get('/conversations');
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get messages for a conversation
   */
  async getConversationMessages(conversationId) {
    try {
      return await this.get(`/conversations/${conversationId}/messages`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Mark message as read
   */
  async markAsRead(messageId) {
    try {
      return await this.put(`/${messageId}/read`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Toggle share to profile
   */
  async toggleShare(messageId, share) {
    try {
      return await this.put(`/${messageId}/share`, { share });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get shared messages for a user
   */
  async getSharedMessages(userId) {
    try {
      return await this.get(`/shared/${userId}`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get anonymous messages
   */
  async getAnonymousMessages() {
    try {
      return await this.get('/anonymous');
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get sent anonymous messages
   */
  async getSentAnonymousMessages() {
    try {
      return await this.get('sent-anonymous');
    } catch (error) {
      return this.handleError(error);
    }
  }
}

const messageService = new MessageService();

export default messageService;
