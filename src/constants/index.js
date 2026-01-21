/**
 * Application Constants
 */

// Route paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  MESSAGES: '/messages',
  ANONYMOUS_MESSAGES: '/anonymous',
  PROFILE: '/profile/:id',
  MY_PROFILE: '/profile',
  EDIT_PROFILE: '/edit-profile',
  USERS: '/users',
  NOTIFICATIONS: '/notifications',
  SOCKET_TEST: '/socket-test'
};

// Message types
export const MESSAGE_TYPES = {
  REGULAR: 'regular',
  ANONYMOUS: 'anonymous',
  REPLY: 'reply'
};

// Relation types
export const RELATION_TYPES = {
  FOLLOW: 'follow',
  BLOCK: 'block'
};

// Notification types
export const NOTIFICATION_TYPES = {
  MESSAGE: 'message',
  REPLY: 'reply',
  FOLLOW: 'follow',
  ANONYMOUS: 'anonymous'
};

// Socket events
export const SOCKET_EVENTS = {
  MESSAGE_NEW: 'message.new',
  MESSAGE_READ: 'message.read',
  NOTIFICATION: 'notification',
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error'
};

// Toast types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

// Theme colors
export const THEME = {
  PRIMARY: 'amber-400',
  SECONDARY: 'slate-700',
  DARK: 'slate-900',
  DARKER: 'slate-950',
  LIGHT: 'slate-100',
  LIGHTER: 'slate-50'
};

// Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_BIO_LENGTH: 500,
  MAX_MESSAGE_LENGTH: 5000,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50
};

// Pagination
export const PAGINATION = {
  MESSAGES_PER_PAGE: 50,
  USERS_PER_PAGE: 20,
  NOTIFICATIONS_PER_PAGE: 50
};

export default {
  ROUTES,
  MESSAGE_TYPES,
  RELATION_TYPES,
  NOTIFICATION_TYPES,
  SOCKET_EVENTS,
  TOAST_TYPES,
  THEME,
  VALIDATION,
  PAGINATION
};
