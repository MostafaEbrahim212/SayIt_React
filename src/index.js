import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n/config';
import App from './App.jsx';
import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import { NotificationProvider as NotificationSystemProvider } from './context/NotificationSystemContext';
import { PresenceProvider } from './context/PresenceContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        {/* System-level toasts (on-screen) should wrap API notifications */}
        <NotificationSystemProvider>
          <NotificationProvider>
            <PresenceProvider>
              <App />
            </PresenceProvider>
          </NotificationProvider>
        </NotificationSystemProvider>
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>
);
