/**
 * Date and Time Helper Functions
 */

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;

  // Less than a minute
  if (diff < 60000) {
    return 'Just now';
  }

  // Less than an hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }

  // Less than a day
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }

  // Less than a week
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  }

  // More than a week
  return d.toLocaleDateString();
};

/**
 * Format time to readable string
 */
export const formatTime = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Format date and time
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

/**
 * Check if date is today
 */
export const isToday = (date) => {
  if (!date) return false;
  
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

/**
 * Check if date is yesterday
 */
export const isYesterday = (date) => {
  if (!date) return false;
  
  const d = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.toDateString() === yesterday.toDateString();
};

/**
 * Get relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  if (isToday(date)) {
    return formatTime(date);
  }
  
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  
  return formatDate(date);
};

export default {
  formatDate,
  formatTime,
  formatDateTime,
  isToday,
  isYesterday,
  getRelativeTime
};
