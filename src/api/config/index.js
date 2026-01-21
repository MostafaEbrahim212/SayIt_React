/**
 * API Configuration
 */

export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  withCredentials: true
};

export const SOCKET_CONFIG = {
  url: process.env.REACT_APP_SOCKET_URL || 'http://localhost:3000',
  options: {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  }
};

export const AUTH_CONFIG = {
  tokenKey: 'token',
  userKey: 'user'
};
