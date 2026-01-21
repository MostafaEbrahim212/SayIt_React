import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import Dashboard from "../features/dashboard/Dashboard";
import Landing from "../pages/Landing/Landing";
import PrivateRoute from "../components/PrivateRoute";
import EditProfile from "../features/profile/EditProfile";
import UserProfilePage from "../features/profile/UserProfilePage";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import SocketTest from "../pages/SocketTest";
import Notifications from "../pages/Notifications";
import Messages from "../features/messages/Messages";
import AnonymousMessages from "../pages/AnonymousMessages";
import SentAnonymousMessages from "../pages/SentAnonymousMessages";
import NotificationTest from "../pages/NotificationTest";
import NotificationContainer from "../components/NotificationContainer";

function ProfileRedirect() {
  const { user } = useAuth();
  if (!user?.id) return <Navigate to="/login" replace />;
  return <Navigate to={`/profile/${user.id}`} replace />;
}

export default function AppRoutes() {
  return (
    <Router>
      <NotificationContainer />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/socket-test" element={<SocketTest />} />
        <Route path="/notification-test" element={<NotificationTest />} />
        <Route path="/profile" element={<PrivateRoute><ProfileRedirect /></PrivateRoute>} />
        <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}/>
        <Route path="/profile/:id" element={<PrivateRoute><UserProfilePage /></PrivateRoute>}/>
        <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>}/>
        <Route path="/anonymous" element={<PrivateRoute><AnonymousMessages /></PrivateRoute>}/>
        <Route path="/sent-anonymous" element={<PrivateRoute><SentAnonymousMessages /></PrivateRoute>}/>
      </Routes>
    </Router>
  );
}
