/**
 * Validation Helper Functions
 */

import { VALIDATION } from '../../constants';

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password) => {
  return password && password.length >= VALIDATION.MIN_PASSWORD_LENGTH;
};

/**
 * Validate name
 */
export const isValidName = (name) => {
  return name && 
         name.length >= VALIDATION.MIN_NAME_LENGTH && 
         name.length <= VALIDATION.MAX_NAME_LENGTH;
};

/**
 * Validate required field
 */
export const isRequired = (value) => {
  return value !== null && value !== undefined && value.trim() !== '';
};

/**
 * Validate message content
 */
export const isValidMessage = (content) => {
  return content && 
         content.trim().length > 0 && 
         content.length <= VALIDATION.MAX_MESSAGE_LENGTH;
};

/**
 * Validate bio length
 */
export const isValidBio = (bio) => {
  return !bio || bio.length <= VALIDATION.MAX_BIO_LENGTH;
};

/**
 * Validate URL format
 */
export const isValidURL = (url) => {
  if (!url) return true; // Optional field
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get validation errors for registration
 */
export const validateRegistration = (data) => {
  const errors = {};

  if (!isRequired(data.name)) {
    errors.name = 'Name is required';
  } else if (!isValidName(data.name)) {
    errors.name = `Name must be between ${VALIDATION.MIN_NAME_LENGTH} and ${VALIDATION.MAX_NAME_LENGTH} characters`;
  }

  if (!isRequired(data.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!isRequired(data.password)) {
    errors.password = 'Password is required';
  } else if (!isValidPassword(data.password)) {
    errors.password = `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`;
  }

  return errors;
};

/**
 * Get validation errors for login
 */
export const validateLogin = (data) => {
  const errors = {};

  if (!isRequired(data.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!isRequired(data.password)) {
    errors.password = 'Password is required';
  }

  return errors;
};

export default {
  isValidEmail,
  isValidPassword,
  isValidName,
  isRequired,
  isValidMessage,
  isValidBio,
  isValidURL,
  validateRegistration,
  validateLogin
};
