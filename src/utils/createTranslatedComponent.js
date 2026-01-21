/**
 * Helper to quickly check if translations are working
 * Usage: wrap your component text with t('key')
 */

export const getTranslationKeys = (page) => {
  const keys = {
    dashboard: 'dashboard',
    messages: 'messages',
    anonymous: 'anonymous',
    profile: 'profile',
    editProfile: 'editProfile',
    auth: 'auth',
    notifications: 'notifications',
    common: 'common',
    header: 'header',
    footer: 'footer'
  };
  
  return keys[page] || 'common';
};
