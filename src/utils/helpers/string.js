/**
 * String Helper Functions
 */

/**
 * Truncate string to specified length
 */
export const truncate = (str, length = 50, suffix = '...') => {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + suffix;
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert to title case
 */
export const toTitleCase = (str) => {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

/**
 * Remove HTML tags
 */
export const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Generate random string
 */
export const randomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Check if string contains only numbers
 */
export const isNumeric = (str) => {
  return /^\d+$/.test(str);
};

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Pluralize word based on count
 */
export const pluralize = (word, count) => {
  return count === 1 ? word : `${word}s`;
};

export default {
  truncate,
  capitalize,
  toTitleCase,
  stripHtml,
  getInitials,
  randomString,
  isNumeric,
  formatNumber,
  pluralize
};
